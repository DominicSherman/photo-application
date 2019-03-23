import {AsyncStorage} from 'react-native';

import {SET_ADMIN, SET_EMAIL, SET_ENV, SET_EVENT, SET_LOGGED_IN, SET_NAME} from '../constants/action-types';
import {action} from '../constants/action';

export const storeCredentials = (user, name, event, env) =>
    AsyncStorage.multiSet([
        ['email', user.email],
        ['name', name],
        ['isAdmin', `${user.isAdmin}`],
        ['eventId', event.eventId],
        ['eventName', event.eventName],
        ['primaryAdmin', event.primaryAdmin],
        ['env', env]
    ]);

export const removeCredentials = () =>
    AsyncStorage.multiRemove(['email', 'name', 'isAdmin', 'eventId', 'eventName', 'primaryAdmin', 'env']);

export const tryToLoadCredentials = (store) =>
    AsyncStorage.multiGet(['email', 'name', 'isAdmin', 'eventId', 'eventName', 'primaryAdmin', 'env'])
        .then((data) => {
            const email = data[0][1];
            const name = data[1][1];
            const isAdmin = data[2][1];
            const eventId = data[3][1];
            const eventName = data[4][1];
            const primaryAdmin = data[5][1];
            const env = data[6][1];

            if (email) {
                store.dispatch(action(SET_EMAIL, email));
                store.dispatch(action(SET_EVENT, {
                    eventId,
                    eventName,
                    primaryAdmin
                }));
                store.dispatch(action(SET_ENV, env));
                store.dispatch(action(SET_LOGGED_IN, true));
            } else {
                return [false];
            }

            if (name) {
                store.dispatch(action(SET_NAME, name));
            }

            if (isAdmin === 'true') {
                store.dispatch(action(SET_ADMIN, true));
            }

            return [true, eventName];
        });
