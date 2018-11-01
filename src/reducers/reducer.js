import {
    ADD_CAMERA_ROLL_ROW,
    SET_ADMIN,
    SET_EMAIL,
    SET_IS_UPLOADING,
    SET_LOGGED_IN,
    SET_NAME,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_USERS
} from '../constants/action-types';

const defaultState = {
    cameraRollRows: [],
    isUploading: false,
    numFinished: 0,
    numToUpload: 0,
    progresses: {},
    selectedImages: {},
    totals: {},
    user: {
        email: '',
        isAdmin: false,
        loggedIn: false,
        name: ''
    },
    users: null
};

const addCameraRollRow = (state, row) => ({
    ...state,
    cameraRollRows: [...state.cameraRollRows, row]
});

const setSelectedImages = (state, selectedImages) => ({
    ...state,
    selectedImages
});

const setNumToUpload = (state, numToUpload) => ({
    ...state,
    numToUpload
});

const setNumFinished = (state, numFinished) => ({
    ...state,
    numFinished
});

const setIsUploading = (state, isUploading) => ({
    ...state,
    isUploading
});

const setProgresses = (state, progresses) => ({
    ...state,
    progresses
});

const setTotals = (state, totals) => ({
    ...state,
    totals
});

const setUserEmail = (state, email) => ({
    ...state,
    user: {
        ...state.user,
        email
    }
});

const setUserName = (state, name) => ({
    ...state,
    user: {
        ...state.user,
        name
    }
});

const setUserLoggedIn = (state, loggedIn) => ({
    ...state,
    user: {
        ...state.user,
        loggedIn
    }
});

const setAdmin = (state, isAdmin) => ({
    ...state,
    user: {
        ...state.user,
        isAdmin
    }
});

const setUsers = (state, users) => ({
    ...state,
    users
});

const reducerMap = {
    [ADD_CAMERA_ROLL_ROW]: addCameraRollRow,
    [SET_ADMIN]: setAdmin,
    [SET_EMAIL]: setUserEmail,
    [SET_IS_UPLOADING]: setIsUploading,
    [SET_LOGGED_IN]: setUserLoggedIn,
    [SET_NAME]: setUserName,
    [SET_NUM_FINISHED]: setNumFinished,
    [SET_NUM_TO_UPLOAD]: setNumToUpload,
    [SET_PROGRESSES]: setProgresses,
    [SET_SELECTED_IMAGES]: setSelectedImages,
    [SET_TOTALS]: setTotals,
    [SET_USERS]: setUsers
};

export default (state = defaultState, {type, data}) => {
    if (reducerMap[type]) {
        return reducerMap[type](state, data);
    }

    return state;
};