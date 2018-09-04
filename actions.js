import {SET_MODAL_VISIBLE} from './action-types';
import {action} from './constants/action';

export const setModalVisible = (isVisible) => (dispatch) =>
    dispatch(action(SET_MODAL_VISIBLE, isVisible));