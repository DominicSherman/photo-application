import {black, darkFont, green, white} from '../constants/style-variables';
import {HOME, LOGIN, MORE, PHOTOS, WEDDING_INFORMATION} from '../constants/routes';

import {getIcons} from './icons-factory';

export const getDefaultOptions = () => ({
    layout: {
        orientation: 'portrait'
    },
    topBar: {
        animate: false,
        background: {
            color: white
        },
        buttonColor: black,
        drawBehind: false,
        title: {
            color: darkFont,
            text: 'D&M Photos'
        },
        visible: true
    }
});

const loggedOutRoot = {
    root: {
        component: {
            name: LOGIN
        }
    }
};

const getMainRoot = (icons) => ({
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
                    drawBehind: false,
                    selectedTabColor: green
                }
            }
        }
    }
});

const getAdminRoot = (icons) => ({
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
                    drawBehind: false,
                    selectedTabColor: green
                }
            }
        }
    }
});

export const getRoot = (isLoggedIn, isAdmin) => {
    const icons = getIcons();

    if (!isLoggedIn) {
        return loggedOutRoot;
    }

    if (isAdmin) {
        return getAdminRoot(icons);
    }

    return getMainRoot(icons);
};
