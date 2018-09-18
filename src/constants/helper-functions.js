import {numPerRow} from './variables';

export const getCameraRollRows = (r) => {
    let rows = [];
    let row = [];
    for (let i = 0; i < r.edges.length; i++) {
        if (r.edges[i]) {
            if ((i + 1) % numPerRow === 0) {
                rows = [...rows, [...row, r.edges[i].node]];
                row = [];
            } else {
                row = [...row, r.edges[i].node];
            }
        }
    }

    return [...rows, row];
};

export const getCurrentTime = () => {
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();
    const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds();

    return `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()} ${today.getHours()}:${minutes}:${seconds}`;
};

export const getTimeForDisplay = (duration) => {
    const min = Math.floor(duration / 60);
    const sec = (duration % 60) < 10 ? `0${(duration % 60)}` : (duration % 60);

    return `${min}:${sec}`;
};