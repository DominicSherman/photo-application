import * as Feather from 'react-native-vector-icons/Feather';
import * as EvilIcons from 'react-native-vector-icons/EvilIcons';

const sets = {
    EvilIcons,
    Feather
};

export const sharedGetImageSource = (iconSet, ...args) => {
    const iconLibrary = sets[iconSet];

    return iconLibrary.getImageSource(...args);
};
