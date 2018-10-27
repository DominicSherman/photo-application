import Chance from 'chance';
import storage from 'firebase/storage';

import {createRandomImage, createRandomUser} from '../model-factory';
import {uploadImage} from '../../src/services/firebase-service';

const chance = new Chance();

jest.mock('react-native-fetch-blob', () => ({
    fs: {},
    polyfill: {
        Blob: {}
    }
}));

global.window = {
    Blob: {},
    XMLHttpRequest: {}
};

describe('firebase-service', () => {
    describe('uploadImage', () => {
        let expectedProps,
            refSpy;

        beforeEach(async () => {
            expectedProps = {
                actions: {
                    incrementFinished: jest.fn(),
                    setProgress: jest.fn(),
                    setTotal: jest.fn()
                },
                image: createRandomImage(),
                index: chance.natural(),
                sessionId: chance.natural(),
                user: createRandomUser()
            };
            refSpy = jest.fn(() => ({
                child: jest.fn()
            }));
            console.log('storage', storage);

            await uploadImage(expectedProps);
        });

        it('should set the total', () => {
            expect(expectedProps.actions.setTotal).toHaveBeenCalledTimes(1);
        });
    });
});
