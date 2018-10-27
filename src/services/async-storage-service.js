import {AsyncStorage} from 'react-native';

export const storeCredentials = (user, name) =>
    AsyncStorage.multiSet([
        ['email', user.email],
        ['name', name],
        ['isAdmin', `${user.isAdmin}`]
    ]);

export const tryToLoadCredentials = (actions) =>
    AsyncStorage.multiGet(['email', 'name', 'isAdmin']).then((data) => {
        const email = data[0][1];
        const name = data[1][1];
        const isAdmin = data[2][1];

        if (email) {
            actions.setEmail(email);
            actions.setLoggedIn(true);
        }

        if (name) {
            actions.setName(name);
        }

        if (isAdmin === 'true') {
            actions.setIsAdmin(true);
        }
    });

export const removeCredentials = () =>
    AsyncStorage.multiRemove(['email', 'name', 'isAdmin']);
