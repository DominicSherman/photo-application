import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Feather from 'react-native-vector-icons/Feather';

import Home from '../../src/screens/Home';
import Button from '../../src/components/Button';
import SelectedPreview from '../../src/components/SelectedPreview';
import UploadButton from '../../src/components/UploadButton';
import {logout} from '../../src/services/helper-functions';
import {green} from '../../src/constants/style-variables';

jest.mock('../../src/services/helper-functions');

const chance = new Chance();

describe('Home', () => {
    let expectedProps,

        renderedComponent,

        renderedScrollView,

        renderedUserWrapper,
        renderedAdminButtonWrapper,
        renderedSelectButton,
        renderedUploadButton,
        renderedSelectedPreview,
        renderedLogoutButton,

        renderedUserText,

        renderedPreview;

    const cacheChildren = () => {
        renderedScrollView = renderedComponent.props.children;

        [
            renderedUserWrapper,
            renderedAdminButtonWrapper,
            renderedSelectButton,
            renderedUploadButton,
            renderedSelectedPreview,
            renderedLogoutButton
        ] = renderedScrollView.props.children;

        renderedUserText = renderedUserWrapper.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<Home {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                toggleUserModal: jest.fn()
            },
            selectedImages: chance.string(),
            user: {
                email: chance.string(),
                isAdmin: true,
                name: chance.string()
            }
        };

        renderComponent();
    });

    it('should render a root SafeAreaView', () => {
        expect(renderedComponent.type).toBe(SafeAreaView);
    });

    it('should render a ScrollView', () => {
        expect(renderedScrollView.type).toBe(ScrollView);
    });

    it('should render a wrapper for the user information', () => {
        expect(renderedUserWrapper.type).toBe(View);
    });

    it('should render the user text if they have a name', () => {
        expect(renderedUserText.type).toBe(Text);
        expect(renderedUserText.props.children).toBe(`${expectedProps.user.name} - ${expectedProps.user.email}`);
    });

    it('should render the user text if they do not have a name', () => {
        expectedProps.user.name = '';

        renderComponent();

        expect(renderedUserText.type).toBe(Text);
        expect(renderedUserText.props.children).toBe(`${expectedProps.user.email}`);
    });

    it('should render the Admin button if the user is an admin', () => {
        expect(renderedAdminButtonWrapper.type).toBe(View);

        const renderedTouchable = renderedAdminButtonWrapper.props.children;
        const renderedIcon = renderedTouchable.props.children;

        expect(renderedTouchable.type).toBe(Touchable);
        expect(renderedTouchable.props.onPress).toBe(expectedProps.actions.toggleUserModal);
        expect(renderedIcon.type).toBe(Feather);
        expect(renderedIcon.props.color).toBe(green);
        expect(renderedIcon.props.name).toBe('user-plus');
        expect(renderedIcon.props.size).toBe(80);
    });

    it('should not render the Admin button if the user is not an admin', () => {
        expectedProps.user.isAdmin = false;
        renderComponent();

        expect(renderedAdminButtonWrapper.type).toBeFalsy();
    });

    it('should render the select images button', () => {
        expect(renderedSelectButton.type).toBe(Button);
        expect(renderedSelectButton.props.action).toBe(expectedProps.actions.toggleImageModal);
        expect(renderedSelectButton.props.fontSize).toBe(18);
        expect(renderedSelectButton.props.height).toBe(20);
        expect(renderedSelectButton.props.text).toBe('Select Images');
        expect(renderedSelectButton.props.width).toBe(30);
    });

    it('should render the UploadButton', () => {
        expect(renderedUploadButton.type).toBe(UploadButton);
        expect(renderedUploadButton.props.actions).toBe(expectedProps.actions);
        expect(renderedUploadButton.props.selectedImages).toBe(expectedProps.selectedImages);
        expect(renderedUploadButton.props.user).toBe(expectedProps.user);
    });

    it('should render the SelectedPreview', () => {
        expect(renderedSelectedPreview.type).toBe(SelectedPreview);
        expect(renderedSelectedPreview.props.actions).toBe(expectedProps.actions);
        expect(renderedSelectedPreview.props.selectedImages).toBe(expectedProps.selectedImages);
    });

    it('should render the logout button', () => {
        expect(renderedLogoutButton.type).toBe(Button);
        expect(renderedLogoutButton.props.fontSize).toBe(15);
        expect(renderedLogoutButton.props.height).toBe(20);
        expect(renderedLogoutButton.props.text).toBe('LOGOUT');
        expect(renderedLogoutButton.props.width).toBe(40);

        renderedLogoutButton.props.action();

        expect(logout).toHaveBeenCalledTimes(1);
        expect(logout).toHaveBeenCalledWith(expectedProps.actions);
    });
});
