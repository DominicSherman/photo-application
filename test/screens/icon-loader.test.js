import Chance from 'chance';
import * as Feather from 'react-native-vector-icons/Feather';
import * as EvilIcons from 'react-native-vector-icons/EvilIcons';

import {sharedGetImageSource} from '../../src/services/icon-loader';

jest.mock('react-native-vector-icons/Feather', () => ({
    getImageSource: jest.fn()
}));
jest.mock('react-native-vector-icons/EvilIcons', () => ({
    getImageSource: jest.fn()
}));

const chance = new Chance();

describe('icon-loader', () => {
    let expectedArgs;

    beforeEach(() => {
        expectedArgs = chance.n(chance.string, chance.d4());
    });

    it('should return the getImageSource function for each icon library', () => {
        sharedGetImageSource('Feather', expectedArgs);
        sharedGetImageSource('EvilIcons', expectedArgs);

        expect(Feather.getImageSource).toHaveBeenCalledTimes(1);
        expect(Feather.getImageSource).toHaveBeenCalledWith(expectedArgs);

        expect(EvilIcons.getImageSource).toHaveBeenCalledTimes(1);
        expect(EvilIcons.getImageSource).toHaveBeenCalledWith(expectedArgs);
    });
});
