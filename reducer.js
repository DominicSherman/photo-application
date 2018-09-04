import {SET_MODAL_VISIBLE} from './action-types';

const defaultState = {
    cameraRollRows: [],
    modalVisible: false,
    selectedImages: []
};

const setModalVisible = (state, modalVisible) => ({
    ...state,
        modalVisible
});

const reducerMap = {
    [SET_MODAL_VISIBLE]: setModalVisible
};

export default (state = defaultState, {type, data}) => {
    if (reducerMap[type]) {
        return reducerMap[type](state, data);
    }

    return state;
};