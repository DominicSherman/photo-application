import {black, darkFont, green, white} from '../constants/style-variables';
import {HOME, MORE, PHOTOS, SELECT_EVENT, WEDDING_INFORMATION} from '../constants/routes';

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
            color: darkFont
        },
        visible: true
    }
});

const loggedOutRoot = {
    root: {
        stack: {
            children: [{
                component: {
                    name: SELECT_EVENT
                }
            }]
        }
    }
};

const getMainRoot = (icons, eventName) => ({
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
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
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
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
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
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
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

const getDominicAndMaryRoot = (icons, eventName) => ({
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
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
                            }
                        }
                    }
                },
                {
                    stack: {
                        children: [{
                            component: {
                                name: PHOTOS
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: icons.image,
                                title: 'Photos'
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
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
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
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
                            },
                            topBar: {
                                title: {
                                    text: eventName
                                }
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
                },
            }
        }
    }
});

export const getRoot = (isLoggedIn, eventName) => {
    const icons = getIcons();

    if (!isLoggedIn) {
        return loggedOutRoot;
    }

    if (eventName === 'Dominic & Mary') {
        return getDominicAndMaryRoot(icons, eventName);
    }

    return getMainRoot(icons, eventName);
};
