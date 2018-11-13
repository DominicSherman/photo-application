import {takeScreenshot} from './e2e-service';

describe('Login', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    afterEach(async () => {
        takeScreenshot();
    });

    it('should login', async () => {
        await element(by.id('emailInput')).tap();
        await element(by.id('emailInput')).typeText('dominic.sherman98@gmail.com');

        await element(by.id('nameInput')).tap();
        await element(by.id('nameInput')).typeText('Dominic');

        await element(by.id('loginButton')).tap();
    });
});