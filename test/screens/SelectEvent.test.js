import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {FlatList, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {Navigation} from 'react-native-navigation';

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
    let expectedProps,

        renderedInstance,
        renderedComponent,
        renderedFlatlist;

    const cacheChildren = () => {
        renderedFlatlist = renderedComponent.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<SelectEvent {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setEvent: jest.fn()
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

    it('should return a LoadingView when there are not events', () => {
        expectedProps.events = null;
        renderComponent();

        expect(renderedComponent.type).toBe(LoadingView);
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
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

            const renderedTouchable = renderedFlatlist.props.renderItem({item});
            const renderedView = renderedTouchable.props.children;
            const renderedText = renderedView.props.children;

            expect(renderedTouchable.type).toBe(Touchable);
            expect(renderedView.type).toBe(View);
            expect(renderedText.type).toBe(Text);
            expect(renderedText.props.children).toBe(item.eventName);

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
