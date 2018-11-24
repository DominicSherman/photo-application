import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {FlatList, Switch, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {Navigation} from 'react-native-navigation';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import SelectEvent from '../../src/screens/SelectEvent';
import {createRandomEvent} from '../model-factory';
import LoadingView from '../../src/screens/LoadingView';
import Button from '../../src/components/Button';
import {goToRoute, showModal} from '../../src/services/navigation-service';
import {CREATE_EVENT, LOGIN} from '../../src/constants/routes';

jest.mock('react-native-navigation');
jest.mock('../../src/services/navigation-service');

const chance = new Chance();

describe('SelectEvent', () => {
    let Alert,
        expectedProps,

        renderedInstance,
        renderedComponent,

        renderedHiddenTouchable,
        renderedSwitchView,
        renderedFlatlist,

        renderedHiddenText,

        renderedDevText,
        renderedSwitch,
        renderedProdText;

    const cacheChildren = () => {
        [
            renderedHiddenTouchable,
            renderedSwitchView,
            renderedFlatlist
        ] = renderedComponent.props.children;

        renderedHiddenText = renderedHiddenTouchable.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<SelectEvent {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();
    };

    beforeEach(() => {
        Alert = require('react-native').Alert;
        Alert.alert = jest.fn();

        expectedProps = {
            actions: {
                deleteEvent: jest.fn(),
                setEvent: jest.fn(),
                setEvents: jest.fn()
            },
            componentId: chance.string(),
            event: createRandomEvent(),
            events: chance.n(createRandomEvent, chance.d6() + 1)
        };

        renderComponent();
        cacheChildren();
    });

    it('should merge options on componentDidMount', () => {
        renderedInstance.componentDidMount();

        expect(Navigation.mergeOptions).toHaveBeenCalledTimes(1);
        expect(Navigation.mergeOptions).toHaveBeenCalledWith(expectedProps.componentId, {
            topBar: {
                title: {
                    text: 'Select Event'
                }
            }
        });
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

            expect(expectedProps.actions.setEvents).toHaveBeenCalledTimes(1);
        });

        it('should do nothing if props have not changed', () => {
            renderedInstance.componentDidUpdate(expectedProps);

            expect(expectedProps.actions.setEvents).not.toHaveBeenCalled();
        });
    });

    it('should return a LoadingView when there are not events', () => {
        expectedProps.events = null;
        renderComponent();

        expect(renderedComponent.type).toBe(LoadingView);
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render the hidden touchable and text', () => {
        expect(renderedHiddenTouchable.type).toBe(Touchable);
        expect(renderedHiddenText.type).toBe(Text);
    });

    describe('if the text has been pressed 10 times', () => {
        const cacheChildren10Presses = () => {
            [
                renderedDevText,
                renderedSwitch,
                renderedProdText
            ] = renderedSwitchView.props.children;
        };

        beforeEach(() => {
            renderComponent();

            for (let i = 0; i < 10; i++) {
                renderedInstance.incrementPresses();
            }

            renderedComponent = renderedInstance.render();
            cacheChildren();
            cacheChildren10Presses();
        });

        it('should render a view for the switch', () => {
            expect(renderedSwitchView.type).toBe(View);
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

        it('should render the delete button for each flatlist item', () => {
            const item = chance.pickone(expectedProps.events);

            const renderedWrapperView = renderedFlatlist.props.renderItem({item});
            const [
                renderedTouchable,
                renderedDeleteView
            ] = renderedWrapperView.props.children;
            const renderedDeleteTouchable = renderedDeleteView.props.children;
            const renderedDeleteIcon = renderedDeleteTouchable.props.children;

            expect(renderedTouchable.type).toBe(Touchable);
            expect(renderedDeleteTouchable.type).toBe(Touchable);
            expect(renderedDeleteIcon.type).toBe(EvilIcons);

            renderedDeleteTouchable.props.onPress();

            expect(Alert.alert).toHaveBeenCalledTimes(1);
            expect(Alert.alert).toHaveBeenCalledWith(
                'Are you sure?',
                item.eventName,
                [
                    {text: 'Cancel'},
                    {
                        onPress: expect.any(Function),
                        text: 'Yes'
                    }
                ]
            );

            Alert.alert.mock.calls[0][2][1].onPress();

            expect(expectedProps.actions.deleteEvent).toHaveBeenCalledTimes(1);
            expect(expectedProps.actions.deleteEvent).toHaveBeenCalledWith(item.eventId);
        });
    });

    describe('FlatList', () => {
        it('should render a FlatList', () => {
            expect(renderedFlatlist.type).toBe(FlatList);
            expect(renderedFlatlist.props.data).toBe(expectedProps.events);
            expect(renderedFlatlist.props.extraData).toBe(expectedProps.event);
        });

        it('should render the ListEmptyComponent', () => {
            const listEmptyComponent = renderedFlatlist.props.ListEmptyComponent;
            const renderedText = listEmptyComponent.props.children;

            expect(listEmptyComponent.type).toBe(View);
            expect(renderedText.type).toBe(Text);
            expect(renderedText.props.children).toBe('No events created');
        });

        it('should render the ListFooterComponent', () => {
            const listFooterComponent = renderedFlatlist.props.ListFooterComponent;
            const renderedButton = listFooterComponent.props.children;

            expect(listFooterComponent.type).toBe(View);
            expect(renderedButton.type).toBe(Button);
            expect(renderedButton.props.fontSize).toBe(30);
            expect(renderedButton.props.height).toBe(15);
            expect(renderedButton.props.text).toBe('Create Event');
            expect(renderedButton.props.width).toBe(50);

            renderedButton.props.action();

            expect(showModal).toHaveBeenCalledTimes(1);
            expect(showModal).toHaveBeenCalledWith(CREATE_EVENT);
        });

        it('should renderItem', () => {
            const item = chance.pickone(expectedProps.events);

            const renderedWrapperView = renderedFlatlist.props.renderItem({item});
            const [
                renderedTouchable,
                renderedDeleteView
            ] = renderedWrapperView.props.children;
            const renderedView = renderedTouchable.props.children;
            const renderedText = renderedView.props.children;

            expect(renderedWrapperView.type).toBe(View);
            expect(renderedTouchable.type).toBe(Touchable);
            expect(renderedView.type).toBe(View);
            expect(renderedText.type).toBe(Text);
            expect(renderedText.props.children).toBe(item.eventName);
            expect(renderedDeleteView).toBeFalsy();

            renderedTouchable.props.onPress();

            expect(expectedProps.actions.setEvent).toHaveBeenCalledTimes(1);
            expect(expectedProps.actions.setEvent).toHaveBeenCalledWith(item);
            expect(goToRoute).toHaveBeenCalledTimes(1);
            expect(goToRoute).toHaveBeenCalledWith(LOGIN, expectedProps.componentId);
        });

        it('should extract the key', () => {
            const key = renderedFlatlist.props.keyExtractor(expectedProps.event);

            expect(key).toBe(expectedProps.event.eventId);
        });
    });
});
