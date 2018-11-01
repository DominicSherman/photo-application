import {AsyncStorage} from 'react-native';

export const storeCredentials = (user, name) =>
    AsyncStorage.multiSet([
        ['email', user.email],
        ['name', name],
        ['isAdmin', `${user.isAdmin}`]
    ]);

export const removeCredentials = () =>
    AsyncStorage.multiRemove(['email', 'name', 'isAdmin']);
