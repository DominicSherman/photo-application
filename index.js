import {Navigation} from 'react-native-navigation';

import {black, darkFont, white} from './src/constants/style-variables';
import {getIcons, loadIcons} from './src/services/icons-factory';
import Home from './src/screens/Home';
import ReduxProvider from './src/ReduxProvider';
import ImageSelectModalContainer from './src/screens/ImageSelectModalContainer';
import {withProvider} from './src/services/redux-factory';

const registerScreens = () => {
    Navigation.registerComponent('photoapplication.Home', () => ReduxProvider);
    Navigation.registerComponent('photoapplication.Photos', () => withProvider(ImageSelectModalContainer));
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
        root: {
            bottomTabs: {
                children: [{
                    stack: {
                        children: [{
                            component: {
                                name: 'photoapplication.Home'
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: icons.home,
                                title: 'Home'
                            }
                        }
                    }
                },
                {
                    stack: {
                        children: [{
                            component: {
                                name: 'photoapplication.Photos'
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: icons.more,
                                title: 'Photos'
                            }
                        }
                    }
                }]
            }
        }
    });
});
