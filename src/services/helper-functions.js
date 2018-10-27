import {removeCredentials, storeCredentials} from './async-storage-service';

export const getCurrentTime = () => {
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();
    const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds();

    return `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()} ${today.getHours()}:${minutes}:${seconds}`;
};

export const getTimeForDisplay = (duration) => {
    const min = Math.floor(duration / 60);
    const sec = duration % 60 < 10 ? `0${(duration % 60)}` : duration % 60;

    return `${min}:${sec}`;
};

export const clean = (string) => string.replace(/[^a-zA-Z0-9]/g, '');

export const login = (actions, user, users) => {
    const {email, name} = user;
    const authUser = users.find((u) => clean(u.email) === clean(email));

    if (authUser) {
        storeCredentials(authUser, name);
        actions.setIsAdmin(authUser.isAdmin);
        actions.setLoggedIn(true);
    }
};

export const logout = (actions) => {
    removeCredentials();
    actions.setEmail('');
    actions.setName('');
    actions.setIsAdmin(false);
    actions.setLoggedIn(false);
};
