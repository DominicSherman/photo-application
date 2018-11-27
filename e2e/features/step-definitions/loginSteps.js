import {email, nonAdminEmail} from '../support/user-info';
import {login} from '../../e2e-service';

describe('Login', () => {
    afterEach(async () => {
        await device.launchApp({
            delete: true,
            permissions: {
                photos: 'YES'
            }
        });
    });

    it('should not login if the user is not authenticated', async () => {
        await login('not.authenticated@gmail.com');

        await expect(element(by.id('notAuthorizedText'))).toBeVisible();
        await expect(element(by.label('Upload'))).toNotExist();
    });

    it('should login and show information if the user is an admin', async () => {
        await login(email);

        await expect(element(by.label('Upload'))).toBeVisible();
        await expect(element(by.label('Information').and(by.traits(['button'])))).toBeVisible();
    });
});
