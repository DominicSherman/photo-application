import {
    ADD_CAMERA_ROLL_ROW,
    SET_ADMIN,
    SET_EMAIL,
    SET_IMAGE_MODAL_VISIBLE,
    SET_IS_UPLOADING,
    SET_LOGGED_IN,
    SET_NAME,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_USER_MODAL_VISIBLE,
    SET_USERS
} from './constants/action-types';
import {action} from './constants/action';
import {numPerRow} from './constants/variables';
import {getUsers} from './services/firebase-service';

export const setCameraRollRows = (r) => (dispatch) => {
    let row = [];

    for (let i = 0; i < r.edges.length; i++) {
        if ((i + 1) % numPerRow === 0) {
            dispatch(action(ADD_CAMERA_ROLL_ROW, [...row, r.edges[i].node]));
            row = [];
        } else {
            row = [...row, r.edges[i].node];
        }
    }

    dispatch(action(ADD_CAMERA_ROLL_ROW, row));
};

export const incrementFinished = () => (dispatch, getState) => {
    const {numFinished, numToUpload} = getState();

    dispatch(action(SET_NUM_FINISHED, numFinished + 1));

    if (numFinished + 1 === numToUpload) {
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
    let updatedSelectedImages = getState().selectedImages;

    row.forEach((item) => {
        const {image: {filename}} = item;

        if (isSelected) {
            updatedSelectedImages = {
                ...updatedSelectedImages,
                [`${filename}`]: item
            };
        } else {
            updatedSelectedImages = removeItem(updatedSelectedImages, filename);
        }
    });

    dispatch(action(SET_SELECTED_IMAGES, updatedSelectedImages));
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

export const toggleImageModal = () => (dispatch, getState) => {
    const {imageModalVisible} = getState();

    dispatch(action(SET_IMAGE_MODAL_VISIBLE, !imageModalVisible));
};

export const toggleUserModal = () => (dispatch, getState) => {
    const {userModalVisible} = getState();

    dispatch(action(SET_USER_MODAL_VISIBLE, !userModalVisible));
};

export const setUsers = () => async (dispatch) => {
    await getUsers().on('value',
        (snapshot) => {
            const userMap = snapshot.val();

            if (userMap) {
                const users = Object.keys(userMap).map((key) => ({
                    email: userMap[key].email,
                    isAdmin: userMap[key].isAdmin
                }));

                dispatch(action(SET_USERS, users));
            } else {
                dispatch(action(SET_USERS, []));
            }
        }
    );
};

export const setEmail = (email) => (dispatch) => dispatch(action(SET_EMAIL, email));

export const setName = (name) => (dispatch) => dispatch(action(SET_NAME, name));

export const setIsAdmin = (isAdmin) => (dispatch) => dispatch(action(SET_ADMIN, isAdmin));

export const setLoggedIn = (isLoggedIn) => (dispatch) => dispatch(action(SET_LOGGED_IN, isLoggedIn));
