import Chance from 'chance';
import firebase from 'firebase';
import {Platform} from 'react-native';
import RNHeicConverter from 'react-native-heic-converter';
import RNFetchBlob from 'react-native-fetch-blob';

import {createRandomImage, createRandomUser} from '../model-factory';
import {addUser, getUsers, initializeFirebase, uploadImage} from '../../src/services/firebase-service';
import {config, ENV} from '../../src/config';
import {clean} from '../../src/services/helper-functions';

const chance = new Chance();

jest.mock('react-native-fetch-blob', () => ({
    fs: {
        readFile: jest.fn(() => ({
            then: jest.fn()
        }))
    },
    polyfill: {
        Blob: {}
    }
}));
jest.mock('react-native-heic-converter', () => ({
    convert: jest.fn(() => ({
        then: jest.fn()
    }))
}));
jest.mock('firebase');

global.window = {
    Blob: {},
    XMLHttpRequest: {}
};

/* eslint-disable max-nested-callbacks */
describe('firebase-service', () => {
    afterEach(() => {
        firebase.database.mockClear();
    });

    describe('uploadImage', () => {
        let expectedProps,
            setSpy,
            thenSpy,
            downloadSpy,
            onSpy,
            putSpy,
            childSpy,
            storageRefSpy,
            dbRefSpy;

        beforeEach(async () => {
            expectedProps = {
                actions: {
                    incrementFinished: jest.fn(),
                    setProgress: jest.fn(),
                    setTotal: jest.fn()
                },
                image: createRandomImage().image,
                index: chance.natural(),
                sessionId: chance.natural(),
                user: createRandomUser()
            };

            thenSpy = jest.fn();
            downloadSpy = jest.fn(() => ({
                then: thenSpy
            }));
            onSpy = jest.fn();
            putSpy = jest.fn(() => ({
                on: onSpy,
                snapshot: {
                    totalBytes: chance.natural(),
                    ref: {
                        getDownloadURL: downloadSpy
                    }
                }
            }));
            childSpy = jest.fn(() => ({
                put: putSpy
            }));
            storageRefSpy = jest.fn(() => ({
                child: childSpy
            }));
            firebase.storage.mockReturnValue({
                ref: storageRefSpy
            });

            setSpy = jest.fn();
            dbRefSpy = jest.fn(() => ({
                child: jest.fn(() => ({
                    child: jest.fn(() => ({
                        set: setSpy
                    }))
                }))
            }));
            firebase.database.mockReturnValue({
                ref: dbRefSpy
            });

            await uploadImage(expectedProps);
        });

        afterEach(() => {
            RNFetchBlob.fs.readFile.mockClear();
        });

        it('should create an imageRef', () => {
            expect(firebase.storage).toHaveBeenCalledTimes(1);
            expect(storageRefSpy).toHaveBeenCalledTimes(1);
            expect(storageRefSpy).toHaveBeenCalledWith(`${ENV}/${expectedProps.sessionId}`);
            expect(childSpy).toHaveBeenCalledTimes(1);
            expect(childSpy).toHaveBeenCalledWith(`${expectedProps.image.filename}`);
        });

        describe('getUploadUri', () => {
            it('should get the path if the platform is IOS', async () => {
                const expectedURI = chance.string();

                Platform.OS = 'ios';
                expectedProps.image.uri = `file://${expectedURI}`;

                await uploadImage(expectedProps);

                expect(RNFetchBlob.fs.readFile).toHaveBeenCalledWith(expectedURI, 'base64');
            });

            it('should get the path if the platform is android', async () => {
                Platform.OS = 'android';

                await uploadImage(expectedProps);

                expect(RNFetchBlob.fs.readFile).toHaveBeenCalledWith(expectedProps.image.uri, 'base64');
            });

            it('should use the RNHeic converter where applicable', async () => {
                expectedProps.image.filename = `${expectedProps.image.filename}.HEIC`;

                await uploadImage(expectedProps);

                expect(RNHeicConverter.convert).toHaveBeenCalledTimes(1);
                expect(RNHeicConverter.convert).toHaveBeenCalledWith({path: expectedProps.image.uri});
            });

            it('should return the path from the result', async () => {
                const rnHeicThenSpy = jest.fn();

                RNHeicConverter.convert.mockReturnValue({
                    then: rnHeicThenSpy
                });
                expectedProps.image.filename = `${expectedProps.image.filename}.HEIC`;

                await uploadImage(expectedProps);

                const result = {
                    path: chance.string()
                };
                const thenCallback = rnHeicThenSpy.mock.calls[0][0];

                const actualValue = thenCallback(result);

                expect(actualValue).toBe(result.path);
            });
        });

        it('should read the file', () => {
            expect(RNFetchBlob.fs.readFile).toHaveBeenCalledTimes(1);
            expect(RNFetchBlob.fs.readFile).toHaveBeenCalledWith(expectedProps.image.uri, 'base64');
        });

        it('should put the blob', () => {
            expect(putSpy).toHaveBeenCalledTimes(1);
        });

        it('should set the total', () => {
            expect(expectedProps.actions.setTotal).toHaveBeenCalledTimes(1);
        });

        it('should monitor the upload task', () => {
            expect(onSpy).toHaveBeenCalledTimes(1);
            expect(onSpy).toHaveBeenCalledWith('state_changed', expect.anything(), null, expect.anything());
        });

        describe('handleStateChange', () => {
            let snapshot,
                stateChangeCallback;

            beforeEach(() => {
                snapshot = {
                    bytesTransferred: chance.natural()
                };

                stateChangeCallback = onSpy.mock.calls[0][1];
            });

            it('should the progress if bytesTransferred is a number', () => {
                stateChangeCallback(snapshot, expectedProps.index, expectedProps.actions);

                expect(expectedProps.actions.setProgress).toHaveBeenCalledTimes(1);
                expect(expectedProps.actions.setProgress).toHaveBeenCalledWith(expectedProps.index, snapshot.bytesTransferred);
            });

            it('should not the set the progress bytesTransferred is not a number', () => {
                snapshot.bytesTransferred = chance.string();
                stateChangeCallback(snapshot, expectedProps.index, expectedProps.actions);

                expect(expectedProps.actions.setProgress).not.toHaveBeenCalled();
            });
        });

        describe('handleSuccess', () => {
            let successCallback;

            beforeEach(() => {
                successCallback = onSpy.mock.calls[0][3];
            });

            it('should get the download URL', () => {
                successCallback();

                expect(downloadSpy).toHaveBeenCalledTimes(1);
            });

            it('should use then to insert the database ref', () => {
                successCallback();

                expect(thenSpy).toHaveBeenCalledTimes(1);
            });

            it('should insert the database ref for pictures', () => {
                successCallback();

                const downloadUrl = chance.string();
                const thenCallback = thenSpy.mock.calls[0][0];

                thenCallback(downloadUrl);

                expect(firebase.database).toHaveBeenCalledTimes(1);
                expect(firebase.database().ref).toHaveBeenCalledTimes(1);
                expect(firebase.database().ref).toHaveBeenCalledWith(`${ENV}/media`);
                expect(setSpy).toHaveBeenCalledTimes(1);
                expect(setSpy).toHaveBeenCalledWith({
                    email: expectedProps.user.email,
                    fileName: expectedProps.image.filename,
                    height: 4,
                    isVideo: false,
                    name: expectedProps.user.name,
                    url: downloadUrl,
                    width: expectedProps.image.width / expectedProps.image.height * 4
                }, expect.anything());
            });

            it('should insert the database ref for mov files', () => {
                successCallback();

                expectedProps.image.filename = `${expectedProps.image.filename}.mov`;
                const downloadUrl = chance.string();
                const thenCallback = thenSpy.mock.calls[0][0];

                thenCallback(downloadUrl);

                expect(firebase.database).toHaveBeenCalledTimes(1);
                expect(firebase.database().ref).toHaveBeenCalledTimes(1);
                expect(firebase.database().ref).toHaveBeenCalledWith(`${ENV}/media`);
                expect(setSpy).toHaveBeenCalledTimes(1);
                expect(setSpy).toHaveBeenCalledWith({
                    email: expectedProps.user.email,
                    fileName: expectedProps.image.filename,
                    height: 4,
                    isVideo: true,
                    name: expectedProps.user.name,
                    url: downloadUrl,
                    width: expectedProps.image.width / expectedProps.image.height * 4
                }, expect.anything());
            });

            it('should insert the database ref for mp4 files', () => {
                successCallback();

                expectedProps.image.filename = `${expectedProps.image.filename}.mp4`;
                const downloadUrl = chance.string();
                const thenCallback = thenSpy.mock.calls[0][0];

                thenCallback(downloadUrl);

                expect(firebase.database).toHaveBeenCalledTimes(1);
                expect(firebase.database().ref).toHaveBeenCalledTimes(1);
                expect(firebase.database().ref).toHaveBeenCalledWith(`${ENV}/media`);
                expect(setSpy).toHaveBeenCalledTimes(1);
                expect(setSpy).toHaveBeenCalledWith({
                    email: expectedProps.user.email,
                    fileName: expectedProps.image.filename,
                    height: 4,
                    isVideo: true,
                    name: expectedProps.user.name,
                    url: downloadUrl,
                    width: expectedProps.image.width / expectedProps.image.height * 4
                }, expect.anything());
            });

            it('should increment finished if it does not error', () => {
                successCallback();

                expectedProps.image.filename = `${expectedProps.image.filename}.mp4`;
                const downloadUrl = chance.string();
                const thenCallback = thenSpy.mock.calls[0][0];

                thenCallback(downloadUrl);

                const errorCallback = setSpy.mock.calls[0][1];
                const error = null;

                errorCallback(error);

                expect(expectedProps.actions.incrementFinished).toHaveBeenCalledTimes(1);
            });

            it('should not increment finished if it errors', () => {
                successCallback();

                expectedProps.image.filename = `${expectedProps.image.filename}.mp4`;
                const downloadUrl = chance.string();
                const thenCallback = thenSpy.mock.calls[0][0];

                thenCallback(downloadUrl);

                const errorCallback = setSpy.mock.calls[0][1];
                const error = chance.string();

                errorCallback(error);

                expect(expectedProps.actions.incrementFinished).not.toHaveBeenCalled();
            });
        });
    });

    describe('getUsers', () => {
        let refSpy;

        beforeEach(() => {
            refSpy = jest.fn();

            firebase.database.mockReturnValue({
                ref: refSpy
            });

            getUsers();
        });

        it('should use the database', () => {
            expect(firebase.database).toHaveBeenCalledTimes(1);
        });

        it('should get the users from the database', () => {
            expect(refSpy).toHaveBeenCalledTimes(1);
            expect(refSpy).toHaveBeenCalledWith(`${ENV}/users`);
        });
    });

    describe('addUser', () => {
        let email,
            isAdmin,
            setSpy,
            childSpy,
            refSpy;

        beforeEach(() => {
            email = chance.string();
            isAdmin = chance.bool();
            setSpy = jest.fn();
            childSpy = jest.fn(() => ({
                set: setSpy
            }));
            refSpy = jest.fn(() => ({
                child: childSpy
            }));
            firebase.database.mockReturnValue({
                ref: refSpy
            });

            addUser(email, isAdmin);
        });

        it('should use the database', () => {
            expect(firebase.database).toHaveBeenCalledTimes(1);
        });

        it('should create the ref', () => {
            expect(refSpy).toHaveBeenCalledTimes(1);
            expect(refSpy).toHaveBeenCalledWith(`${ENV}/users`);
        });

        it('should create the child ref', () => {
            expect(childSpy).toHaveBeenCalledTimes(1);
            expect(childSpy).toHaveBeenCalledWith(clean(email));
        });

        it('should set the value', () => {
            expect(setSpy).toHaveBeenCalledTimes(1);
            expect(setSpy).toHaveBeenCalledWith({
                email,
                isAdmin
            });
        });
    });

    describe('initalizeFirebase', () => {
        it('should initialize firebase', () => {
            initializeFirebase();
            expect(firebase.initializeApp).toHaveBeenCalledTimes(1);
            expect(firebase.initializeApp).toHaveBeenCalledWith(config);
        });

        it('should not initialize firebase if it already has been', () => {
            initializeFirebase();

            jest.resetAllMocks();

            initializeFirebase();

            expect(firebase.initializeApp).not.toHaveBeenCalled();
        });
    });
});
/* eslint-enable max-nested-callbacks */
