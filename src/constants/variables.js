import {Dimensions} from 'react-native';

export const numPictures = 300;
export const numPerRow = 3;
export const imageSize = (Dimensions.get('window').width - 20) / numPerRow;
export const thumbnailImageSize = Dimensions.get('window').width / 4;
