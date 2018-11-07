import {Dimensions} from 'react-native';

export const numPictures = 300;
export const numPerRow = 3;
export const imageSize = (Dimensions.get('window').width - 20) / numPerRow;
export const thumbnailImageSize = Dimensions.get('window').width / 4;

export const HRLinkAndroid = 'http://maps.google.com/maps?daddr=45.533226,-122.662230';
export const HRLinkApple = 'http://maps.apple.com/maps?daddr=45.533226,-122.662230';
export const McMenaminLinkAndroid = 'http://maps.google.com/maps?daddr=45.549305, -122.900486';
export const McMenaminLinkApple = 'http://maps.apple.com/maps?daddr=45.549305, -122.900486';
