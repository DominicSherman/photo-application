import React from 'react';
import Chance from 'chance';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ShallowRenderer from 'react-test-renderer/shallow';

import ImageSelectModal from '../../src/screens/ImageSelectModal';
import CameraRollRow from '../../src/components/CameraRollRow';
import {dismissModal} from '../../src/services/navigation-service';

jest.mock('../../src/services/navigation-service');

const chance = new Chance();

describe('ImageSelectModal', () => {
    let expectedProps,

        renderedComponent,

        renderedView,
        renderedFlatlist,

        renderedTouchable,
        renderedSelectText,
        renderedDoneText,

        renderedIcon;

    const cacheChildren = () => {
        [
            renderedView,
            renderedFlatlist
        ] = renderedComponent.props.children;

        [
            renderedTouchable,
            renderedSelectText,
            renderedDoneText
        ] = renderedView.props.children;

        renderedIcon = renderedTouchable.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<ImageSelectModal {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setSelectedImages: jest.fn()
            },
            cameraRollRows: chance.n(chance.string, chance.d6() + 1),
            componentId: chance.natural(),
            selectedImages: chance.n(chance.string, chance.d6() + 1)
        };

        renderComponent();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render a SafeAreaView', () => {
        expect(renderedComponent.type).toBe(SafeAreaView);
    });

    it('should render a header view', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render a Touchable to close', () => {
        expect(renderedTouchable.type).toBe(Touchable);

        renderedTouchable.props.onPress();

        expect(dismissModal).toHaveBeenCalledTimes(1);
        expect(dismissModal).toHaveBeenCalledWith(expectedProps.componentId);
        expect(expectedProps.actions.setSelectedImages).toHaveBeenCalledTimes(1);
        expect(expectedProps.actions.setSelectedImages).toHaveBeenCalledWith([]);
    });

    it('should render a close icon', () => {
        expect(renderedIcon.type).toBe(EvilIcons);
    });

    it('should render select text', () => {
        expect(renderedSelectText.type).toBe(Text);
        expect(renderedSelectText.props.children).toBe('Select Images to Upload');
    });

    it('should render text for Done', () => {
        expect(renderedDoneText.type).toBe(Text);

        renderedDoneText.props.onPress();

        expect(dismissModal).toHaveBeenCalledTimes(1);
        expect(dismissModal).toHaveBeenCalledWith(expectedProps.componentId);
        expect(renderedDoneText.props.children).toBe('Done');
    });

    it('should render a FlatList', () => {
        expect(renderedFlatlist.type).toBe(FlatList);
        expect(renderedFlatlist.props.data).toBe(expectedProps.cameraRollRows);
        expect(renderedFlatlist.props.extraData).toBe(expectedProps.selectedImages);
    });

    it('should render the key', () => {
        const item = chance.string();
        const index = chance.natural();
        const key = renderedFlatlist.props.keyExtractor(item, index);

        expect(key).toEqual(index.toString());
    });

    it('should render a CameraRollRow for each item', () => {
        const item = chance.string();
        const renderedFlatListData = renderedFlatlist.props.renderItem(item);

        expect(renderedFlatListData.type).toBe(CameraRollRow);
        expect(renderedFlatListData.props.actions).toBe(expectedProps.actions);
        expect(renderedFlatListData.props.images).toBe(expectedProps.item);
        expect(renderedFlatListData.props.selectedImages).toBe(expectedProps.selectedImages);
    });
});
