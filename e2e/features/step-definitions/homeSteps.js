import {email} from '../support/user-info';

describe.only('Home', () => {
    beforeAll(async () => {
        await login(email);
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should open image modal and allow user to select images', async () => {
        await switchToDev();

        await element(by.label('Select Images')).tap();

        await expect(element(by.label('Select Images to Upload'))).toBeVisible();

        await element(by.id('touchableImage-IMG_0001.JPG')).tap();
    });
});