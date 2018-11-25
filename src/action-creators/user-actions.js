import {
    SET_ADMIN,
    SET_EMAIL,
    SET_ENV, SET_EVENT, SET_EVENTS,
    SET_FAILED_LOGIN,
    SET_LOGGED_IN,
    SET_NAME,
    SET_USERS
} from '../constants/action-types';
import {deleteEventByEventId, deleteMedia, deleteUsers, getEvents, getUsers} from '../services/firebase-service';
import {action} from '../constants/action';
import {removeCredentials, storeCredentials} from '../services/async-storage-service';
import {clean} from '../constants/service';
import {setRoot} from '../services/navigation-service';
import {reverseEnum} from '../constants/variables';

export const setUsers = () => async (dispatch, getState) => {
    const {env, event} = getState();

    await getUsers(env, event.eventId).on('value',
        (snapshot) => {
            const userMap = snapshot.val();

            if (userMap) {
                const users = Object.keys(userMap).map((key) => ({
                    email: userMap[key].email,
                    isAdmin: userMap[key].isAdmin
                }));

                dispatch(action(SET_USERS, users));
            } else {
                dispatch(action(SET_USERS, []));
            }
        }
    );
};

export const setEmail = (email) => (dispatch) => dispatch(action(SET_EMAIL, email));

export const setName = (name) => (dispatch) => dispatch(action(SET_NAME, name));

export const login = () => async (dispatch, getState) => {
    const {user, users, event} = getState();
    const {email, name} = user;
    const authUser = users.find((u) => clean(u.email) === clean(email));

    if (authUser) {
        storeCredentials(authUser, name, event);
        dispatch(action(SET_ADMIN, authUser.isAdmin));
        dispatch(action(SET_LOGGED_IN, true));
        dispatch(action(SET_FAILED_LOGIN, false));
        await setRoot(true, event.eventName);
    } else {
        dispatch(action(SET_FAILED_LOGIN, true));
    }
};

export const logout = () => async (dispatch) => {
    removeCredentials();
    dispatch(action(SET_EMAIL, ''));
    dispatch(action(SET_NAME, ''));
    dispatch(action(SET_ADMIN, false));
    dispatch(action(SET_LOGGED_IN, false));

    await setRoot(false);
};

export const toggleEnv = () => (dispatch, getState) => {
    const {env} = getState();

    dispatch(action(SET_ENV, reverseEnum[env]));
};

export const setEvents = () => async (dispatch, getState) => {
    const {env} = getState();

    await getEvents(env).on('value',
        (snapshot) => {
            const eventMap = snapshot.val();

            if (eventMap) {
                const events = Object.keys(eventMap).map((key) => ({
                    eventId: eventMap[key].eventId,
                    eventName: eventMap[key].eventName,
                    primaryAdmin: eventMap[key].primaryAdmin
                }));

                dispatch(action(SET_EVENTS, events));
            } else {
                dispatch(action(SET_EVENTS, []));
            }
        }
    );
};

export const setEvent = (event) => action(SET_EVENT, event);

export const deleteEvent = (eventId) => (dispatch, getState) => {
    const {env} = getState();

    deleteEventByEventId(env, eventId);
    deleteUsers(env, eventId);
    deleteMedia(env, eventId);
};
