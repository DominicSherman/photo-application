import {Navigation} from 'react-native-navigation';
import Chance from 'chance';

import {dismissModal, setRoot, showModal} from '../../src/services/navigation-service';
import {getRoot} from '../../src/services/layout-factory';

jest.mock('react-native-navigation');
jest.mock('../../src/services/layout-factory');

const chance = new Chance();

describe('navigation-service', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('showModal', () => {
        let route,
            options;

        beforeEach(() => {
            route = chance.string();
            options = {
                [chance.string()]: chance.string()
            };

            showModal(route, options);
        });

        it('should call showModal with the correct options', () => {
            expect(Navigation.showModal).toHaveBeenCalledTimes(1);
            expect(Navigation.showModal).toHaveBeenCalledWith({
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
        });
    });

    describe('dismissModal', () => {
        let componentId;

        beforeEach(() => {
            componentId = chance.natural();

            dismissModal(componentId);
        });

        it('should dismiss the modal', () => {
            expect(Navigation.dismissModal).toHaveBeenCalledTimes(1);
            expect(Navigation.dismissModal).toHaveBeenCalledWith(componentId);
        });
    });

    describe('setRoot', () => {
        let isLoggedIn,
            expectedOptions;

        beforeEach(() => {
            isLoggedIn = chance.bool();
            expectedOptions = chance.string();

            getRoot.mockReturnValue(expectedOptions);
            setRoot(isLoggedIn);
        });

        it('should get the root options for the layout-factory', () => {
            expect(getRoot).toHaveBeenCalledTimes(1);
            expect(getRoot).toHaveBeenCalledWith(isLoggedIn);
        });

        it('should set the root with the returned options', () => {
            expect(Navigation.setRoot).toHaveBeenCalledTimes(1);
            expect(Navigation.setRoot).toHaveBeenCalledWith(expectedOptions);
        });
    });
});
