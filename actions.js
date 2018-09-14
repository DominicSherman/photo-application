import {ADD_CAMERA_ROLL_ROW, SET_MODAL_VISIBLE, SET_SELECTED_IMAGES} from './action-types';
import {action} from './constants/action';
import {numPerRow} from './constants/variables';

export const setModalVisible = (isVisible) => (dispatch) =>
    dispatch(action(SET_MODAL_VISIBLE, isVisible));

export const setCameraRollRows = (r) => (dispatch) => {
    let row = [];
    for (let i = 0; i < r.edges.length; i++) {
        if (r.edges[i]) {
            if ((i + 1) % numPerRow === 0) {
                dispatch(action(ADD_CAMERA_ROLL_ROW, [...row, r.edges[i].node]));
                row = [];
            } else {
                row = [...row, r.edges[i].node];
            }
        }
    }

    dispatch(action(ADD_CAMERA_ROLL_ROW, row));
};

export const toggleSelected = (image) => (dispatch, getState) => {
    let imagesMap;
    const {selectedImages} = getState();
    const {image: {filename}} = image;

    if (selectedImages[`${filename}`]) {
        imagesMap = {
            ...selectedImages,
            [`${filename}`]: null
        };
    } else {
        imagesMap = {
            ...selectedImages,
            [`${filename}`]: image
        };
    }

    dispatch(action(SET_SELECTED_IMAGES, imagesMap));
};