import Chance from 'chance';

import reducer from '../src/reducers/reducer';

jest.mock('redux', () => ({
    applyMiddleware: jest.fn(),
    createStore: jest.fn()
}));
jest.mock('../src/screens', () => ({registerScreens: jest.fn()}));
jest.mock('../src/services/async-storage-service', () => ({tryToLoadCredentials: jest.fn()}));
jest.mock('../src/services/icons-factory', () => ({loadIcons: jest.fn()}));
jest.mock('../src/services/layout-factory', () => ({
    getDefaultOptions: jest.fn(),
    getRoot: jest.fn()
}));
jest.mock('../src/services/firebase-service');
jest.mock('../src/action-creators/index', () => ({setEvents: jest.fn()}));

const chance = new Chance();

describe('index', () => {
    let Navigation,
        createStore,
        applyMiddleware,
        registerScreens,
        tryToLoadCredentials,
        initializeFirebase,
        setUsers,
        loadIcons,
        getDefaultOptions,
        getRoot,
        thunkSpy,
        expectedStore,
        expectedThunk,
        expectedCreds,
        expectedIsAdmin,
        expectedDefaultOptions,
        expectedRoot,
        registerAppSpy;

    beforeEach(() => {
        Navigation = require('react-native-navigation').Navigation;
        createStore = require('redux').createStore;
        applyMiddleware = require('redux').applyMiddleware;
        registerScreens = require('../src/screens').registerScreens;
        tryToLoadCredentials = require('../src/services/async-storage-service').tryToLoadCredentials;
        initializeFirebase = require('../src/services/firebase-service').initializeFirebase;
        setUsers = require('../src/action-creators/index').setUsers;
        loadIcons = require('../src/services/icons-factory').loadIcons;
        thunkSpy = jest.fn();
        setUsers.mockReturnValue(thunkSpy);
        expectedDefaultOptions = chance.string();
        getDefaultOptions = require('../src/services/layout-factory').getDefaultOptions;
        getDefaultOptions.mockReturnValue(expectedDefaultOptions);
        expectedRoot = chance.string();
        getRoot = require('../src/services/layout-factory').getRoot;
        getRoot.mockReturnValue(expectedRoot);

        registerAppSpy = jest.fn();
        Navigation.events = jest.fn().mockReturnValue({
            registerAppLaunchedListener: registerAppSpy
        });
        Navigation.setDefaultOptions = jest.fn();
        Navigation.setRoot = jest.fn();

        expectedStore = chance.string();
        createStore.mockReturnValue(expectedStore);

        expectedThunk = chance.string();
        applyMiddleware.mockReturnValue(expectedThunk);

        expectedCreds = chance.bool();
        expectedIsAdmin = chance.bool();
        tryToLoadCredentials.mockReturnValue(Promise.resolve([expectedCreds, expectedIsAdmin]));

        require('../index');
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should create the store', () => {
        expect(createStore).toHaveBeenCalledTimes(1);
        expect(createStore).toHaveBeenCalledWith(reducer, expectedThunk);
    });

    it('should apply the middleware', () => {
        expect(applyMiddleware).toHaveBeenCalledTimes(1);
    });

    it('should register the screens', () => {
        expect(registerScreens).toHaveBeenCalledTimes(1);
        expect(registerScreens).toHaveBeenCalledWith(expectedStore);
    });

    const triggerAppLaunchedListener = () => {
        const [listener] = registerAppSpy.mock.calls[0];

        return listener();
    };

    describe('registerAppLaunchedListener', () => {
        it('should register a listener for app launch', () => {
            expect(registerAppSpy).toHaveBeenCalledTimes(1);
        });

        it('should initialize firebase', async () => {
            await triggerAppLaunchedListener();

            expect(initializeFirebase).toHaveBeenCalledTimes(1);
        });

        it('should set the users', async () => {
            await triggerAppLaunchedListener();

            expect(thunkSpy).toHaveBeenCalledTimes(1);
        });

        it('should try to load credentials', async () => {
            await triggerAppLaunchedListener();

            expect(tryToLoadCredentials).toHaveBeenCalledTimes(1);
            expect(tryToLoadCredentials).toHaveBeenCalledWith(expectedStore);
        });

        it('should load the icons', async () => {
            await triggerAppLaunchedListener();

            expect(loadIcons).toHaveBeenCalledTimes(1);
        });

        it('should set the default options for Navigation', async () => {
            await triggerAppLaunchedListener();

            expect(getDefaultOptions).toHaveBeenCalledTimes(1);
            expect(Navigation.setDefaultOptions).toHaveBeenCalledTimes(1);
            expect(Navigation.setDefaultOptions).toHaveBeenCalledWith(expectedDefaultOptions);
        });

        it('should set the root for Navigation', async () => {
            await triggerAppLaunchedListener();

            expect(getRoot).toHaveBeenCalledTimes(1);
            expect(getRoot).toHaveBeenCalledWith(expectedCreds, expectedIsAdmin);
            expect(Navigation.setRoot).toHaveBeenCalledTimes(1);
            expect(Navigation.setRoot).toHaveBeenCalledWith(expectedRoot);
        });
    });
});
