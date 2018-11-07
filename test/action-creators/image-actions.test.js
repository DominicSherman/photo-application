import Chance from 'chance';

import {
    ADD_CAMERA_ROLL_ROW,
    SET_IS_UPLOADING,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PICTURES,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_VIDEOS
} from '../../src/constants/action-types';
import {
    incrementFinished,
    setCameraRollRows,
    setMedia,
    setProgress,
    setSelectedImages,
    setSelectedRow,
    setTotal,
    setUploading,
    toggleSelected
} from '../../src/action-creators/index';
import {action} from '../../src/constants/action';
import {numPerRow} from '../../src/constants/variables';
import {createRandomImage} from '../model-factory';
import {getMedia} from '../../src/services/firebase-service';

jest.mock('../../src/services/firebase-service');

const chance = new Chance();

describe('image-actions', () => {
    let dispatchSpy,
        getStateStub,
        expectedSelectedImages,
        expectedState;

    beforeEach(() => {
        const items = chance.n(createRandomImage, chance.d6() + 1);

        items.forEach((item) => {
            expectedSelectedImages = {
                ...expectedSelectedImages,
                [`${item.image.filename}`]: item
            };
        });

        expectedState = {
            imageModalVisible: chance.bool(),
            numFinished: chance.natural(),
            numToUpload: chance.natural(),
            progresses: {
                [chance.string()]: chance.string()
            },
            selectedImages: expectedSelectedImages,
            totals: {
                [chance.string()]: chance.string()
            },
            userModalVisible: chance.bool()
        };

        getStateStub = jest.fn(() => expectedState);
        dispatchSpy = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('setCameraRollRows', () => {
        let r;

        const createRandomNode = () => ({
            node: chance.string()
        });

        it('should dispatch an action for every row if r is a multiple of numPerRow', () => {
            r = {
                edges: chance.n(createRandomNode, numPerRow * (chance.d6() + 1))
            };

            setCameraRollRows(r)(dispatchSpy);

            let timesCalled = Math.floor(r.edges.length / numPerRow);

            if (r.edges.length % numPerRow > 0) {
                timesCalled += 1;
            }

            expect(dispatchSpy).toHaveBeenCalledTimes(timesCalled);
            expect(dispatchSpy).toHaveBeenCalledWith(action(ADD_CAMERA_ROLL_ROW, expect.anything()));
        });

        it('should dispatch an action for every row if r is not a multiple of numPerRow', () => {
            r = {
                edges: chance.n(createRandomNode, numPerRow * (chance.d6() + 1))
            };

            if (r.edges.length % numPerRow === 0) {
                r.edges = [...r.edges, createRandomNode()];
            }

            setCameraRollRows(r)(dispatchSpy);

            let timesCalled = Math.floor(r.edges.length / numPerRow);

            if (r.edges.length % numPerRow > 0) {
                timesCalled += 1;
            }

            expect(dispatchSpy).toHaveBeenCalledTimes(timesCalled);
            expect(dispatchSpy).toHaveBeenCalledWith(action(ADD_CAMERA_ROLL_ROW, expect.anything()));
        });
    });

    describe('incrementFinished', () => {
        it('should dispatch an action to increment numFinished', () => {
            expectedState.numFinished = chance.natural();
            expectedState.numToUpload = expectedState.numFinished + 2;

            incrementFinished()(dispatchSpy, getStateStub);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NUM_FINISHED, expectedState.numFinished + 1));
        });

        it('should dispatch actions to reset state when it is done', () => {
            expectedState.numFinished = chance.natural();
            expectedState.numToUpload = expectedState.numFinished + 1;

            incrementFinished()(dispatchSpy, getStateStub);

            expect(dispatchSpy).toHaveBeenCalledTimes(6);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NUM_FINISHED, expectedState.numFinished + 1));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_IS_UPLOADING, false));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NUM_TO_UPLOAD, 0));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NUM_FINISHED, 0));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_PROGRESSES, {}));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_TOTALS, {}));
        });
    });

    describe('setProgress', () => {
        let expectedIndex,
            expectedBytes;

        beforeEach(() => {
            expectedIndex = chance.natural();
            expectedBytes = chance.natural();

            setProgress(expectedIndex, expectedBytes)(dispatchSpy, getStateStub);
        });

        it('should update the progresses with the bytes passed in at the index passed in', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_PROGRESSES, {
                ...expectedState.progresses,
                [expectedIndex]: expectedBytes
            }));
        });
    });

    describe('setTotal', () => {
        let expectedIndex,
            expectedTotal;

        beforeEach(() => {
            expectedIndex = chance.natural();
            expectedTotal = chance.natural();

            setTotal(expectedIndex, expectedTotal)(dispatchSpy, getStateStub);
        });

        it('should update the progresses with the bytes passed in at the index passed in', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_TOTALS, {
                ...expectedState.totals,
                [expectedIndex]: expectedTotal
            }));
        });
    });

    describe('setUploading', () => {
        let expectedNumToUpload;

        beforeEach(() => {
            expectedNumToUpload = chance.natural();

            setUploading(expectedNumToUpload)(dispatchSpy);
        });

        it('should dispatch actions for uploading', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(2);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_NUM_TO_UPLOAD, expectedNumToUpload));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_IS_UPLOADING, true));
        });
    });

    describe('setSelectedImages', () => {
        let expectedSelected;

        beforeEach(() => {
            expectedSelected = chance.n(chance.string, chance.d6() + 1);

            setSelectedImages(expectedSelected)(dispatchSpy);
        });

        it('should dispatch the selected images', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_SELECTED_IMAGES, expectedSelected));
        });
    });

    describe('setSelectedRow', () => {
        it('should add all the items if isSelected is true', () => {
            const row = chance.n(createRandomImage, chance.d6() + 1);

            row.forEach((item) => {
                expectedSelectedImages = {
                    ...expectedSelectedImages,
                    [`${item.image.filename}`]: item
                };
            });

            setSelectedRow(row, true)(dispatchSpy, getStateStub);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_SELECTED_IMAGES, expectedSelectedImages));
        });

        it('should remove all the items if isSelected is false', () => {
            let row = {};

            Object.keys(expectedSelectedImages).forEach((key, i) => {
                if (i % 2 === 0) {
                    row = [...row, expectedSelectedImages[key]];

                    delete expectedSelectedImages[key];
                }
            });

            setSelectedRow(row, false)(dispatchSpy, getStateStub);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_SELECTED_IMAGES, expectedSelectedImages));
        });
    });

    describe('toggleSelected', () => {
        it('should add the image to selected images if it is not selected', () => {
            const item = createRandomImage();

            toggleSelected(item)(dispatchSpy, getStateStub);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_SELECTED_IMAGES, {
                ...expectedSelectedImages,
                [`${item.image.filename}`]: item
            }));
        });

        it('should remove the image from selected images if it is not selected', () => {
            const keys = chance.shuffle(Object.keys(expectedSelectedImages));
            const item = expectedSelectedImages[keys[0]];

            toggleSelected(item)(dispatchSpy, getStateStub);

            delete expectedSelectedImages[`${item.image.filename}`];

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_SELECTED_IMAGES, expectedSelectedImages));
        });
    });

    const createRandomMedia = () => ({
        height: chance.natural(),
        isVideo: chance.bool(),
        name: chance.string(),
        url: chance.string(),
        width: chance.natural()
    });

    const mapValue = (value) => ({
        dimensions: {
            height: value.height,
            width: value.width
        },
        name: value.name,
        source: {
            uri: value.url
        }
    });

    describe('setMedia', () => {
        let onSpy,
            snapshot,
            sessionData,
            expectedSessionKeys,
            expectedPictures,
            expectedVideos,
            expectedMedia;

        beforeEach(() => {
            expectedSessionKeys = chance.n(chance.string, chance.d6() + 1);
            sessionData = {};
            expectedMedia = {};
            expectedPictures = [];
            expectedVideos = [];

            expectedSessionKeys.forEach((key) => {
                const innerKeys = chance.n(chance.string, chance.d6() + 1);

                sessionData = {};
                innerKeys.forEach((innerKey) => {
                    const value = createRandomMedia();

                    sessionData = {
                        ...sessionData,
                        [innerKey]: value
                    };

                    if (value.isVideo) {
                        expectedVideos = [...expectedVideos, mapValue(value)];
                    } else {
                        expectedPictures = [...expectedPictures, mapValue(value)];
                    }
                });
                expectedMedia = {
                    ...expectedMedia,
                    [key]: sessionData
                };
            });

            snapshot = {
                val: jest.fn(() => expectedMedia)
            };
            onSpy = jest.fn();
            getMedia.mockReturnValue({
                on: onSpy
            });

            setMedia()(dispatchSpy, getStateStub);
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should call getMedia', () => {
            expect(getMedia).toHaveBeenCalledTimes(1);
        });

        it('should call on', () => {
            expect(onSpy).toHaveBeenCalledTimes(1);
            expect(onSpy).toHaveBeenCalledWith('value', expect.anything());
        });

        it('should set the pictures and videos if data is returned', () => {
            const snapshotCall = onSpy.mock.calls[0][1];

            snapshotCall(snapshot);
            expect(dispatchSpy).toHaveBeenCalledTimes(2);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_PICTURES, expectedPictures.reverse()));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_VIDEOS, expectedVideos));
        });

        it('should set the pictures and videos to empty lists if media is not returned', () => {
            const snapshotCall = onSpy.mock.calls[0][1];

            snapshot = {
                val: jest.fn(() => null)
            };
            snapshotCall(snapshot);
            expect(dispatchSpy).toHaveBeenCalledTimes(2);
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_PICTURES, []));
            expect(dispatchSpy).toHaveBeenCalledWith(action(SET_VIDEOS, []));
        });
    });
});
