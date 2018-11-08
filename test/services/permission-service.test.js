import Chance from 'chance';

import {requestExternalStorage} from '../../src/services/permission-service';

const chance = new Chance();

describe('permission-service', () => {
    let PermissionsAndroid,
        expectedGranted,
        permission;

    beforeEach(() => {
        permission = chance.string();
        expectedGranted = chance.bool();

        PermissionsAndroid = require('react-native').PermissionsAndroid;
        PermissionsAndroid.RESULTS.GRANTED = expectedGranted;
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE = permission;

        PermissionsAndroid.request = jest.fn(() => expectedGranted);
    });

    it('should use PermissionsAndroid.request', async () => {
        await requestExternalStorage();

        expect(PermissionsAndroid.request).toHaveBeenCalledTimes(1);
        expect(PermissionsAndroid.request).toHaveBeenCalledWith(permission, {
            'message': 'App needs access to external storage',
            'title': 'D&M Photos'
        });
    });

    it('should return true if they accept', async () => {
        const actualValue = await requestExternalStorage();

        expect(actualValue).toBeTruthy();
    });

    it('should return false if they do not accept', async () => {
        PermissionsAndroid.RESULTS.GRANTED = chance.string();

        const actualValue = await requestExternalStorage();

        expect(actualValue).toBeFalsy();
    });
});
