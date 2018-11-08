import {Navigation} from 'react-native-navigation';

import {getRoot} from './layout-factory';

export const showModal = (route, options) => {
    Navigation.showModal({
        stack: {
            children: [{
                component: {
                    name: route,
                    options: {
                        topBar: {
                            drawBehind: true,
                            visible: false
                        }
                    },
                    ...options
                }
            }]
        }
    });
};

export const dismissModal = (componentId) => Navigation.dismissModal(componentId);

export const setRoot = (isLoggedIn, isAdmin) => Navigation.setRoot(getRoot(isLoggedIn, isAdmin));
