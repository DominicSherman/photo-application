import {ADD_CAMERA_ROLL_ROW} from './action-types';
import {action} from './action';
import {numPerRow} from './variables';

export const getCameraRollRows = (r) => (dispatch) => {
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

export const getCurrentTime = () => {
    const today = new Date();
    return `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}@${today.getHours()}:${today.getMinutes()}`;
};