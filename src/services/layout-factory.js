import {black, darkFont, white} from '../constants/style-variables';
import {HOME, LOGIN, MORE} from '../constants/routes';

import {getIcons} from './icons-factory';

export const getDefaultOptions = () => {
    const icons = getIcons();

    return {
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
            drawBehind: false,
            title: {
                color: darkFont,
                text: 'Wedding Photos'
            },
            visible: true
        }
    };
};

export const getRoot = (isLoggedIn) => {
    const icons = getIcons();

    return (
        isLoggedIn ?
            {
                root: {
                    bottomTabs: {
                        children: [{
                            stack: {
                                children: [{
                                    component: {
                                        name: HOME
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
                                        name: MORE
                                    }
                                }],
                                options: {
                                    bottomTab: {
                                        icon: icons.more,
                                        title: 'More'
                                    }
                                }
                            }
                        }]
                    }
                }
            }
            :
            {
                root: {
                    component: {
                        name: LOGIN
                    }
                }
            }
    );
};
