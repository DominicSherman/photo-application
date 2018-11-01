import {AppRegistry} from 'react-native';
import {Navigation} from 'react-native-navigation';

import ReduxProvider from './src/ReduxProvider';
import {black, darkFont, white} from './src/constants/style-variables';
import {getIcons, loadIcons} from './src/services/icons-factory';
import Home from './src/screens/Home';

const registerScreens = () => {
    Navigation.registerComponent('Home', () => require('./src/screens/Home').default);
    Navigation.registerComponent('Photos', () => require('./src/screens/ImageSelectModal').default);
};

registerScreens();

Navigation.events().registerAppLaunchedListener(async () => {
    await loadIcons();
    const icons = getIcons();

    await Navigation.setDefaultOptions({
        layout: {
            orientation: 'portrait'
        },
        topBar: {
            animate: false,
            backButton: {
                color: black,
                icon: icons.arrowBack,
                testID: 'backButton',
                title: '',
                visible: true
            },
            background: {
                color: white
            },
            buttonColor: black,
            drawBehind: true,
            title: {
                color: darkFont,
                text: 'Wedding Photos'
            },
            visible: true
        }
    });

    Navigation.setRoot({
        bottomTabs: {
            children: [
                {
                    stack: {
                        children: [
                            {
                                component: {
                                    name: Home
                                }
                            }
                        ],
                        options: {
                            bottomTab: {
                                icon: icons.home,
                                testID: 'navHome',
                                title: 'HOME'
                            },
                            sideMenu: {
                                enabled: false,
                                visible: false
                            }
                        }
                    }
                },
                {
                    stack: {
                        children: [
                            {
                                component: {
                                    name: Photos
                                }
                            }
                        ],
                        options: {
                            bottomTab: {
                                icon: icons.lists,
                                testID: 'navPhotos',
                                title: 'PHOTOS'
                            }
                        }
                    }
                }
            ],
            options: {
                bottomTabs: {
                    animate: false,
                    drawBehind: true,
                    selectedTabColor: black
                }
            }
        }
    });
});