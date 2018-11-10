import {StyleSheet} from 'react-native';

import {darkFont, hyveeRed, lightFont, white} from './style-variables';

export const darkFontStyles = StyleSheet.create({
    light: {
        color: darkFont,
        fontSize: 20,
        fontWeight: '200'
    },
    medium: {
        color: darkFont,
        fontSize: 20,
        fontWeight: '600'
    },
    regular: {
        color: darkFont,
        fontSize: 20,
        fontWeight: '400'
    }
});

export const lightFontStyles = StyleSheet.create({
    light: {
        color: lightFont,
        fontSize: 20,
        fontWeight: '200'
    },
    medium: {
        color: lightFont,
        fontSize: 20,
        fontWeight: '600'
    },
    regular: {
        color: lightFont,
        fontSize: 20,
        fontWeight: '400'
    }
});

export const whiteFontStyles = StyleSheet.create({
    light: {
        color: white,
        fontSize: 20,
        fontWeight: '200'
    },
    medium: {
        color: white,
        fontSize: 20,
        fontWeight: '600'
    },
    regular: {
        color: white,
        fontSize: 20,
        fontWeight: '400'
    }
});

export const redFontStyles = StyleSheet.create({
    light: {
        color: hyveeRed,
        fontSize: 20,
        fontWeight: '200'
    },
    medium: {
        color: hyveeRed,
        fontSize: 20,
        fontWeight: '600'
    },
    regular: {
        color: hyveeRed,
        fontSize: 20,
        fontWeight: '400'
    }
});
