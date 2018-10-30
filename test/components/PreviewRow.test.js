import React from 'react';
import Chance from 'chance';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';
import {Image, Text, View} from 'react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import PreviewRow from '../../src/components/PreviewRow';
import {createRandomImage} from '../model-factory';

const chance = new Chance();

describe('PreviewRows', () => {
    let expectedProps,

        renderedComponent,

        renderedImage,
        renderedView,
        renderedTouchable,

        renderedText,

        renderedIcon;

    const cacheChildren = () => {
        [
            renderedImage,
            renderedView,
            renderedTouchable
        ] = renderedComponent.props.children;

        renderedText = renderedView.props.children;

        renderedIcon = renderedTouchable.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<PreviewRow {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            selectedImage: createRandomImage(),
            toggleSelected: jest.fn()
        };

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render the image thumbnail', () => {
        expect(renderedImage.type).toBe(Image);
        expect(renderedImage.props.source).toEqual({uri: expectedProps.selectedImage.image.uri});
    });

    it('should render a view', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render the filename text', () => {
        expect(renderedText.type).toBe(Text);
        expect(renderedText.props.numberOfLines).toBe(1);
        expect(renderedText.props.children).toBe(expectedProps.selectedImage.image.filename);
    });

    it('should render the touchable to deselect it', () => {
        expect(renderedTouchable.type).toBe(Touchable);

        renderedTouchable.props.onPress();

        expect(expectedProps.toggleSelected).toHaveBeenCalledTimes(1);
        expect(expectedProps.toggleSelected).toHaveBeenCalledWith(expectedProps.selectedImage);
    });

    it('should render the icon', () => {
        expect(renderedIcon.type).toBe(Entypo);
        expect(renderedIcon.props.color).toBe('red');
        expect(renderedIcon.props.name).toBe('circle-with-minus');
        expect(renderedIcon.props.size).toBe(20);
    });
});