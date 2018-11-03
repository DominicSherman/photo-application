import {Navigation} from 'react-native-navigation/lib/dist/index';

import {GALLERY, HOME, IMAGE_MODAL, LOGIN, MORE, PHOTOS, USER_MODAL, WEDDING_INFORMATION} from '../constants/routes';
import {withRedux} from '../services/redux-factory';

import Home from './Home';
import Login from './Login';
import More from './More';
import UserModal from './UserModal';
import ImageSelectModal from './ImageSelectModal';
import Photos from './Photos';
import WeddingInformation from './WeddingInformation';
import GalleryModal from './GalleryModal';

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
    },
    {
        component: WeddingInformation,
        route: WEDDING_INFORMATION
    },
    {
        component: GalleryModal,
        route: GALLERY
    }
];

export const registerScreens = (store) => {
    screens.forEach((screen) => {
        Navigation.registerComponent(screen.route, () => withRedux(screen.component, store));
    });
};
