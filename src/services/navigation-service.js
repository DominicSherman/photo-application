import {Navigation} from 'react-native-navigation';
import {getRoot} from './layout-factory';

export const showModal = (route) => {
    Navigation.showModal({
        stack: {
            children: [{
                component: {
                    name: route,
                    options: {
                        topBar: {
                            visible: false
                        }
                    }
                }
            }]
        }
    });
};

export const dismissModal = (componentId) => Navigation.dismissModal(componentId);

export const setRoot = (isLoggedIn) => Navigation.setRoot(getRoot(isLoggedIn));