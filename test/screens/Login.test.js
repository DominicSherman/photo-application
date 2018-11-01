import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {TextInput, View, Image} from 'react-native';

import Login from '../../src/screens/Login';
import {createRandomUser} from '../model-factory';
import Button from '../../src/components/Button';

jest.mock('../../src/services/helper-functions');

const chance = new Chance();

describe('Login', () => {
    let expectedProps,

        renderedComponent,

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

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                login: jest.fn(),
                setEmail: jest.fn(),
                setName: jest.fn(),
                toggleUserModal: jest.fn()
            },
            user: createRandomUser(),
            users: chance.n(createRandomUser, chance.d6() + 1)
        };

        renderComponent();
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

    it('should render the logo', () => {
        expect(renderedLogo.type).toBe(Image);
        expect(renderedLogo.props.resizeMode).toBe('contain');
        expect(renderedLogo.props.source).toBe(require('../../src/assets/cake.png'));
    });
});
