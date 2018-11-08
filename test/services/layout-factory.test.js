import Chance from 'chance';

import {getDefaultOptions, getRoot} from '../../src/services/layout-factory';
import {black, darkFont, green, white} from '../../src/constants/style-variables';
import {getIcons} from '../../src/services/icons-factory';
import {HOME, LOGIN, MORE, PHOTOS, WEDDING_INFORMATION} from '../../src/constants/routes';

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
                        color: darkFont,
                        text: 'D&M Photos'
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

        it('should return the root layout when the user is loggedIn', () => {
            const expectedLayout = getRoot(true);

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
        });

        it('should return the root layout when the user is not logged in', () => {
            const expectedLayout = getRoot(false);

            expect(expectedLayout).toEqual({
                root: {
                    component: {
                        name: LOGIN
                    }
                }
            });
        });
    });
});
