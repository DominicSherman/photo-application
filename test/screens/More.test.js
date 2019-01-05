import React from 'react';
import Chance from 'chance';
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

const chance = new Chance();

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
                logout: jest.fn(),
                setUsers: jest.fn(),
                toggleEnv: jest.fn()
            },
            env: chance.string(),
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

    describe('if the user is an admin', () => {
        beforeEach(() => {
            expectedProps.user.isAdmin = true;
            renderComponent();
            cacheChildren();

            renderedAdminButtonTouchable = renderedAdminButtonWrapper.props.children;
            renderedAdminButtonIcon = renderedAdminButtonTouchable.props.children;
        });

        it('should render the touchable for the userModal', () => {
            expect(renderedAdminButtonWrapper.type).toBe(View);
            expect(renderedAdminButtonTouchable.type).toBe(Touchable);

            renderedAdminButtonTouchable.props.onPress();

            expect(showModal).toHaveBeenCalledTimes(1);
            expect(showModal).toHaveBeenCalledWith(USER_MODAL);
        });

        it('should render an icon for the userModal', () => {
            expect(renderedAdminButtonIcon.type).toBe(Feather);
            expect(renderedAdminButtonIcon.props.color).toBe(green);
            expect(renderedAdminButtonIcon.props.name).toBe('user-plus');
            expect(renderedAdminButtonIcon.props.size).toBe(80);
        });
    });

    it('should not render the Admin button if name has not been pressed 10 times', () => {
        expectedProps.user.isAdmin = false;
        renderComponent();

        expect(renderedAdminButtonWrapper.type).toBeFalsy();
    });

    it('should render the logout button', () => {
        expect(renderedLogoutButton.type).toBe(Button);
        expect(renderedLogoutButton.props.action).toBe(expectedProps.actions.logout);
        expect(renderedLogoutButton.props.fontSize).toBe(25);
        expect(renderedLogoutButton.props.height).toBe(20);
        expect(renderedLogoutButton.props.text).toBe('Logout');
        expect(renderedLogoutButton.props.width).toBe(40);
    });
});
