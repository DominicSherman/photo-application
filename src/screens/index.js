import {Navigation} from 'react-native-navigation/lib/dist/index';

import {HOME, IMAGE_MODAL, LOGIN, MORE, PHOTOS, USER_MODAL} from '../constants/routes';
import {withRedux} from '../services/redux-factory';

import Home from './Home';
import Login from './Login';
import More from './More';
import UserModal from './UserModal';
import ImageSelectModal from './ImageSelectModal';
import Photos from './Photos';

const screens = [
    {
        component: Home,
        route: HOME
    },
    {
        component: Login,
        route: LOGIN
    },
    {
        component: More,
        route: MORE
    },
    {
        component: UserModal,
        route: USER_MODAL
    },
    {
        component: ImageSelectModal,
        route: IMAGE_MODAL
    },
    {
        component: Photos,
        route: PHOTOS
    }
];

export const registerScreens = (store) => {
    screens.forEach((screen) => {
        Navigation.registerComponent(screen.route, () => withRedux(screen.component, store));
    });
};
