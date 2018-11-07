import {AsyncStorage} from 'react-native';
import Chance from 'chance';

import {createRandomUser} from '../model-factory';
import {removeCredentials, storeCredentials, tryToLoadCredentials} from '../../src/services/async-storage-service';
import {SET_ADMIN, SET_EMAIL, SET_LOGGED_IN, SET_NAME} from '../../src/constants/action-types';
import {action} from '../../src/constants/action';

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

    describe('tryToLoadCredentials', () => {
        let store,
            dispatchSpy,
            thenSpy,
            callbackFunction;

        beforeEach(async () => {
            dispatchSpy = jest.fn();
            store = {
                dispatch: dispatchSpy
            };
            thenSpy = jest.fn();

            AsyncStorage.multiGet.mockReturnValue({then: thenSpy});

            await tryToLoadCredentials(store);

            callbackFunction = thenSpy.mock.calls[0][0];
        });

        it('should call asyncStorage multiGet', () => {
            expect(AsyncStorage.multiGet).toHaveBeenCalledTimes(1);
            expect(AsyncStorage.multiGet).toHaveBeenCalledWith(['email', 'name', 'isAdmin']);
        });

        it('should set the credentials in the state if they are there', () => {
            expectedData = [
                ['email', user.email],
                ['name', name],
                ['isAdmin', 'true']
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).toHaveBeenCalledTimes(4);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, expectedData[0][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NAME, expectedData[1][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_ADMIN, true));
        });

        it('should not set anything if the email is not there', () => {
            expectedData = [
                ['email', null],
                ['name', name],
                ['isAdmin', 'true']
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).not.toHaveBeenCalled();
        });

        it('should not set the name if it is not there', () => {
            expectedData = [
                ['email', user.email],
                ['name', null],
                ['isAdmin', 'true']
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).toHaveBeenCalledTimes(3);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, expectedData[0][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_ADMIN, true));
        });

        it('should not set isAdmin if it they are not admin', () => {
            expectedData = [
                ['email', user.email],
                ['name', name],
                ['isAdmin', 'false']
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).toHaveBeenCalledTimes(3);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, expectedData[0][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NAME, expectedData[1][1]));
        });
    });
});
