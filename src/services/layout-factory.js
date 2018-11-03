import {black, darkFont, green, white} from '../constants/style-variables';
import {HOME, LOGIN, MORE, PHOTOS, WEDDING_INFORMATION} from '../constants/routes';

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
                text: '🎉 Dominic & Mary 🎉'
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
                        children: [
                            {
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
                                            name: PHOTOS
                                        }
                                    }],
                                    options: {
                                        bottomTab: {
                                            icon: icons.image,
                                            title: 'Photos'
                                        }
                                    }
                                }
                            },
                            {
                                stack: {
                                    children: [{
                                        component: {
                                            name: WEDDING_INFORMATION
                                        }
                                    }],
                                    options: {
                                        bottomTab: {
                                            icon: icons.info,
                                            title: 'Information'
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
                            }
                        ],
                        options: {
                            bottomTabs: {
                                animate: true,
                                drawBehind: true,
                                selectedTabColor: green
                            }
                        }
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
