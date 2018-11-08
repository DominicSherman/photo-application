import {AsyncStorage} from 'react-native';

import {SET_ADMIN, SET_EMAIL, SET_LOGGED_IN, SET_NAME} from '../constants/action-types';
import {action} from '../constants/action';

export const storeCredentials = (user, name) =>
    AsyncStorage.multiSet([
        ['email', user.email],
        ['name', name],
        ['isAdmin', `${user.isAdmin}`]
    ]);

export const removeCredentials = () =>
    AsyncStorage.multiRemove(['email', 'name', 'isAdmin']);

export const tryToLoadCredentials = (store) =>
    AsyncStorage.multiGet(['email', 'name', 'isAdmin']).then((data) => {
        const email = data[0][1];
        const name = data[1][1];
        const isAdmin = data[2][1];

        if (email) {
            store.dispatch(action(SET_EMAIL, email));
            store.dispatch(action(SET_LOGGED_IN, true));
        } else {
            return [false, false];
        }

        if (name) {
            store.dispatch(action(SET_NAME, name));
        }

        if (isAdmin === 'true') {
            store.dispatch(action(SET_ADMIN, true));
        }

        return [true, isAdmin === 'true'];
    });
