import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {TextInput, View, Image, ActivityIndicator, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Login from '../../src/screens/Login';
import {createRandomEvent, createRandomUser} from '../model-factory';
import Button from '../../src/components/Button';
import RequestAccess from '../../src/components/RequestAccess';

const chance = new Chance();

jest.mock('react-native-navigation');

describe('Login', () => {
    let expectedProps,

        renderedComponent,
        renderedInstance,

        renderedTextWrapper,
        renderedLoginButtonWrapper,
        renderedNotAuthorizedText,
        renderedRequestAccessText,
        renderedLogo,

        renderedEmailInputWrapper,
        renderedNameInputWrapper,

        renderedEmailInput,
        renderedNameInput,

        renderedLoginButton;

    const cacheChildren = () => {
        [
            renderedTextWrapper,
            renderedLoginButtonWrapper,
            renderedNotAuthorizedText,
            renderedRequestAccessText,
            renderedLogo
        ] = renderedComponent.props.children;

        [
            renderedEmailInputWrapper,
            renderedNameInputWrapper
        ] = renderedTextWrapper.props.children;

        renderedEmailInput = renderedEmailInputWrapper.props.children;

        renderedNameInput = renderedNameInputWrapper.props.children;

        renderedLoginButton = renderedLoginButtonWrapper.props.children;
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
                setName: jest.fn(),
                setUsers: jest.fn()
            },
            componentId: chance.natural(),
            event: createRandomEvent(),
            failedLogin: chance.bool(),
            user: createRandomUser(),
            users: chance.n(createRandomUser, chance.d6() + 1)
        };

        renderComponent();
    });

    describe('componentDidMount', () => {
        beforeEach(() => {
            renderedInstance.componentDidMount();
        });

        it('should merge options', () => {
            expect(Navigation.mergeOptions).toHaveBeenCalledTimes(1);
            expect(Navigation.mergeOptions).toHaveBeenCalledWith(expectedProps.componentId, {
                topBar: {
                    title: {
                        text: expectedProps.event.eventName
                    }
                }
            });
        });

        it('should set users', () => {
            expect(expectedProps.actions.setUsers).toHaveBeenCalledTimes(1);
        });
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render the text wrapper', () => {
        expect(renderedTextWrapper.type).toBe(View);
    });

    it('should render the email input wrapper', () => {
        expect(renderedEmailInputWrapper.type).toBe(View);
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

    it('should render the name input wrapper', () => {
        expect(renderedNameInputWrapper.type).toBe(View);
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

    it('should render a wrapper for the login button', () => {
        expect(renderedLoginButtonWrapper.type).toBe(View);
    });

    it('should render the login button', () => {
        expect(renderedLoginButton.type).toBe(Button);
        expect(renderedLoginButton.props.action).toBe(expectedProps.actions.login);
        expect(renderedLoginButton.props.fontSize).toBe(30);
        expect(renderedLoginButton.props.height).toBe(15);
        expect(renderedLoginButton.props.text).toBe('Login');
        expect(renderedLoginButton.props.width).toBe(80);
    });

    it('should render the loading indicator instead of the button when there are not users', () => {
        expectedProps.users = null;
        renderComponent();

        expect(renderedLoginButtonWrapper.type).toBe(ActivityIndicator);
    });

    it('should render the email not authorized text when there has been a failed login', () => {
        expectedProps.failedLogin = true;
        renderComponent();

        expect(renderedNotAuthorizedText.type).toBe(Text);
        expect(renderedNotAuthorizedText.props.children).toBe('Email not authorized');
    });

    it('should return false if failedLogin is false', () => {
        expectedProps.failedLogin = false;
        renderComponent();

        expect(renderedNotAuthorizedText).toBeFalsy();
    });

    it('should render the RequestAccess component', () => {
        expect(renderedRequestAccessText.type).toBe(RequestAccess);
    });

    it('should render the logo if the event name is Dominic & Mary', () => {
        expectedProps.event.eventName = 'Dominic & Mary\'s Wedding';
        renderComponent();

        expect(renderedLogo.type).toBe(Image);
        expect(renderedLogo.props.resizeMode).toBe('contain');
    });

    it('should not return the logo if it is not Dominic & Mary', () => {
        expect(renderedLogo).toBeFalsy();
    });
});
