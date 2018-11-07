import {Linking, Platform} from 'react-native';

import {HRLinkAndroid, HRLinkApple, McMenaminLinkAndroid, McMenaminLinkApple} from '../constants/variables';

export const calculateDaysLeft = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const weddingDay = new Date('2019-05-28T14:00:00-07:00').getTime();
    const now = Date.now();

    return Math.floor(Math.abs((weddingDay - now) / oneDay));
};

export const clean = (string) => string.replace(/[^a-zA-Z0-9]/g, '');

export const getCurrentTime = () => {
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();
    const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds();

    return `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()} ${today.getHours()}:${minutes}:${seconds}`;
};

export const getTimeForDisplay = (duration) => {
    const min = Math.floor(duration / 60);
    const sec = duration % 60 < 10 ? `0${(duration % 60)}` : duration % 60;

    return `${min}:${sec}`;
};

export const openHRLink = () => Platform.select({
    android: () => Linking.openURL(HRLinkAndroid),
    ios: () => Linking.openURL(HRLinkApple)
});

export const openMcMenaminLink = () => Platform.select({
    android: () => Linking.openURL(McMenaminLinkAndroid),
    ios: () => Linking.openURL(McMenaminLinkApple)
});
