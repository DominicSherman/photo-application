import {Navigation} from 'react-native-navigation';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';
import Chance from 'chance';

import reducer from '../src/reducers/reducer';
import {registerScreens} from '../src/screens';
import {initializeFirebase} from '../src/services/firebase-service';

jest.mock('redux');
jest.mock('redux-thunk');
jest.mock('react-native-navigation');
jest.mock('../src/screens');

const chance = new Chance();

describe('index', () => {
    let expectedStore,
        expectedThunk,
        registerAppSpy;

    beforeEach(() => {
        expectedThunk = chance.string();
        applyMiddleware.mockReturnValue(expectedThunk);

        expectedStore = chance.string();
        createStore.mockReturnValue(expectedStore);

        registerAppSpy = jest.fn();
        Navigation.events.mockReturnValue({
            registerAppLaunchedListener: registerAppSpy
        });

        require('../index');
    });

    it('should create the store', () => {
        expect(createStore).toHaveBeenCalledTimes(1);
        expect(createStore).toHaveBeenCalledWith(reducer, expectedThunk);
    });

    it('should apply the middleware', () => {
        expect(applyMiddleware).toHaveBeenCalledTimes(1);
        expect(applyMiddleware).toHaveBeenCalledWith(thunk);
    });

    it('should register the screens', () => {
        expect(registerScreens).toHaveBeenCalledTimes(1);
        expect(registerScreens).toHaveBeenCalledWith(expectedStore);
    });

    it('should call Navigation.events', () => {
        expect(Navigation.events).toHaveBeenCalledTimes(1);
    });

    describe('registerAppLaunchedListener', () => {
        beforeEach(async () => {
            const callback = Navigation.events.mock.calls[0][0];

            await callback();
        });

        it('should initialize firebase', () => {
            expect(initializeFirebase).toHaveBeenCalledTimes(1);
        });
    });
});
