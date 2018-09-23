import {
    ADD_CAMERA_ROLL_ROW,
    SET_EMAIL,
    SET_IS_UPLOADING,
    SET_LOGGED_IN,
    SET_MODAL_VISIBLE,
    SET_NAME,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_USERS
} from './constants/action-types';
import {action} from './constants/action';
import {numPerRow} from './constants/variables';

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

export const incrementFinished = () => (dispatch, getState) => {
    const {numFinished, numToUpload} = getState();

    dispatch(action(SET_NUM_FINISHED, numFinished+1));

    if (numFinished+1 === numToUpload) {
        dispatch(action(SET_IS_UPLOADING, false));
        dispatch(action(SET_NUM_TO_UPLOAD, 0));
        dispatch(action(SET_NUM_FINISHED, 0));
        dispatch(action(SET_PROGRESSES, {}));
        dispatch(action(SET_TOTALS, {}));
    }
};

export const setProgress = (index, bytesTransferred) => (dispatch, getState) => {
    const {progresses} = getState();

    dispatch(action(SET_PROGRESSES, {
        ...progresses,
        [index]: bytesTransferred
    }));
};

export const setTotal = (index, total) => (dispatch, getState) => {
    const {totals} = getState();

    dispatch(action(SET_TOTALS, {
        ...totals,
        [index]: total
    }));
};

export const setUploading = (numToUpload) => (dispatch) => {
    dispatch(action(SET_NUM_TO_UPLOAD, numToUpload));
    dispatch(action(SET_IS_UPLOADING, true));
};

export const setSelectedImages = (newSelected) => (dispatch) => dispatch(action(SET_SELECTED_IMAGES, newSelected));

const removeItem = (obj, item) =>
    Object.keys(obj)
        .filter((key) => key !== item)
        .reduce((newObject, key) => ({
            ...newObject,
            [key]: obj[key]
        }), {});

export const setSelectedRow = (row, isSelected) => (dispatch, getState) => {
    let {selectedImages} = getState();
    let selectedRow = {};

    row.forEach((item) => {
        const {image: {filename}} = item;
        if (isSelected) {
            selectedRow = {
                ...selectedRow,
                [`${item.image.filename}`]: item
            };

            dispatch(action(
                SET_SELECTED_IMAGES,
                {
                    ...selectedImages,
                    ...selectedRow
                }
            ));
        } else {
            selectedImages = removeItem(selectedImages, filename);

            dispatch(action(SET_SELECTED_IMAGES, selectedImages));
        }
    });
};

export const toggleSelected = (item) => (dispatch, getState) => {
    const {selectedImages} = getState();
    const {image: {filename}} = item;

    if (!selectedImages[`${filename}`]) {
        dispatch(action(
            SET_SELECTED_IMAGES,
            {
                ...selectedImages,
                [`${filename}`]: item
            }
        ));
    } else {
        dispatch(action(SET_SELECTED_IMAGES, removeItem(selectedImages, filename)));
    }
};

export const toggleModal = () => (dispatch, getState) => {
    const {modalVisible} = getState();
    dispatch(action(SET_MODAL_VISIBLE, !modalVisible));
};

export const setEmail = (email) => (dispatch) => dispatch(action(SET_EMAIL, email));

export const setName = (name) => (dispatch) => dispatch(action(SET_NAME, name));

export const setUsers = (users) => (dispatch) => dispatch(action(SET_USERS, users));

export const login = () => async (dispatch, getState) => {
    const {user: {email}, users} = getState();

    if (users.includes(email.toLowerCase())) {
        dispatch(action(SET_LOGGED_IN, true));
    } else {
        console.log('INVALID EMAIL');
    }
};
