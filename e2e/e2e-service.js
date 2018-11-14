import {userName} from './user-info';

export const login = async (email) => {
    await element(by.id('emailInput')).tap();
    await element(by.id('emailInput')).typeText(email);

    await element(by.id('nameInput')).tap();
    await element(by.id('nameInput')).typeText(userName);

    await element(by.id('loginButton')).tap();
};

export const switchToDev = async () => {
    await element(by.label('More').and(by.traits(['button']))).tap();
    await element(by.id('changeEnvSwitch')).tap();
    await element(by.label('Home').and(by.traits(['button']))).tap();
};