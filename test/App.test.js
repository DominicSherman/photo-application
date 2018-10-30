import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';

import Home from '../src/screens/Home';
import UserModal from '../src/screens/UserModal';
import LoadingView from '../src/screens/LoadingView';
import ImageSelectModal from '../src/screens/ImageSelectModal';
import Login from '../src/screens/Login';
import {tryToLoadCredentials} from '../src/services/async-storage-service';
import {initializeFirebase} from '../src/services/firebase-service';
import App from '../src/App';

const chance = new Chance();

jest.mock('../src/services/firebase-service');
jest.mock('react-native-fetch-blob', () => ({
    DocumentDir: () => ({})
}));
jest.mock('../src/services/async-storage-service');

describe('App', () => {
    let expectedProps,
        renderedComponent,
        renderedInstance;

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<App {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setCameraRollRows: jest.fn(),
                setUsers: jest.fn()
            },
            cameraRollRows: chance.n(chance.string, chance.d6() + 1),
            imageModalVisible: false,
            isUploading: false,
            selectedImages: chance.n(chance.string, chance.d6() + 1),
            shouldAuthenticate: true,
            user: {
                loggedIn: true
            },
            userModalVisible: false,
            users: chance.n(chance.string, chance.d6() + 1)
        };

        renderComponent();
    });

    describe('componentWillMount', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            renderedInstance.componentWillMount();
        });

        it('should try to the load credentials from asyncStorage', () => {
            expect(tryToLoadCredentials).toHaveBeenCalledTimes(1);
            expect(tryToLoadCredentials).toHaveBeenCalledWith(expectedProps.actions);
        });

        it('should initializeFirebase', () => {
            expect(initializeFirebase).toHaveBeenCalledTimes(1);
        });

        it('should set the users', () => {
            expect(expectedProps.actions.setUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('componentDidMount', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            renderedInstance.componentDidMount();
        });
    });

    it('should render the LoadingView when it is uploading', () => {
        expectedProps.isUploading = true;

        renderComponent();

        expect(renderedComponent.type).toBe(LoadingView);
        expect(renderedComponent.props).toEqual(expectedProps);
    });

    it('should render the LoadingView when it shouldAuthenticate and the user is not logged in and there no users', () => {
        expectedProps.user.loggedIn = false;
        expectedProps.users = null;

        renderComponent();

        expect(renderedComponent.type).toBe(LoadingView);
        expect(renderedComponent.props).toEqual(expectedProps);
    });

    it('should render the UserModal when userModalVisible is true', () => {
        expectedProps.userModalVisible = true;

        renderComponent();

        expect(renderedComponent.type).toBe(UserModal);
        expect(renderedComponent.props.actions).toBe(expectedProps.actions);
        expect(renderedComponent.props.userModalVisible).toBe(expectedProps.userModalVisible);
        expect(renderedComponent.props.users).toBe(expectedProps.users);
    });

    it('should render the ImageSelectModal when imageModalVisible is true', () => {
        expectedProps.imageModalVisible = true;

        renderComponent();

        expect(renderedComponent.type).toBe(ImageSelectModal);
        expect(renderedComponent.props.actions).toBe(expectedProps.actions);
        expect(renderedComponent.props.cameraRollRows).toBe(expectedProps.cameraRollRows);
        expect(renderedComponent.props.imageModalVisible).toBe(expectedProps.imageModalVisible);
        expect(renderedComponent.props.selectedImages).toBe(expectedProps.selectedImages);
    });

    it('should render the Login when it shouldAuthenticate and the user is not logged in', () => {
        expectedProps.user.loggedIn = false;

        renderComponent();

        expect(renderedComponent.type).toBe(Login);
        expect(renderedComponent.props.actions).toBe(expectedProps.actions);
        expect(renderedComponent.props.user).toBe(expectedProps.user);
        expect(renderedComponent.props.users).toBe(expectedProps.users);
    });

    it('should render the Home component otherwise', () => {
        expect(renderedComponent.type).toBe(Home);
        expect(renderedComponent.props.actions).toBe(expectedProps.actions);
        expect(renderedComponent.props.selectedImages).toBe(expectedProps.selectedImages);
        expect(renderedComponent.props.user).toBe(expectedProps.user);
    });
});
