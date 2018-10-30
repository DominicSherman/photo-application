import React from 'react';
import Chance from 'chance';
import {FlatList, Modal, SafeAreaView, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ShallowRenderer from 'react-test-renderer/shallow';

import ImageSelectModal from '../../src/screens/ImageSelectModal';
import CameraRollRow from '../../src/components/CameraRollRow';

const chance = new Chance();

describe('ImageSelectModal', () => {
    let expectedProps,

        renderedComponent,

        renderedSafeAreaView,

        renderedView,
        renderedFlatlist,

        renderedTouchable,
        renderedSelectText,
        renderedDoneText,

        renderedIcon;

    const cacheChildren = () => {
        renderedSafeAreaView = renderedComponent.props.children;

        [
            renderedView,
            renderedFlatlist
        ] = renderedSafeAreaView.props.children;

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
                setSelectedImages: jest.fn(),
                toggleImageModal: jest.fn()
            },
            cameraRollRows: chance.n(chance.string, chance.d6() + 1),
            imageModalVisible: chance.bool(),
            selectedImages: chance.n(chance.string, chance.d6() + 1)
        };

        renderComponent();
    });

    it('should render a root modal', () => {
        expect(renderedComponent.type).toBe(Modal);
    });

    it('should render a SafeAreaView', () => {
        expect(renderedSafeAreaView.type).toBe(SafeAreaView);
    });

    it('should render a header view', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render a Touchable to close', () => {
        expect(renderedTouchable.type).toBe(Touchable);

        renderedTouchable.props.onPress();

        expect(expectedProps.actions.toggleImageModal).toHaveBeenCalledTimes(1);
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
        expect(renderedDoneText.props.onPress).toBe(expectedProps.actions.toggleImageModal);
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
