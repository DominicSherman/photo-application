import Chance from 'chance';

import {mediumGray} from '../../src/constants/style-variables';
import {sharedGetImageSource} from '../../src/services/icon-loader';

jest.mock('../../src/services/icon-loader');

const chance = new Chance();

describe('icons factory', () => {
    let iconsFactory;

    beforeEach(() => {
        iconsFactory = require('../../src/services/icons-factory');
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('loadIcons', () => {
        const expectedIconSets = [
            ['Feather', 'home', 25, mediumGray],
            ['Feather', 'more-horizontal', 25, mediumGray],
            ['Feather', 'info', 25, mediumGray],
            ['EvilIcons', 'image', 33, mediumGray]
        ];

        let expectedIconNamesToLoadedIcons;

        beforeEach(() => {
            expectedIconNamesToLoadedIcons = {};

            expectedIconSets.forEach(([, iconName]) => {
                expectedIconNamesToLoadedIcons[iconName] = chance.string();
            });

            sharedGetImageSource.mockImplementation((iconName) =>
                Promise.resolve(expectedIconNamesToLoadedIcons[iconName]));
        });

        it('should load all icons', async () => {
            await iconsFactory.loadIcons();

            expect(sharedGetImageSource).toHaveBeenCalledTimes(expectedIconSets.length);
            expectedIconSets.forEach((set) => {
                expect(sharedGetImageSource).toHaveBeenCalledWith(...set);
            });
        });
    });

    describe('getIcons', () => {
        it('should return default icons if the others have not been loaded', () => {
            const actualIcons = iconsFactory.getIcons();

            expect(actualIcons).toEqual({
                home: {},
                image: {},
                info: {},
                more: {}
            });
        });
    });
});
