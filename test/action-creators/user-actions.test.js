import Chance from 'chance';

import {login, setEmail, setName, setUsers, logout} from '../../src/action-creators/index';
import {action} from '../../src/constants/action';
import {SET_ADMIN, SET_EMAIL, SET_LOGGED_IN, SET_NAME, SET_USERS} from '../../src/constants/action-types';
import {getUsers} from '../../src/services/firebase-service';
import {createRandomUser} from '../model-factory';
import {removeCredentials, storeCredentials} from '../../src/services/async-storage-service';
import {setRoot} from '../../src/services/navigation-service';

jest.mock('../../src/services/firebase-service');
jest.mock('../../src/services/async-storage-service');
jest.mock('../../src/services/navigation-service');

const chance = new Chance();

describe('user-actions', () => {
    let dispatchSpy;

    beforeEach(() => {
        dispatchSpy = jest.fn();
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

            await setUsers()(dispatchSpy);
        });

        afterEach(() => {
            expectedUserMap = {};
        });

        it('should get the users from firebase', () => {
            expect(getUsers).toHaveBeenCalledTimes(1);
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
            expectedUsers,
            expectedState,
            getStateStub;

        beforeEach(() => {
            expectedUser = createRandomUser({name: chance.string()});
            expectedUsers = [expectedUser, ...chance.n(createRandomUser, chance.d6() + 1)];
            expectedState = {
                user: expectedUser,
                users: expectedUsers
            };

            getStateStub = jest.fn(() => expectedState);
        });

        it('should storeCredentials if it as an authUser', () => {
            login()(dispatchSpy, getStateStub);

            expect(storeCredentials).toHaveBeenCalledTimes(1);
            expect(storeCredentials).toHaveBeenCalledWith(expectedUser, expectedUser.name);
            expect(dispatchSpy).toHaveBeenCalledTimes(2);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_ADMIN, expectedUser.isAdmin));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_LOGGED_IN, true));
        });

        it('should not storeCredentials if it is not an authUser', () => {
            expectedState.users = chance.n(createRandomUser, chance.d6() + 1);
            getStateStub = jest.fn(() => expectedState);

            login()(dispatchSpy, getStateStub);

            expect(storeCredentials).not.toHaveBeenCalled();
        });

        it('should set the root to be logged in', () => {
            login()(dispatchSpy, getStateStub);

            expect(setRoot).toHaveBeenCalledTimes(1);
            expect(setRoot).toHaveBeenCalledWith(true);
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
});
