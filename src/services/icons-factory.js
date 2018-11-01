import * as FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Feather from 'react-native-vector-icons/Feather';
import * as SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {black, mediumGray} from '../constants/style-variables';

const sets = {
    Feather,
    FontAwesome,
    MaterialCommunityIcons,
    MaterialIcons,
    SimpleLineIcons
};

const sharedGetImageSource = (iconSet, ...args) => {
    const iconLibrary = sets[iconSet];

    return iconLibrary.getImageSource(...args);
};

const defaultIcon = require('../../assets/featured.png');

let icons = {
    arrowBack: defaultIcon,
    cart: defaultIcon,
    close: defaultIcon,
    deals: defaultIcon,
    fuelSaver: defaultIcon,
    home: defaultIcon,
    menu: defaultIcon,
    more: defaultIcon,
    orders: defaultIcon,
    recipes: defaultIcon,
    search: defaultIcon
};

export const loadIcons = async () => {
    const [
        menu,
        arrowBack,
        home,
        search,
        orders,
        deals,
        fuelSaver,
        cart,
        more,
        close,
        lists,
        myAccount,
        recipes
    ] = await Promise.all([
        sharedGetImageSource('Feather', 'menu', 30, black),
        sharedGetImageSource('Feather', 'arrow-left', 30, black),
        sharedGetImageSource('Feather', 'home', 25, mediumGray),
        sharedGetImageSource('Feather', 'search', 25, mediumGray),
        sharedGetImageSource('Feather', 'package', 25, mediumGray),
        sharedGetImageSource('Feather', 'tag', 25, mediumGray),
        sharedGetImageSource('Feather', 'dollar-sign', 25, mediumGray),
        sharedGetImageSource('Feather', 'shopping-cart', 25, mediumGray),
        sharedGetImageSource('Feather', 'more-horizontal', 25, mediumGray),
        sharedGetImageSource('Feather', 'x', 25, mediumGray),
        sharedGetImageSource('Feather', 'list', 25, mediumGray),
        sharedGetImageSource('Feather', 'settings', 25, mediumGray),
        sharedGetImageSource('SimpleLineIcons', 'fire', 25, mediumGray)
    ]);

    icons = {
        arrowBack,
        cart,
        close,
        deals,
        fuelSaver,
        home,
        lists,
        menu,
        more,
        myAccount,
        orders,
        recipes,
        search
    };
};

export const getIcons = () => icons;
