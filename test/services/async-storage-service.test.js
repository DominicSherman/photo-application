import {AsyncStorage} from 'react-native';
import Chance from 'chance';

import {createRandomEvent, createRandomUser} from '../model-factory';
import {removeCredentials, storeCredentials, tryToLoadCredentials} from '../../src/services/async-storage-service';
import {SET_ADMIN, SET_EMAIL, SET_EVENT, SET_LOGGED_IN, SET_NAME} from '../../src/constants/action-types';
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
        name,
        event,
        env;

    beforeEach(() => {
        user = createRandomUser();
        name = chance.string();
        event = createRandomEvent();
        env = chance.string();

        expectedData = [
            ['email', user.email],
            ['name', name],
            ['isAdmin', `${user.isAdmin}`],
            ['eventId', event.eventId],
            ['eventName', event.eventName],
            ['primaryAdmin', event.primaryAdmin],
            ['env', env]
        ];
    });

    describe('storeCredentials', () => {
        it('should store the credentials', () => {
            storeCredentials(user, name, event, env);

            expect(AsyncStorage.multiSet).toHaveBeenCalledTimes(1);
            expect(AsyncStorage.multiSet).toHaveBeenCalledWith(expectedData);
        });
    });

    describe('removeCredentials', () => {
        it('should call multiRemove', () => {
            removeCredentials();

            expect(AsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
            expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['email', 'name', 'isAdmin', 'eventId', 'eventName', 'primaryAdmin', 'env']);
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
            expect(AsyncStorage.multiGet).toHaveBeenCalledWith(['email', 'name', 'isAdmin', 'eventId', 'eventName', 'primaryAdmin', 'env']);
        });

        it('should set the credentials in the state if they are there', () => {
            expectedData = [
                ['email', user.email],
                ['name', name],
                ['isAdmin', 'true'],
                ['eventId', event.eventId],
                ['eventName', event.eventName],
                ['primaryAdmin', event.primaryAdmin],
                ['env', env]
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).toHaveBeenCalledTimes(6);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, expectedData[0][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EVENT, event));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NAME, expectedData[1][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_ADMIN, true));
        });

        it('should not set anything if the email is not there', () => {
            expectedData = [
                ['email', null],
                ['name', name],
                ['isAdmin', 'true'],
                ['eventId', event.eventId],
                ['eventName', event.eventName],
                ['primaryAdmin', event.primaryAdmin],
                ['env', env]
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).not.toHaveBeenCalled();
        });

        it('should not set the name if it is not there', () => {
            expectedData = [
                ['email', user.email],
                ['name', null],
                ['isAdmin', 'true'],
                ['eventId', event.eventId],
                ['eventName', event.eventName],
                ['primaryAdmin', event.primaryAdmin],
                ['env', env]
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).toHaveBeenCalledTimes(5);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, expectedData[0][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EVENT, event));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_ADMIN, true));
        });

        it('should not set isAdmin if it they are not admin', () => {
            expectedData = [
                ['email', user.email],
                ['name', name],
                ['isAdmin', 'false'],
                ['eventId', event.eventId],
                ['eventName', event.eventName],
                ['primaryAdmin', event.primaryAdmin],
                ['env', env]
            ];
            callbackFunction(expectedData);

            expect(dispatchSpy).toHaveBeenCalledTimes(5);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, expectedData[0][1]));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EVENT, event));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NAME, expectedData[1][1]));
        });
    });
});
