import {getCurrentTime, getTimeForDisplay, openHRLink, openMcMenaminLink} from '../../src/services/helper-functions';
import {HRLinkAndroid, HRLinkApple, McMenaminLinkAndroid, McMenaminLinkApple} from '../../src/constants/variables';

jest.mock('../../src/services/async-storage-service');

describe('helper-functions', () => {
    let Platform,
        Linking;

    beforeEach(() => {
        Platform = require('react-native').Platform;
        Linking = require('react-native').Linking;

        Platform.select = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

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

    describe('openHRLink', () => {
        beforeEach(() => {
            openHRLink();
        });

        it('should use Platform select', () => {
            expect(Platform.select).toHaveBeenCalledTimes(1);
            expect(Platform.select).toHaveBeenCalledWith({
                android: expect.any(Function),
                ios: expect.any(Function)
            });
        });

        it('should open the android link for android', () => {
            const options = Platform.select.mock.calls[0][0];

            options.android();

            expect(Linking.openURL).toHaveBeenCalledTimes(1);
            expect(Linking.openURL).toHaveBeenCalledWith(HRLinkAndroid);
        });

        it('should open the apple link for ios', () => {
            const options = Platform.select.mock.calls[0][0];

            options.ios();

            expect(Linking.openURL).toHaveBeenCalledTimes(1);
            expect(Linking.openURL).toHaveBeenCalledWith(HRLinkApple);
        });
    });

    describe('openMcMenaminLink', () => {
        beforeEach(() => {
            openMcMenaminLink();
        });

        it('should use Platform select', () => {
            expect(Platform.select).toHaveBeenCalledTimes(1);
            expect(Platform.select).toHaveBeenCalledWith({
                android: expect.any(Function),
                ios: expect.any(Function)
            });
        });

        it('should open the android link for android', () => {
            const options = Platform.select.mock.calls[0][0];

            options.android();

            expect(Linking.openURL).toHaveBeenCalledTimes(1);
            expect(Linking.openURL).toHaveBeenCalledWith(McMenaminLinkAndroid);
        });

        it('should open the apple link for ios', () => {
            const options = Platform.select.mock.calls[0][0];

            options.ios();

            expect(Linking.openURL).toHaveBeenCalledTimes(1);
            expect(Linking.openURL).toHaveBeenCalledWith(McMenaminLinkApple);
        });
    });
});
