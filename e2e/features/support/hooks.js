const {BeforeAll, Before, AfterAll, After} = require('cucumber');
const detox = require('detox');
const config = require('../../../package.json').detox;
const testConfig = require('../../../testConfig.js');

BeforeAll({timeout: 89 * 1000}, async () => {
    await detox.init(config);
    await device.launchApp({
        permissions: {
            photos: 'YES'
        }
    });
});

Before({tags: '@LogMeInToDev', timeout: 60000}, async () => {
    await element(by.id('adminButton')).multiTap(10);
    await element(by.id('changeEnvSwitch')).tap();

    await element(by.id(testConfig.devEventId)).tap();
    await element(by.id('emailInput')).tap();
    await element(by.id('emailInput')).typeText(testConfig.email);

    await element(by.id('nameInput')).tap();
    await element(by.id('nameInput')).typeText(testConfig.userName);

    await element(by.id('button-Login')).tap();
});

After({tags: '@LogMeOutOfDev', timeout: 60000}, async () => {
    await element(by.label('More').and(by.traits(['button']))).tap();
    await element(by.id('button-Logout')).tap();
    await element(by.id('adminButton')).multiTap(10);
    await element(by.id('changeEnvSwitch')).tap();
});

AfterAll(async () => {
    await detox.cleanup();
});