import {ADD_CAMERA_ROLL_ROW, SET_MODAL_VISIBLE} from './action-types';
import {action} from './constants/action';
import {numPerRow} from './constants/variables';

export const setModalVisible = (isVisible) => (dispatch) =>
    dispatch(action(SET_MODAL_VISIBLE, isVisible));

export const makeRows = (r) => (dispatch) => {
    let row = [];
    for (let i = 0; i < r.edges.length; i++) {
        if (r.edges[i]) {
            if ((i + 1) % numPerRow === 0) {
                dispatch(action(ADD_CAMERA_ROLL_ROW, [...row, r.edges[i]]));
                row = [];
            } else {
                row = [...row, r.edges[i]];
            }
        }
    }

    dispatch(action(ADD_CAMERA_ROLL_ROW, row));
};