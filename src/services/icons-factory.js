import * as Feather from 'react-native-vector-icons/Feather';
import * as EvilIcons from 'react-native-vector-icons/EvilIcons';

import {black, mediumGray} from '../constants/style-variables';

const sets = {
    EvilIcons,
    Feather
};

const sharedGetImageSource = (iconSet, ...args) => {
    const iconLibrary = sets[iconSet];

    return iconLibrary.getImageSource(...args);
};

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
