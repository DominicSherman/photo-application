import Chance from 'chance';

import {getCurrentTime, getTimeForDisplay, login, logout} from '../../src/services/helper-functions';
import {createRandomUser} from '../model-factory';
import {removeCredentials, storeCredentials} from '../../src/services/async-storage-service';

jest.mock('../../src/services/async-storage-service');

const chance = new Chance();

describe('helper-functions', () => {
    describe('getCurrentTime', () => {
        it('should return the formatted date', () => {
            const year = () => 1;
            const month = () => 0;
            const date = () => 1;
            const hours = () => 1;
            const minutes = () => 10;
            const seconds = () => 10;
            const expectedCurrentTime = '1-1-1 1:10:10';

            global.Date = jest.fn(() => ({
                getDate: jest.fn(date),
                getFullYear: jest.fn(year),
                getHours: jest.fn(hours),
                getMinutes: jest.fn(minutes),
                getMonth: jest.fn(month),
                getSeconds: jest.fn(seconds)
            }));

            const actualCurrentTime = getCurrentTime();

            expect(actualCurrentTime).toBe(expectedCurrentTime);
        });

        it('should return the formatted date when minutes and seconds are less than 10', () => {
            const year = () => 1;
            const month = () => 0;
            const date = () => 1;
            const hours = () => 1;
            const minutes = () => 0;
            const seconds = () => 0;
            const expectedCurrentTime = '1-1-1 1:00:00';

            global.Date = jest.fn(() => ({
                getDate: jest.fn(date),
                getFullYear: jest.fn(year),
                getHours: jest.fn(hours),
                getMinutes: jest.fn(minutes),
                getMonth: jest.fn(month),
                getSeconds: jest.fn(seconds)
            }));

            const actualCurrentTime = getCurrentTime();

            expect(actualCurrentTime).toBe(expectedCurrentTime);
        });
    });

    describe('getTimeForDisplay', () => {
        it('should get the time for display', () => {
            const duration = 100;

            const actualDisplay = getTimeForDisplay(duration);

            expect(actualDisplay).toEqual('1:40');
        });

        it('should get the time for display when the number of seconds is less than 0', () => {
            const duration = 60;

            const actualDisplay = getTimeForDisplay(duration);

            expect(actualDisplay).toEqual('1:00');
        });
    });

    describe('login', () => {
        let actions,
            user,
            users;

        beforeEach(() => {
            actions = {
                setIsAdmin: jest.fn(),
                setLoggedIn: jest.fn()
            };
            user = createRandomUser();
            users = chance.shuffle([user, ...chance.n(createRandomUser, chance.d6() + 1)]);
        });

        it('should log in if the user is in the list of users passed in', () => {
            login(actions, user, users);

            expect(storeCredentials).toHaveBeenCalledTimes(1);
            expect(storeCredentials).toHaveBeenCalledWith(user, user.name);
            expect(actions.setIsAdmin).toHaveBeenCalledTimes(1);
            expect(actions.setIsAdmin).toHaveBeenCalledWith(user.isAdmin);
            expect(actions.setLoggedIn).toHaveBeenCalledTimes(1);
            expect(actions.setLoggedIn).toHaveBeenCalledWith(true);
        });

        it('should not log in if the user is not in the list of users', () => {
            login(actions, user, chance.n(createRandomUser, chance.d6() + 1));

            expect(actions.setLoggedIn).not.toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should logout', () => {
            const actions = {
                setEmail: jest.fn(),
                setIsAdmin: jest.fn(),
                setLoggedIn: jest.fn(),
                setName: jest.fn()
            };

            logout(actions);

            expect(removeCredentials).toHaveBeenCalledTimes(1);
            expect(actions.setEmail).toHaveBeenCalledTimes(1);
            expect(actions.setEmail).toHaveBeenCalledWith('');
            expect(actions.setName).toHaveBeenCalledTimes(1);
            expect(actions.setName).toHaveBeenCalledWith('');
            expect(actions.setIsAdmin).toHaveBeenCalledTimes(1);
            expect(actions.setIsAdmin).toHaveBeenCalledWith(false);
            expect(actions.setLoggedIn).toHaveBeenCalledTimes(1);
            expect(actions.setLoggedIn).toHaveBeenCalledWith(false);
        });
    });
});
