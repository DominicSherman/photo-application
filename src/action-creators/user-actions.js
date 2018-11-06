import {SET_ADMIN, SET_EMAIL, SET_LOGGED_IN, SET_NAME, SET_USERS} from '../constants/action-types';
import {getUsers} from '../services/firebase-service';
import {action} from '../constants/action';
import {removeCredentials, storeCredentials} from '../services/async-storage-service';
import {clean} from '../services/helper-functions';
import {setRoot} from '../services/navigation-service';

export const setUsers = () => async (dispatch) => {
    await getUsers().on('value',
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

export const login = () => (dispatch, getState) => {
    const {user, users} = getState();
    const {email, name} = user;
    const authUser = users.find((u) => clean(u.email) === clean(email));

    if (authUser) {
        storeCredentials(authUser, name);
        dispatch(action(SET_ADMIN, authUser.isAdmin));
        dispatch(action(SET_LOGGED_IN, true));
    }

    setRoot(true);
};

export const logout = () => (dispatch) => {
    removeCredentials();
    dispatch(action(SET_EMAIL, ''));
    dispatch(action(SET_NAME, ''));
    dispatch(action(SET_ADMIN, false));
    dispatch(action(SET_LOGGED_IN, false));

    setRoot(false);
};
