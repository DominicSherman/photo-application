import {
    ADD_CAMERA_ROLL_ROW,
    SET_ADMIN,
    SET_EMAIL,
    SET_ENV, SET_FAILED_LOGIN,
    SET_IS_UPLOADING,
    SET_LOGGED_IN,
    SET_NAME,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PICTURES,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_USERS,
    SET_VIDEOS
} from '../constants/action-types';
import {PROD} from '../constants/variables';

const defaultState = {
    cameraRollRows: [],
    env: PROD,
    failedLogin: false,
    isUploading: false,
    numFinished: 0,
    numToUpload: 0,
    pictures: null,
    progresses: {},
    selectedImages: {},
    totals: {},
    user: {
        email: '',
        isAdmin: false,
        loggedIn: false,
        name: ''
    },
    users: null,
    videos: []
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

const setPictures = (state, pictures) => ({
    ...state,
    pictures
});

const setVideos = (state, videos) => ({
    ...state,
    videos
});

const setEnv = (state, env) => ({
    ...state,
    env
});

const setFailedLogin = (state, failedLogin) => ({
    ...state,
    failedLogin
});

const reducerMap = {
    [ADD_CAMERA_ROLL_ROW]: addCameraRollRow,
    [SET_ADMIN]: setAdmin,
    [SET_EMAIL]: setUserEmail,
    [SET_ENV]: setEnv,
    [SET_FAILED_LOGIN]: setFailedLogin,
    [SET_IS_UPLOADING]: setIsUploading,
    [SET_LOGGED_IN]: setUserLoggedIn,
    [SET_NAME]: setUserName,
    [SET_NUM_FINISHED]: setNumFinished,
    [SET_NUM_TO_UPLOAD]: setNumToUpload,
    [SET_PICTURES]: setPictures,
    [SET_PROGRESSES]: setProgresses,
    [SET_SELECTED_IMAGES]: setSelectedImages,
    [SET_TOTALS]: setTotals,
    [SET_USERS]: setUsers,
    [SET_VIDEOS]: setVideos
};

export default (state = defaultState, {type, data}) => {
    if (reducerMap[type]) {
        return reducerMap[type](state, data);
    }

    return state;
};
