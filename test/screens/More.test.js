import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {Switch, Text, View} from 'react-native';
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
        renderedInstance,

        renderedUserWrapper,
        renderedAdminButtonWrapper,
        renderedLogoutButton,

        renderedUserName,
        renderedUserEmail,

        renderedAdminButtonTouchable,
        renderedSwitchWrapper,

        renderedAdminButtonIcon,

        renderedDevText,
        renderedSwitch,
        renderedProdText;

    const cacheChildrenIsAdmin = () => {
        [
            renderedAdminButtonTouchable,
            renderedSwitchWrapper
        ] = renderedAdminButtonWrapper.props.children;

        renderedAdminButtonIcon = renderedAdminButtonTouchable.props.children;

        [
            renderedDevText,
            renderedSwitch,
            renderedProdText
        ] = renderedSwitchWrapper.props.children;
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
        renderedInstance = shallowRenderer.getMountedInstance();

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

    describe('componentDidUpdate', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should set users again if the env has changed', () => {
            const prevProps = {
                ...expectedProps,
                env: chance.string()
            };

            renderedInstance.componentDidUpdate(prevProps);

            expect(expectedProps.actions.setUsers).toHaveBeenCalledTimes(1);
        });

        it('should do nothing if props have not changed', () => {
            renderedInstance.componentDidUpdate(expectedProps);

            expect(expectedProps.actions.setUsers).not.toHaveBeenCalled();
        });
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
            cacheChildrenIsAdmin();
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

        it('should render a view for the switch', () => {
            expect(renderedSwitchWrapper.type).toBe(View);
        });

        it('should render text for DEV', () => {
            expect(renderedDevText.type).toBe(Text);
            expect(renderedDevText.props.children).toBe('DEV');
        });

        it('should render a switch', () => {
            expect(renderedSwitch.type).toBe(Switch);
            expect(renderedSwitch.props.onValueChange).toBe(expectedProps.actions.toggleEnv);
            expect(renderedSwitch.props.value).toBeFalsy();
        });

        it('should render text for PROD', () => {
            expect(renderedProdText.type).toBe(Text);
            expect(renderedProdText.props.children).toBe('PROD');
        });
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
