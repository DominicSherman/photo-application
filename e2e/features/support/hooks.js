import {email, prod_eventId, userName} from './user-info';

const {BeforeAll, Before, AfterAll, After} = require('cucumber');
const detox = require('detox');

const config = require('../package.json').detox;

const adapter = require('detox/runners/jest/adapter');

jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

BeforeAll({timeout: 89 * 1000}, async () => {
    await detox.init(config);
    await device.launchApp({
        permissions: {
            photos: 'YES'
        }
    });
});

Before({tags: '@LogMeIn', timeout: 60000}, async () => {
    await element(by.id(prod_eventId)).tap();
    await element(by.id('emailInput')).tap();
    await element(by.id('emailInput')).typeText(email);

    await element(by.id('nameInput')).tap();
    await element(by.id('nameInput')).typeText(userName);

    await element(by.id('loginButton')).tap();
});

Before({tags: '@SwitchToDev', timeout: 60000}, async () => {
    await element(by.label('More').and(by.traits(['button']))).tap();
    await element(by.id('changeEnvSwitch')).tap();
    await element(by.label('Home').and(by.traits(['button']))).tap();
});

AfterAll(async () => {
    await adapter.afterAll();
    await detox.cleanup();
});