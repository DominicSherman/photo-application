import Chance from 'chance';

import reducer from '../src/reducers/reducer';
import {
    ADD_CAMERA_ROLL_ROW, SET_ADMIN, SET_EMAIL,
    SET_IMAGE_MODAL_VISIBLE,
    SET_IS_UPLOADING, SET_LOGGED_IN, SET_NAME,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_USER_MODAL_VISIBLE, SET_USERS
} from '../src/constants/action-types';

const chance = new Chance();

describe('reducer', () => {
    const defaultState = {
        cameraRollRows: [],
        imageModalVisible: false,
        isUploading: false,
        numFinished: 0,
        numToUpload: 0,
        progresses: {},
        selectedImages: {},
        shouldAuthenticate: true,
        totals: {},
        user: {
            email: '',
            isAdmin: false,
            loggedIn: false,
            name: ''
        },
        userModalVisible: false,
        users: null
    };

    let anyAction;

    beforeEach(() => {
        anyAction = chance.string();
    });

    it('should return state if an action fails to match', () => {
        const expectedState = chance.string();

        const actualState = reducer(expectedState, anyAction);

        expect(actualState).toBe(expectedState);
    });

    it('should return the default state if not called with state', () => {
        const actualState = reducer(undefined, anyAction);

        expect(actualState).toEqual(defaultState);
    });

    it('should set imageModalVisible when the action is SET_IMAGE_MODAL_VISIBLE', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            imageModalVisible: chance.bool()
        };

        const expectedData = chance.bool();
        const action = {
            data: expectedData,
            type: SET_IMAGE_MODAL_VISIBLE
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            imageModalVisible: expectedData
        });
    });

    it('should set userModalVisible when the action is SET_USER_MODAL_VISIBLE', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            userModalVisible: chance.bool()
        };

        const expectedData = chance.bool();
        const action = {
            data: expectedData,
            type: SET_USER_MODAL_VISIBLE
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            userModalVisible: expectedData
        });
    });

    it('should add cameraRollRows when the action is ADD_CAMERA_ROLL_ROW', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            cameraRollRows: chance.n(chance.string, chance.d6() + 1)
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: ADD_CAMERA_ROLL_ROW
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            cameraRollRows: [...originalState.cameraRollRows, expectedData]
        });
    });

    it('should set selectedImages when the action is SET_SELECTED_IMAGES', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            selectedImages: chance.string()
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_SELECTED_IMAGES
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            selectedImages: expectedData
        });
    });

    it('should set numToUpload when the action is SET_NUM_TO_UPLOAD', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            numToUpload: chance.natural()
        };

        const expectedData = chance.natural();
        const action = {
            data: expectedData,
            type: SET_NUM_TO_UPLOAD
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            numToUpload: expectedData
        });
    });

    it('should set numFinished when the action is SET_NUM_FINISHED', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            numFinished: chance.natural()
        };

        const expectedData = chance.natural();
        const action = {
            data: expectedData,
            type: SET_NUM_FINISHED
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            numFinished: expectedData
        });
    });

    it('should set isUploading when the action is SET_IS_UPLOADING', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            isUploading: chance.bool()
        };

        const expectedData = chance.bool();
        const action = {
            data: expectedData,
            type: SET_IS_UPLOADING
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            isUploading: expectedData
        });
    });

    it('should set progresses when the action is SET_PROGRESSES', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            progresses: chance.string()
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_PROGRESSES
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            progresses: expectedData
        });
    });

    it('should set totals when the action is SET_TOTALS', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            totals: chance.string()
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_TOTALS
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            totals: expectedData
        });
    });

    it('should set user email when the action is SET_EMAIL', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            user: {
                [chance.string()]: chance.string(),
                email: chance.string()
            }
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_EMAIL
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            user: {
                ...originalState.user,
                email: expectedData
            }
        });
    });

    it('should set user name when the action is SET_NAME', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            user: {
                [chance.string()]: chance.string(),
                name: chance.string()
            }
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_NAME
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            user: {
                ...originalState.user,
                name: expectedData
            }
        });
    });

    it('should set user loggedIn when the action is SET_LOGGED_IN', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            user: {
                [chance.string()]: chance.string(),
                loggedIn: chance.string()
            }
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_LOGGED_IN
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            user: {
                ...originalState.user,
                loggedIn: expectedData
            }
        });
    });

    it('should set user isAdmin when the action is SET_ADMIN', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            user: {
                [chance.string()]: chance.string(),
                isAdmin: chance.string()
            }
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_ADMIN
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            user: {
                ...originalState.user,
                isAdmin: expectedData
            }
        });
    });

    it('should set users when the action is SET_USERS', () => {
        const originalState = {
            [chance.string()]: chance.string(),
            users: chance.string()
        };

        const expectedData = chance.string();
        const action = {
            data: expectedData,
            type: SET_USERS
        };

        const actualState = reducer(originalState, action);

        expect(actualState).toEqual({
            ...originalState,
            users: expectedData
        });
    });
});
