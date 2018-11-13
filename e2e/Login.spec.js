describe('Login', () => {

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should not login if the user is not authenticated', async () => {
        await element(by.id('emailInput')).tap();
        await element(by.id('emailInput')).typeText('not.authenticated@gmail.com');

        await element(by.id('nameInput')).tap();
        await element(by.id('nameInput')).typeText('Testing');

        await element(by.id('loginButton')).tap();

        await expect(element(by.id('notAuthorizedText'))).toBeVisible();
        await expect(element(by.label('Upload'))).toNotExist();
    });

    it('should login if the user is authenticated', async () => {
        await element(by.id('emailInput')).tap();
        await element(by.id('emailInput')).typeText('dominic.sherman98@gmail.com');

        await element(by.id('nameInput')).tap();
        await element(by.id('nameInput')).typeText('Testing');

        await element(by.id('loginButton')).tap();

        await expect(element(by.label('Upload'))).toBeVisible();
    });
});