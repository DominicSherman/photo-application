import {
    ADD_CAMERA_ROLL_ROW, RESET_CAMERA_ROLL_ROWS,
    SET_IS_UPLOADING,
    SET_NUM_FINISHED,
    SET_NUM_TO_UPLOAD,
    SET_PICTURES,
    SET_PROGRESSES,
    SET_SELECTED_IMAGES,
    SET_TOTALS,
    SET_VIDEOS
} from '../constants/action-types';
import {action} from '../constants/action';
import {numPerRow} from '../constants/variables';
import {getMedia} from '../services/firebase-service';

export const setCameraRollRows = (r) => (dispatch, getState) => {
    let row = [];
    let currPhotosCount = 0;

    const {cameraRollRows} = getState();

    cameraRollRows.map((currRow) => {
        currRow.forEach(() => {
            currPhotosCount += 1;
        });
    });

    if (currPhotosCount !== r.edges.length) {
        dispatch(action(RESET_CAMERA_ROLL_ROWS));

        for (let i = 0; i < r.edges.length; i++) {
            if ((i + 1) % numPerRow === 0) {
                dispatch(action(ADD_CAMERA_ROLL_ROW, [...row, r.edges[i].node]));
                row = [];
            } else {
                row = [...row, r.edges[i].node];
            }
        }

        if (row.length) {
            dispatch(action(ADD_CAMERA_ROLL_ROW, row));
        }
    }
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
        const {image: {uri}} = item;

        if (isSelected) {
            updatedSelectedImages = {
                ...updatedSelectedImages,
                [`${uri}`]: item
            };
        } else {
            updatedSelectedImages = removeItem(updatedSelectedImages, uri);
        }
    });

    dispatch(action(SET_SELECTED_IMAGES, updatedSelectedImages));
};

export const toggleSelected = (item) => (dispatch, getState) => {
    const {selectedImages} = getState();
    const {image: {uri}} = item;

    if (!selectedImages[`${uri}`]) {
        dispatch(action(
            SET_SELECTED_IMAGES,
            {
                ...selectedImages,
                [`${uri}`]: item
            }
        ));
    } else {
        dispatch(action(SET_SELECTED_IMAGES, removeItem(selectedImages, uri)));
    }
};

export const setMedia = () => async (dispatch, getState) => {
    const {env, event} = getState();

    await getMedia(env, event.eventId).on('value', (snapshot) => {
        let all = [],
            photos = [],
            videos = [];

        const media = snapshot.val();

        if (media) {
            const sets = Object.keys(media).map((key) => {
                const sessionImages = media[key];

                return Object.keys(sessionImages).map((k) => sessionImages[k]);
            });

            sets.forEach((set) => set.forEach((item) => {
                all = [...all, item];
            }));

            all.forEach(({url, width, height, isVideo, name}) => {
                if (isVideo) {
                    videos = [
                        ...videos,
                        {
                            dimensions: {
                                height,
                                width
                            },
                            name,
                            source: {
                                uri: url
                            }
                        }
                    ];
                } else {
                    photos = [
                        ...photos,
                        {
                            dimensions: {
                                height,
                                width
                            },
                            name,
                            source: {
                                uri: url
                            }
                        }
                    ];
                }
            });

            dispatch(action(SET_PICTURES, photos.reverse()));
            dispatch(action(SET_VIDEOS, videos));
        } else {
            dispatch(action(SET_PICTURES, []));
            dispatch(action(SET_VIDEOS, []));
        }
    });
};
