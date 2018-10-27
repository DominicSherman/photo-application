import {AsyncStorage} from 'react-native';
import Chance from 'chance';

import {createRandomUser} from '../model-factory';
import {removeCredentials, storeCredentials, tryToLoadCredentials} from '../../src/services/async-storage-service';

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

    describe('tryToLoadCredentials', () => {
        it('should set the credentials in the state if they are there', async () => {
            const actions = {
                setEmail: jest.fn(),
                setIsAdmin: jest.fn(),
                setLoggedIn: jest.fn(),
                setName: jest.fn()
            };
            const thenSpy = jest.fn();

            AsyncStorage.multiGet.mockReturnValue({then: thenSpy});

            await tryToLoadCredentials(actions);

            expect(AsyncStorage.multiGet).toHaveBeenCalledTimes(1);
            expect(AsyncStorage.multiGet).toHaveBeenCalledWith(['email', 'name', 'isAdmin']);

            const callbackFunction = thenSpy.mock.calls[0][0];

            expectedData = [
                ['email', user.email],
                ['name', name],
                ['isAdmin', 'true']
            ];

            callbackFunction(expectedData);

            expect(actions.setEmail).toHaveBeenCalledTimes(1);
            expect(actions.setEmail).toHaveBeenCalledWith(expectedData[0][1]);
            expect(actions.setLoggedIn).toHaveBeenCalledTimes(1);
            expect(actions.setLoggedIn).toHaveBeenCalledWith(true);
            expect(actions.setName).toHaveBeenCalledTimes(1);
            expect(actions.setName).toHaveBeenCalledWith(expectedData[1][1]);
            expect(actions.setIsAdmin).toHaveBeenCalledTimes(1);
            expect(actions.setIsAdmin).toHaveBeenCalledWith(true);
        });

        it('should not set the credentials in state if they are not there', async () => {
            const actions = {
                setEmail: jest.fn(),
                setIsAdmin: jest.fn(),
                setLoggedIn: jest.fn(),
                setName: jest.fn()
            };
            const thenSpy = jest.fn();

            AsyncStorage.multiGet.mockReturnValue({then: thenSpy});

            await tryToLoadCredentials(actions);

            const callbackFunction = thenSpy.mock.calls[0][0];

            expectedData = [
                ['email', null],
                ['name', null],
                ['isAdmin', 'false']
            ];

            callbackFunction(expectedData);

            expect(actions.setEmail).not.toHaveBeenCalled();
            expect(actions.setLoggedIn).not.toHaveBeenCalled();
            expect(actions.setName).not.toHaveBeenCalled();
            expect(actions.setIsAdmin).not.toHaveBeenCalled();
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
