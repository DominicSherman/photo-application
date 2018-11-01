import {AsyncStorage} from 'react-native';
import Chance from 'chance';

import {createRandomUser} from '../model-factory';
import {removeCredentials, storeCredentials} from '../../src/services/async-storage-service';

jest.mock('react-native', () => ({
    AsyncStorage: {
        multiGet: jest.fn(),
        multiRemove: jest.fn(),
        multiSet: jest.fn()
    }
}));

const chance = new Chance();

describe('async-storage-service', () => {
    let expectedData,
        user,
        name;

    beforeEach(() => {
        user = createRandomUser();
        name = chance.string();

        expectedData = [
            ['email', user.email],
            ['name', name],
            ['isAdmin', `${user.isAdmin}`]
        ];
    });

    describe('storeCredentials', () => {
        it('should store the credentials', () => {
            storeCredentials(user, name);

            expect(AsyncStorage.multiSet).toHaveBeenCalledTimes(1);
            expect(AsyncStorage.multiSet).toHaveBeenCalledWith(expectedData);
        });
    });

    describe('removeCredentials', () => {
        it('should call multiRemove', () => {
            removeCredentials();

            expect(AsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
            expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['email', 'name', 'isAdmin']);
        });
    });
});
