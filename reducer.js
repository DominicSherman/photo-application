import {ADD_CAMERA_ROLL_ROW, SET_MODAL_VISIBLE} from './action-types';

const defaultState = {
    cameraRollRows: [],
    modalVisible: false,
    selectedImages: []
};

const setModalVisible = (state, modalVisible) => ({
    ...state,
    modalVisible
});

const addCameraRollRow = (state, row) => ({
    ...state,
    cameraRollRows: [...state.cameraRollRows, row]
});

const reducerMap = {
    [ADD_CAMERA_ROLL_ROW]: addCameraRollRow,
    [SET_MODAL_VISIBLE]: setModalVisible
};

export default (state = defaultState, {type, data}) => {
    if (reducerMap[type]) {
        return reducerMap[type](state, data);
    }

    return state;
};