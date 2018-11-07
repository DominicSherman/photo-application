import {mediumGray} from '../constants/style-variables';

import {sharedGetImageSource} from './icon-loader';

let icons = {
    home: {},
    image: {},
    info: {},
    more: {}
};

export const loadIcons = async () => {
    const [
        home,
        more,
        info,
        image
    ] = await Promise.all([
        sharedGetImageSource('Feather', 'home', 25, mediumGray),
        sharedGetImageSource('Feather', 'more-horizontal', 25, mediumGray),
        sharedGetImageSource('Feather', 'info', 25, mediumGray),
        sharedGetImageSource('EvilIcons', 'image', 33, mediumGray)
    ]);

    icons = {
        home,
        image,
        info,
        more
    };
};

export const getIcons = () => icons;
