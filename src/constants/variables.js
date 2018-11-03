import {Dimensions} from 'react-native';

export const numPictures = 300;
export const numPerRow = 3;
export const imageSize = (Dimensions.get('window').width - 20) / numPerRow;
export const thumbnailImageSize = Dimensions.get('window').width / 4;

export const HRLink = 'https://www.google.com/maps/dir/?api=1&destination=Holy+Rosary+Catholic+Church&destination_place_id=ChIJK8x-N02nlVQRx-XK1Qu85Cg';
