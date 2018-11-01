import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {FlatList, SafeAreaView, Switch, Text, TextInput, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import UserModal from '../../src/screens/UserModal';
import Button from '../../src/components/Button';
import {addUser} from '../../src/services/firebase-service';
import {createRandomUser} from '../model-factory';
import {dismissModal} from '../../src/services/navigation-service';

const chance = new Chance();

jest.mock('../../src/services/firebase-service');
jest.mock('../../src/services/navigation-service');

describe('UserModal', () => {
    let expectedProps,

        renderedInstance,
        renderedComponent,

        renderedHeaderView,
        renderedBodyView,

        renderedCloseTouchable,

        renderedEmailInput,
        renderedAdminView,
        renderedAddButton,
        renderedCurrentUsersView,

        renderedCloseIcon,

        renderedAdminText,
        renderedAdminSwitch,

        renderedCurrentUsersText,
        renderedCurrentUsersHeaderView,
        renderedFlatlist,

        renderedCurrentUsersHeaderEmailText,
        renderedCurrentUsersHeaderAdminText;

    const cacheChildren = () => {
        [
            renderedHeaderView,
            renderedBodyView
        ] = renderedComponent.props.children;

        renderedCloseTouchable = renderedHeaderView.props.children;

        [
            renderedEmailInput,
            renderedAdminView,
            renderedAddButton,
            renderedCurrentUsersView
        ] = renderedBodyView.props.children;

        renderedCloseIcon = renderedCloseTouchable.props.children;

        [
            renderedAdminText,
            renderedAdminSwitch
        ] = renderedAdminView.props.children;

        [
            renderedCurrentUsersText,
            renderedCurrentUsersHeaderView,
            renderedFlatlist
        ] = renderedCurrentUsersView.props.children;

        [
            renderedCurrentUsersHeaderEmailText,
            renderedCurrentUsersHeaderAdminText
        ] = renderedCurrentUsersHeaderView.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<UserModal {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            componentId: chance.natural(),
            users: chance.n(createRandomUser, chance.d6() + 1)
        };

        renderComponent();
    });

    it('should render a SafeAreaView', () => {
        expect(renderedComponent.type).toBe(SafeAreaView);
    });

    it('should render a header view', () => {
        expect(renderedHeaderView.type).toBe(View);
    });

    it('should render a close touchable', () => {
        expect(renderedCloseTouchable.type).toBe(Touchable);

        renderedCloseTouchable.props.onPress();

        expect(dismissModal).toHaveBeenCalledTimes(1);
        expect(dismissModal).toHaveBeenCalledWith(expectedProps.componentId);
    });

    it('should render a close icon', () => {
        expect(renderedCloseIcon.type).toBe(EvilIcons);
        expect(renderedCloseIcon.props.name).toBe('close');
        expect(renderedCloseIcon.props.size).toBe(30);
    });

    it('should render a wrapper view for the body ', () => {
        expect(renderedBodyView.type).toBe(View);
    });

    it('should render TextInput for the email', () => {
        expect(renderedEmailInput.type).toBe(TextInput);
        expect(renderedEmailInput.props.autoCapitalize).toBe('none');
        expect(renderedEmailInput.props.clearTextOnFocus).toBeTruthy();
        expect(renderedEmailInput.props.numberOfLines).toBe(2);
        expect(renderedEmailInput.props.placeholder).toBe('Email');

        const email = chance.string();

        renderedEmailInput.props.onChangeText(email);

        renderedComponent = renderedInstance.render();
        cacheChildren();

        expect(renderedEmailInput.props.value).toBe(email);
    });

    it('should render a view for the admin switch', () => {
        expect(renderedAdminView.type).toBe(View);
    });

    it('should render text for Admin', () => {
        expect(renderedAdminText.type).toBe(Text);
        expect(renderedAdminText.props.children).toBe('Admin');
    });

    it('should render a switch for isAdmin', () => {
        expect(renderedAdminSwitch.type).toBe(Switch);

        const isAdmin = chance.bool();

        renderedAdminSwitch.props.onValueChange(isAdmin);

        renderedComponent = renderedInstance.render();
        cacheChildren();

        expect(renderedAdminSwitch.props.value).toBe(isAdmin);
    });

    it('should render the Add button', () => {
        expect(renderedAddButton.type).toBe(Button);
        expect(renderedAddButton.props.fontSize).toBe(25);
        expect(renderedAddButton.props.height).toBe(18);
        expect(renderedAddButton.props.text).toBe('ADD');
        expect(renderedAddButton.props.width).toBe(50);

        const email = chance.string();
        const isAdmin = chance.bool();

        renderedEmailInput.props.onChangeText(email);

        renderedAdminSwitch.props.onValueChange(isAdmin);
        renderedComponent = renderedInstance.render();
        cacheChildren();

        renderedAddButton.props.action();

        expect(addUser).toHaveBeenCalledTimes(1);
        expect(addUser).toHaveBeenCalledWith(email.toLowerCase(), isAdmin);
    });

    it('should render a view for current users', () => {
        expect(renderedCurrentUsersView.type).toBe(View);
    });

    it('should render text for current users header', () => {
        expect(renderedCurrentUsersText.type).toBe(Text);
        expect(renderedCurrentUsersText.props.children).toBe('Current Users');
    });

    it('should render a view for the current users header', () => {
        expect(renderedCurrentUsersHeaderView.type).toBe(View);
    });

    it('should render text for email header', () => {
        expect(renderedCurrentUsersHeaderEmailText.type).toBe(Text);
        expect(renderedCurrentUsersHeaderEmailText.props.children).toBe('EMAIL');
    });

    it('should render text for admin header', () => {
        expect(renderedCurrentUsersHeaderAdminText.type).toBe(Text);
        expect(renderedCurrentUsersHeaderAdminText.props.children).toBe('ADMIN');
    });

    it('should render a Flatlist', () => {
        expect(renderedFlatlist.type).toBe(FlatList);
        expect(renderedFlatlist.props.data).toBe(expectedProps.users);
    });

    it('should extract the key', () => {
        const email = chance.string();
        const key = renderedFlatlist.props.keyExtractor({email});

        expect(key).toBe(email);
    });

    it('should render a row when it is an admin', () => {
        const email = chance.string();
        const isAdmin = true;

        const userRow = renderedFlatlist.props.renderItem({
            item: {
                email,
                isAdmin
            }
        });

        const [
            userEmailText,
            userIsAdminText
        ] = userRow.props.children;

        expect(userRow.type).toBe(View);
        expect(userEmailText.type).toBe(Text);
        expect(userEmailText.props.numberOfLines).toBe(1);
        expect(userEmailText.props.children).toBe(email);
        expect(userIsAdminText.type).toBe(Text);
        expect(userIsAdminText.props.children).toBe('Yes');
    });

    it('should render a row when it is not an admin', () => {
        const email = chance.string();
        const isAdmin = false;

        const userRow = renderedFlatlist.props.renderItem({
            item: {
                email,
                isAdmin
            }
        });

        const [
            userEmailText,
            userIsAdminText
        ] = userRow.props.children;

        expect(userRow.type).toBe(View);
        expect(userEmailText.type).toBe(Text);
        expect(userEmailText.props.numberOfLines).toBe(1);
        expect(userEmailText.props.children).toBe(email);
        expect(userIsAdminText.type).toBe(Text);
        expect(userIsAdminText.props.children).toBe('No');
    });
});
