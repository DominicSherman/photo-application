import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {SafeAreaView, TextInput, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import CreateEventModal from '../../src/screens/CreateEventModal';
import {dismissModal} from '../../src/services/navigation-service';
import Button from '../../src/components/Button';
import {createEvent} from '../../src/services/firebase-service';

jest.mock('../../src/services/navigation-service');
jest.mock('../../src/services/firebase-service');

const chance = new Chance();

describe('CreateEventModal', () => {
    let expectedProps,
        expectedEventName,
        expectedAdmin,

        renderedComponent,
        renderedInstance,

        renderedHeaderView,
        renderedWrapperView,

        renderedCloseTouchable,
        renderedCloseIcon,

        renderedTextWrapper,
        renderedCreateButton,

        renderedEventNameWrapper,
        renderedAdminWrapper,

        renderedEventNameInput,
        renderedAdminInput;

    const cacheChildren = () => {
        [
            renderedHeaderView,
            renderedWrapperView
        ] = renderedComponent.props.children;

        renderedCloseTouchable = renderedHeaderView.props.children;
        renderedCloseIcon = renderedCloseTouchable.props.children;

        [
            renderedTextWrapper,
            renderedCreateButton
        ] = renderedWrapperView.props.children;

        [
            renderedEventNameWrapper,
            renderedAdminWrapper
        ] = renderedTextWrapper.props.children;

        renderedEventNameInput = renderedEventNameWrapper.props.children;
        renderedAdminInput = renderedAdminWrapper.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<CreateEventModal {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            env: chance.string()
        };
        expectedEventName = chance.string();
        expectedAdmin = chance.string();

        renderComponent();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render a root SafeAreaView', () => {
        expect(renderedComponent.type).toBe(SafeAreaView);
    });

    it('should render a header view', () => {
        expect(renderedHeaderView.type).toBe(View);
    });

    it('should render a close icon touchable', () => {
        expect(renderedCloseTouchable.type).toBe(Touchable);

        renderedCloseTouchable.props.onPress();

        expect(dismissModal).toHaveBeenCalledTimes(1);
        expect(dismissModal).toHaveBeenCalledWith(expectedProps.componentId);
    });

    it('should render a close icon', () => {
        expect(renderedCloseIcon.type).toBe(EvilIcons);
    });

    it('should render a view to wrap the text', () => {
        expect(renderedWrapperView.type).toBe(View);
    });

    it('should render a view for the text', () => {
        expect(renderedTextWrapper.type).toBe(View);
    });

    it('should render a wrapper for the eventName textInput', () => {
        expect(renderedEventNameWrapper.type).toBe(View);
    });

    it('should render a TextInput for the event name', () => {
        expect(renderedEventNameInput.type).toBe(TextInput);
        expect(renderedEventNameInput.props.autoCapitalize).toBe('words');
        expect(renderedEventNameInput.props.placeholder).toBe('Event Name');

        renderedEventNameInput.props.onChangeText(expectedEventName);
        renderedComponent = renderedInstance.render();
        cacheChildren();

        expect(renderedEventNameInput.props.value).toBe(expectedEventName);
    });

    it('should render a wrapper for the admin textInput', () => {
        expect(renderedAdminWrapper.type).toBe(View);
    });

    it('should render a TextInput for the admin', () => {
        expect(renderedAdminInput.type).toBe(TextInput);
        expect(renderedAdminInput.props.autoCapitalize).toBe('none');
        expect(renderedAdminInput.props.placeholder).toBe('Admin Email');

        renderedAdminInput.props.onChangeText(expectedAdmin);
        renderedComponent = renderedInstance.render();
        cacheChildren();

        expect(renderedAdminInput.props.value).toBe(expectedAdmin.toLowerCase());
    });

    it('should render the create button', () => {
        expect(renderedCreateButton.type).toBe(Button);
        expect(renderedCreateButton.props.fontSize).toBe(30);
        expect(renderedCreateButton.props.height).toBe(15);
        expect(renderedCreateButton.props.text).toBe('Create');
        expect(renderedCreateButton.props.width).toBe(80);

        renderedInstance.setEventName(expectedEventName);
        renderedInstance.setPrimaryAdmin(expectedAdmin);
        renderedComponent = renderedInstance.render();
        cacheChildren();

        renderedCreateButton.props.action();
        expect(createEvent).toHaveBeenCalledTimes(1);
        expect(createEvent).toHaveBeenCalledWith(expectedProps.env, expectedEventName, expectedAdmin);
        expect(dismissModal).toHaveBeenCalledTimes(1);
        expect(dismissModal).toHaveBeenCalledWith(expectedProps.componentId);
    });

    it('should not do anything onPress if there is neither an eventName or a primaryAdmin', () => {
        renderedCreateButton.props.action();

        expect(createEvent).not.toHaveBeenCalled();
        expect(dismissModal).not.toHaveBeenCalled();
    });

    it('should not do anything onPress if there is not an eventName but there is a primaryAdmin', () => {
        renderedInstance.setPrimaryAdmin(expectedAdmin);
        renderedCreateButton.props.action();

        expect(createEvent).not.toHaveBeenCalled();
        expect(dismissModal).not.toHaveBeenCalled();
    });

    it('should not do anything onPress if there is not a primaryAdmin but there is an eventName', () => {
        renderedInstance.setEventName(expectedEventName);
        renderedCreateButton.props.action();

        expect(createEvent).not.toHaveBeenCalled();
        expect(dismissModal).not.toHaveBeenCalled();
    });
});
