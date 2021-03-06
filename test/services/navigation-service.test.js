import {Navigation} from 'react-native-navigation';
import Chance from 'chance';

import {dismissModal, goToRoute, setRoot, showModal} from '../../src/services/navigation-service';
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
            expectedOptions,
            isAdmin;

        beforeEach(() => {
            isLoggedIn = chance.bool();
            isAdmin = chance.bool();
            expectedOptions = chance.string();

            getRoot.mockReturnValue(expectedOptions);
            setRoot(isLoggedIn, isAdmin);
        });

        it('should get the root options for the layout-factory', () => {
            expect(getRoot).toHaveBeenCalledTimes(1);
            expect(getRoot).toHaveBeenCalledWith(isLoggedIn, isAdmin);
        });

        it('should set the root with the returned options', () => {
            expect(Navigation.setRoot).toHaveBeenCalledTimes(1);
            expect(Navigation.setRoot).toHaveBeenCalledWith(expectedOptions);
        });
    });

    describe('goToRoute', () => {
        let expectedRoute,
            expectedComponentId;

        beforeEach(() => {
            expectedRoute = chance.string();
            expectedComponentId = chance.string();

            goToRoute(expectedRoute, expectedComponentId);
        });

        it('should push the route onto the stack', () => {
            expect(Navigation.push).toHaveBeenCalledTimes(1);
            expect(Navigation.push).toHaveBeenCalledWith(expectedComponentId, {
                component: {
                    name: expectedRoute
                }
            });
        });
    });
});
