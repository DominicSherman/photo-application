import React from 'react';
import Chance from 'chance';

import {
    incrementFinished,
    setCameraRollRows,
    setProgress,
    setSelectedImages,
    setTotal,
    setUploading
} from '../src/actions';
import {numPerRow} from '../src/constants/variables';
import {action} from '../src/constants/action';
import {
    ADD_CAMERA_ROLL_ROW,
    SET_IS_UPLOADING,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD, SET_PROGRESSES, SET_SELECTED_IMAGES, SET_TOTALS
} from '../src/constants/action-types';

jest.mock('../src/constants/helper-functions');

const chance = new Chance();

describe('actions', () => {
    let dispatchSpy,
        getStateStub,
        expectedState;

    beforeEach(() => {
        dispatchSpy = jest.fn();
        expectedState = {
            numFinished: chance.natural(),
            numToUpload: chance.natural(),
            totals: {
                [chance.string()]: chance.string()
            },
            progresses: {
                [chance.string()]: chance.string()
            }
        };
        getStateStub = jest.fn(() => expectedState);
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
            const timesCalled = Math.floor(r.edges.length / numPerRow) + 1;

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
});
