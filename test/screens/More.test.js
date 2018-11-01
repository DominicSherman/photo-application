import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Feather from 'react-native-vector-icons/Feather';

import More from '../../src/screens/More';
import {green} from '../../src/constants/style-variables';
import {createRandomUser} from '../model-factory';
import {showModal} from '../../src/services/navigation-service';
import {USER_MODAL} from '../../src/constants/routes';
import Button from '../../src/components/Button';

jest.mock('../../src/services/navigation-service');

describe('More', () => {
    let expectedProps,

        renderedComponent,

        renderedUserWrapper,
        renderedAdminButtonWrapper,
        renderedLogoutButton,

        renderedUserName,
        renderedUserEmail,

        renderedAdminButtonTouchable,

        renderedAdminButtonIcon;

    const cacheChildrenIsAdmin = () => {
        renderedAdminButtonTouchable = renderedAdminButtonWrapper.props.children;

        renderedAdminButtonIcon = renderedAdminButtonTouchable.props.children;
    };

    const cacheChildren = () => {
        [
            renderedUserWrapper,
            renderedAdminButtonWrapper,
            renderedLogoutButton
        ] = renderedComponent.props.children;

        [
            renderedUserName,
            renderedUserEmail
        ] = renderedUserWrapper.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<More {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                logout: jest.fn()
            },
            user: createRandomUser()
        };

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render a wrapper for the user information', () => {
        expect(renderedUserWrapper.type).toBe(View);
    });

    it('should render the user name if they have a name', () => {
        expect(renderedUserName.type).toBe(Text);
        expect(renderedUserName.props.children).toBe(expectedProps.user.name);
    });

    it('should render the user email', () => {
        expect(renderedUserEmail.type).toBe(Text);
        expect(renderedUserEmail.props.children).toBe(expectedProps.user.email);
    });

    it('should render the Admin button if the user is an admin', () => {
        expectedProps.user.isAdmin = true;
        renderComponent();
        cacheChildrenIsAdmin();

        expect(renderedAdminButtonWrapper.type).toBe(View);
        expect(renderedAdminButtonTouchable.type).toBe(Touchable);

        renderedAdminButtonTouchable.props.onPress();

        expect(showModal).toHaveBeenCalledTimes(1);
        expect(showModal).toHaveBeenCalledWith(USER_MODAL);

        expect(renderedAdminButtonIcon.type).toBe(Feather);
        expect(renderedAdminButtonIcon.props.color).toBe(green);
        expect(renderedAdminButtonIcon.props.name).toBe('user-plus');
        expect(renderedAdminButtonIcon.props.size).toBe(80);
    });

    it('should not render the Admin button if the user is not an admin', () => {
        expectedProps.user.isAdmin = false;
        renderComponent();

        expect(renderedAdminButtonWrapper.type).toBeFalsy();
    });

    it('should render the logout button', () => {
        expect(renderedLogoutButton.type).toBe(Button);
        expect(renderedLogoutButton.props.action).toBe(expectedProps.actions.logout);
        expect(renderedLogoutButton.props.fontSize).toBe(15);
        expect(renderedLogoutButton.props.height).toBe(20);
        expect(renderedLogoutButton.props.text).toBe('LOGOUT');
        expect(renderedLogoutButton.props.width).toBe(40);
    });
});
