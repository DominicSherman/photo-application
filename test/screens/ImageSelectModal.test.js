import React from 'react';
import Chance from 'chance';
import ReactNative, {FlatList, SafeAreaView, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ShallowRenderer from 'react-test-renderer/shallow';

import ImageSelectModal from '../../src/screens/ImageSelectModal';
import CameraRollRow from '../../src/components/CameraRollRow';
import {dismissModal} from '../../src/services/navigation-service';
import {requestExternalStorage} from '../../src/services/permission-service';
import {numPictures} from '../../src/constants/variables';
import LoadingView from '../../src/screens/LoadingView';

jest.mock('../../src/services/navigation-service');
jest.mock('../../src/services/permission-service');

const chance = new Chance();

describe('ImageSelectModal', () => {
    let expectedProps,

        renderedInstance,
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
        renderedInstance = shallowRenderer.getMountedInstance();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setCameraRollRows: jest.fn(),
                setSelectedImages: jest.fn()
            },
            cameraRollRows: chance.n(chance.string, chance.d6() + 1),
            componentId: chance.natural(),
            selectedImages: chance.n(chance.string, chance.d6() + 1)
        };

        renderComponent();
        cacheChildren();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('componentDidMount', () => {
        let thenSpy,
            getPhotosSpy;

        beforeEach(() => {
            thenSpy = jest.fn();
            getPhotosSpy = jest.fn(() => ({
                then: thenSpy
            }));
            ReactNative.CameraRoll.getPhotos = getPhotosSpy;
        });

        it('should call getPhotos if is ios', async () => {
            await renderedInstance.componentDidMount();

            expect(getPhotosSpy).toHaveBeenCalledTimes(1);
            expect(getPhotosSpy).toHaveBeenCalledWith({
                assetType: 'All',
                first: numPictures
            });
        });

        it('should not call getPhotos if is android requestExternalStorage returns false', async () => {
            ReactNative.Platform.OS = 'android';
            requestExternalStorage.mockReturnValue(Promise.resolve(false));

            await renderedInstance.componentDidMount();

            expect(getPhotosSpy).not.toHaveBeenCalled();
        });

        it('should call getPhotos if is android and requestExternalStorage returns true', async () => {
            ReactNative.Platform.OS = 'android';
            requestExternalStorage.mockReturnValue(Promise.resolve(true));

            await renderedInstance.componentDidMount();

            expect(getPhotosSpy).toHaveBeenCalledTimes(1);
        });

        it('should call then', async () => {
            ReactNative.Platform.OS = 'ios';
            await renderedInstance.componentDidMount();

            expect(thenSpy).toHaveBeenCalledTimes(1);

            const r = chance.string();

            thenSpy.mock.calls[0][0](r);

            expect(expectedProps.actions.setCameraRollRows).toHaveBeenCalledTimes(1);
            expect(expectedProps.actions.setCameraRollRows).toHaveBeenCalledWith(r);
        });
    });

    it('should return loading if there are no pictures', () => {
        expectedProps.cameraRollRows = [];
        renderComponent();

        expect(renderedComponent.type).toBe(LoadingView);
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
