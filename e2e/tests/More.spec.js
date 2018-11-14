import {email} from '../user-info';
import {login} from '../e2e-service';

describe('More', () => {
    beforeAll(async () => {
        await login(email);
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should be able to log out', async () => {
        await login(email);

        await element(by.label('More').and(by.traits(['button']))).tap();
        await element(by.label('LOGOUT')).tap();

        await expect(element(by.id('emailInput'))).toBeVisible();
    });
});