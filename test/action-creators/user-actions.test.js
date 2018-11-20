import Chance from 'chance';

import {login, logout, setEmail, setEvent, setEvents, setName, setUsers, toggleEnv} from '../../src/action-creators';
import {action} from '../../src/constants/action';
import {
    SET_ADMIN,
    SET_EMAIL,
    SET_ENV, SET_EVENT, SET_EVENTS,
    SET_FAILED_LOGIN,
    SET_LOGGED_IN,
    SET_NAME,
    SET_USERS
} from '../../src/constants/action-types';
import {getEvents, getUsers} from '../../src/services/firebase-service';
import {createRandomEvent, createRandomUser} from '../model-factory';
import {removeCredentials, storeCredentials} from '../../src/services/async-storage-service';
import {setRoot} from '../../src/services/navigation-service';
import {reverseEnum} from '../../src/constants/variables';

jest.mock('../../src/services/firebase-service');
jest.mock('../../src/services/async-storage-service');
jest.mock('../../src/services/navigation-service');

const chance = new Chance();

describe('user-actions', () => {
    let dispatchSpy,
        getStateStub,
        expectedState;

    beforeEach(() => {
        expectedState = {
            env: chance.string(),
            event: {
                eventId: chance.guid()
            }
        };

        dispatchSpy = jest.fn();
        getStateStub = jest.fn(() => expectedState);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('setUsers', () => {
        let expectedUsers,
            expectedUserMap = {},
            expectedSnapshot,
            onSpy;

        beforeEach(async () => {
            const keys = chance.n(chance.string, chance.d6() + 1);

            expectedUsers = keys.map(() => createRandomUser());
            keys.forEach((key, index) => {
                expectedUserMap = {
                    ...expectedUserMap,
                    [key]: expectedUsers[index]
                };
            });
            expectedSnapshot = {
                val: jest.fn().mockReturnValue(expectedUserMap)
            };
            onSpy = jest.fn();
            getUsers.mockReturnValue({
                on: onSpy
            });

            await setUsers()(dispatchSpy, getStateStub);
        });

        afterEach(() => {
            expectedUserMap = {};
        });

        it('should get the users from firebase', () => {
            expect(getUsers).toHaveBeenCalledTimes(1);
            expect(getUsers).toHaveBeenCalledWith(expectedState.env, expectedState.event.eventId);
        });

        it('should use on', () => {
            expect(onSpy).toHaveBeenCalledTimes(1);
            expect(onSpy).toHaveBeenCalledWith('value', expect.anything());
        });

        it('should add the users to redux if there are any', () => {
            const snapshotCall = onSpy.mock.calls[0][1];

            snapshotCall(expectedSnapshot);
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_USERS, expectedUsers));
        });

        it('should set an empty list to redux if there are any', () => {
            expectedSnapshot = {
                val: jest.fn().mockReturnValue(null)
            };
            const snapshotCall = onSpy.mock.calls[0][1];

            snapshotCall(expectedSnapshot);
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_USERS, []));
        });
    });

    describe('setEmail', () => {
        it('should set the email', () => {
            const email = chance.string();

            setEmail(email)(dispatchSpy);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, email));
        });
    });

    describe('setName', () => {
        it('should set the name', () => {
            const name = chance.string();

            setName(name)(dispatchSpy);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NAME, name));
        });
    });

    describe('login', () => {
        let expectedUser,
            expectedUsers;

        beforeEach(() => {
            expectedUser = createRandomUser({name: chance.string()});
            expectedUsers = [expectedUser, ...chance.n(createRandomUser, chance.d6() + 1)];
            expectedState = {
                ...expectedState,
                user: expectedUser,
                users: expectedUsers
            };

            getStateStub = jest.fn(() => expectedState);
        });

        it('should storeCredentials, login, and the set the root if it as an authUser', () => {
            login()(dispatchSpy, getStateStub);

            expect(storeCredentials).toHaveBeenCalledTimes(1);
            expect(storeCredentials).toHaveBeenCalledWith(expectedUser, expectedUser.name, expectedState.event);
            expect(dispatchSpy).toHaveBeenCalledTimes(3);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_ADMIN, expectedUser.isAdmin));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_FAILED_LOGIN, false));
            expect(setRoot).toHaveBeenCalledTimes(1);
            expect(setRoot).toHaveBeenCalledWith(true, expectedState.event.eventName);
        });

        it('should not storeCredentials and set failedLogin to true if it is not an authUser', () => {
            expectedState.users = chance.n(createRandomUser, chance.d6() + 1);
            getStateStub = jest.fn(() => expectedState);

            login()(dispatchSpy, getStateStub);

            expect(storeCredentials).not.toHaveBeenCalled();
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_FAILED_LOGIN, true));
        });
    });

    describe('logout', () => {
        beforeEach(() => {
            logout()(dispatchSpy);
        });

        it('should remove credentials', () => {
            expect(removeCredentials).toHaveBeenCalledTimes(1);
        });

        it('should reset the user information', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(4);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EMAIL, ''));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NAME, ''));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_ADMIN, false));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, false));
        });

        it('should set the root to be logged out', () => {
            expect(setRoot).toHaveBeenCalledTimes(1);
            expect(setRoot).toHaveBeenCalledWith(false);
        });
    });

    describe('toggleEnv', () => {
        beforeEach(() => {
            toggleEnv()(dispatchSpy, getStateStub);
        });

        it('should dispatch an action to toggle the environment', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(
                action(SET_ENV, reverseEnum[expectedState.env])
            );
        });
    });

    describe('setEvents', () => {
        let expectedEvents,
            expectedEventMap,
            expectedSnapshot,
            onSpy;

        beforeEach(async () => {
            const keys = chance.n(chance.string, chance.d6() + 1);

            expectedEventMap = {};
            expectedEvents = keys.map(() => createRandomEvent());
            keys.forEach((key, index) => {
                expectedEventMap = {
                    ...expectedEventMap,
                    [key]: expectedEvents[index]
                };
            });
            expectedSnapshot = {
                val: jest.fn().mockReturnValue(expectedEventMap)
            };
            onSpy = jest.fn();
            getEvents.mockReturnValue({
                on: onSpy
            });

            await setEvents()(dispatchSpy, getStateStub);
        });

        it('should get the events from firebase', () => {
            expect(getEvents).toHaveBeenCalledTimes(1);
            expect(getEvents).toHaveBeenCalledWith(expectedState.env);
        });

        it('should use on', () => {
            expect(onSpy).toHaveBeenCalledTimes(1);
            expect(onSpy).toHaveBeenCalledWith('value', expect.anything());
        });

        it('should add the events to redux if there are any', () => {
            const snapshotCall = onSpy.mock.calls[0][1];

            snapshotCall(expectedSnapshot);
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EVENTS, expectedEvents));
        });

        it('should set an empty list to redux if there are any', () => {
            expectedSnapshot = {
                val: jest.fn().mockReturnValue(null)
            };
            const snapshotCall = onSpy.mock.calls[0][1];

            snapshotCall(expectedSnapshot);
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_EVENTS, []));
        });
    });

    describe('setEvent', () => {
        it('should return an action to set the event', () => {
            const expectedEvent = createRandomEvent();
            const actualAction = setEvent(expectedEvent);

            expect(actualAction).toEqual(action(SET_EVENT, expectedEvent));
        });
    });
});
