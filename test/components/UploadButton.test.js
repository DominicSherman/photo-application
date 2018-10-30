import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import Touchable from 'react-native-platform-touchable';
import {Text, View} from 'react-native';

import UploadButton from '../../src/components/UploadButton';
import {createRandomImage, createRandomUser} from '../model-factory';
import {uploadImage} from '../../src/services/firebase-service';
import Entypo from 'react-native-vector-icons/Entypo';

jest.mock('../../src/services/firebase-service');

const chance = new Chance();

describe('UploadButton', () => {
    let expectedProps,
        expectedSelectedImages,

        renderedComponent,
        renderedTouchable,
        renderedView,

        renderedIcon,
        renderedText;

    const cacheChildren = () => {
        renderedTouchable = renderedComponent.props.children;
        renderedView = renderedTouchable.props.children;
        [
            renderedIcon,
            renderedText
        ] = renderedView.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<UploadButton {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        const keys = chance.n(chance.string, chance.d6() + 1);

        expectedSelectedImages = {};
        keys.forEach((key) => {
            expectedSelectedImages = {
                ...expectedSelectedImages,
                [key]: createRandomImage()
            };
        });

        expectedProps = {
            actions: {
                setSelectedImages: jest.fn(),
                setUploading: jest.fn(),
                toggleImageModal: jest.fn()
            },
            selectedImages: expectedSelectedImages,
            user: createRandomUser()
        };

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render a Touchable that uploads the images', () => {
        expect(renderedTouchable.type).toBe(Touchable);
        renderedTouchable.props.onPress();

        const numImages = Object.keys(expectedProps.selectedImages).length;

        expect(expectedProps.actions.setSelectedImages).toHaveBeenCalledTimes(1);
        expect(expectedProps.actions.setSelectedImages).toHaveBeenCalledWith([]);
        expect(expectedProps.actions.setUploading).toHaveBeenCalledTimes(1);
        expect(expectedProps.actions.setUploading).toHaveBeenCalledWith(numImages);
        expect(uploadImage).toHaveBeenCalledTimes(numImages);
    });

    it('should render a Touchable that does nothing if there are no images selected', () => {
        expectedProps.selectedImages = [];
        renderComponent();

        expect(renderedTouchable.type).toBe(Touchable);
        renderedTouchable.props.onPress();

        expect(expectedProps.actions.setSelectedImages).not.toHaveBeenCalled();
    });

    it('should render a View', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render an upload icon', () => {
        expect(renderedIcon.type).toBe(Entypo);
        expect(renderedIcon.props.name).toBe('upload-to-cloud');
        expect(renderedIcon.props.size).toBe(120);
    });

    it('should render Text', () => {
        expect(renderedText.type).toBe(Text);
        expect(renderedText.props.children).toBe('Upload');
    });
});
