import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {TextInput, View, Image, ActivityIndicator} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Login from '../../src/screens/Login';
import {createRandomUser} from '../model-factory';
import Button from '../../src/components/Button';

const chance = new Chance();

jest.mock('react-native-navigation');

describe('Login', () => {
    let expectedProps,

        renderedComponent,
        renderedInstance,

        renderedTextWrapper,
        renderedLoginButton,
        renderedLogo,

        renderedEmailInput,
        renderedNameInput;

    const cacheChildren = () => {
        [
            renderedTextWrapper,
            renderedLoginButton,
            renderedLogo
        ] = renderedComponent.props.children;

        [
            renderedEmailInput,
            renderedNameInput
        ] = renderedTextWrapper.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<Login {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                login: jest.fn(),
                setEmail: jest.fn(),
                setName: jest.fn()
            },
            componentId: chance.natural(),
            user: createRandomUser(),
            users: chance.n(createRandomUser, chance.d6() + 1)
        };

        renderComponent();
    });

    it('should merge options on componentDidMount', () => {
        renderedInstance.componentDidMount();

        expect(Navigation.mergeOptions).toHaveBeenCalledTimes(1);
        expect(Navigation.mergeOptions).toHaveBeenCalledWith(expectedProps.componentId, {
            options: {
                bottomTabs: {
                    visible: false
                }
            }
        });
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render the text wrapper', () => {
        expect(renderedTextWrapper.type).toBe(View);
    });

    it('should render the email text input', () => {
        expect(renderedEmailInput.type).toBe(TextInput);
        expect(renderedEmailInput.props.autoCapitalize).toBe('none');
        expect(renderedEmailInput.props.placeholder).toBe('Email');
        expect(renderedEmailInput.props.value).toBe(expectedProps.user.email);

        const email = chance.string();

        renderedEmailInput.props.onChangeText(email);

        expect(expectedProps.actions.setEmail).toHaveBeenCalledTimes(1);
        expect(expectedProps.actions.setEmail).toHaveBeenCalledWith(email.toLowerCase());
    });

    it('should render the name text input', () => {
        expect(renderedNameInput.type).toBe(TextInput);
        expect(renderedNameInput.props.autoCapitalize).toBe('words');
        expect(renderedNameInput.props.placeholder).toBe('Name');
        expect(renderedNameInput.props.value).toBe(expectedProps.user.name);

        const name = chance.string();

        renderedNameInput.props.onChangeText(name);

        expect(expectedProps.actions.setName).toHaveBeenCalledTimes(1);
        expect(expectedProps.actions.setName).toHaveBeenCalledWith(name);
    });

    it('should render the login button', () => {
        expect(renderedLoginButton.type).toBe(Button);
        expect(renderedLoginButton.props.action).toBe(expectedProps.actions.login);
        expect(renderedLoginButton.props.fontSize).toBe(30);
        expect(renderedLoginButton.props.height).toBe(15);
        expect(renderedLoginButton.props.text).toBe('LOGIN');
        expect(renderedLoginButton.props.width).toBe(80);
    });

    it('should render the loading indicator instead of the button when there are not users', () => {
        expectedProps.users = null;
        renderComponent();

        expect(renderedLoginButton.type).toBe(ActivityIndicator);
    });

    it('should render the logo', () => {
        expect(renderedLogo.type).toBe(Image);
        expect(renderedLogo.props.resizeMode).toBe('contain');
    });
});
