import Chance from 'chance';

import {
    incrementFinished,
    setCameraRollRows,
    setEmail,
    setName,
    setProgress,
    setSelectedImages,
    setSelectedRow,
    setTotal,
    setUploading,
    setUsers,
    toggleSelected
} from '../src/action-creators/actions';
import {numPerRow} from '../src/constants/variables';
import {action} from '../src/constants/action';
import {
    ADD_CAMERA_ROLL_ROW,
    SET_EMAIL,
    SET_IS_UPLOADING,
    SET_NAME,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_USERS
} from '../src/constants/action-types';
import {getUsers} from '../src/services/firebase-service';

import {createRandomImage, createRandomUser} from './model-factory';

jest.mock('../src/services/firebase-service');

const chance = new Chance();

describe('actions', () => {
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

        beforeEach(() => {
            r = {
                edges: chance.n(createRandomNode, chance.d10() + 1)
            };

            setCameraRollRows(r)(dispatchSpy);
        });

        it('should dispatch an action for every row', () => {
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
});
