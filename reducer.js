import {ADD_CAMERA_ROLL_ROW, SET_MODAL_VISIBLE, UPLOAD_IMAGES} from './action-types';

const defaultState = {
    cameraRollRows: [],
    modalVisible: false,
    uploadedImages: []
};

const setModalVisible = (state, modalVisible) => ({
    ...state,
    modalVisible
});

const addCameraRollRow = (state, row) => ({
    ...state,
    cameraRollRows: [...state.cameraRollRows, row]
});

const setUploadedImages = (state, uploadedImages) => ({
    ...state,
    uploadedImages
});

const reducerMap = {
    [ADD_CAMERA_ROLL_ROW]: addCameraRollRow,
    [SET_MODAL_VISIBLE]: setModalVisible,
    [UPLOAD_IMAGES]: setUploadedImages
};

export default (state = defaultState, {type, data}) => {
    if (reducerMap[type]) {
        return reducerMap[type](state, data);
    }

    return state;
};