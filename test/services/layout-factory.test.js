import Chance from 'chance';

import {getDefaultOptions, getRoot} from '../../src/services/layout-factory';
import {black, darkFont, green, white} from '../../src/constants/style-variables';
import {getIcons} from '../../src/services/icons-factory';
import {HOME, MORE, PHOTOS, SELECT_EVENT, WEDDING_INFORMATION} from '../../src/constants/routes';

jest.mock('../../src/services/icons-factory');

const chance = new Chance();

describe('layout-factory', () => {
    describe('getDefaultOptions', () => {
        it('should return the default options', () => {
            const expectedOptions = getDefaultOptions();

            expect(expectedOptions).toEqual({
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
        });
    });

    describe('getRoot', () => {
        let icons;

        beforeEach(() => {
            icons = {
                home: chance.string(),
                image: chance.string(),
                info: chance.string(),
                more: chance.string()
            };

            getIcons.mockReturnValue(icons);
        });

        it('should return the Dominic & Mary root layout when applicable', () => {
            const eventName = 'Dominic & Mary\'s Wedding';
            const expectedLayout = getRoot(true, eventName);

            expect(expectedLayout).toEqual({
                root: {
                    bottomTabs: {
                        children: [
                            {
                                stack: {
                                    children: [{
                                        component: {
                                            id: HOME,
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
                                            id: PHOTOS,
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
                                            id: WEDDING_INFORMATION,
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
                                            id: MORE,
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
                                animate: false,
                                drawBehind: true,
                                selectedTabColor: green
                            }
                        }
                    }
                }
            });
        });

        it('should return the main root layout when the user is loggedIn and the name is not Dominic & Mary', () => {
            const eventName = chance.string();
            const expectedLayout = getRoot(true, eventName);

            expect(expectedLayout).toEqual({
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
                                animate: false,
                                drawBehind: true,
                                selectedTabColor: green
                            }
                        }
                    }
                }
            });
        });

        it('should return the root layout when the user is not logged in', () => {
            const expectedLayout = getRoot(false);

            expect(expectedLayout).toEqual({
                root: {
                    stack: {
                        children: [{
                            component: {
                                name: SELECT_EVENT
                            }
                        }]
                    }
                }
            });
        });
    });
});
