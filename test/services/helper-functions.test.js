import {getCurrentTime, getTimeForDisplay} from '../../src/services/helper-functions';

jest.mock('../../src/services/async-storage-service');

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
});
