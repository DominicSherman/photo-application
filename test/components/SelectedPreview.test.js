import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {Image, ScrollView, Text, View} from 'react-native';

import SelectedPreview from '../../src/components/SelectedPreview';
import {createRandomImage} from '../model-factory';

const chance = new Chance();

describe('SelectedPreview', () => {
    let expectedImages,
        expectedSelectedImages,
        expectedProps,

        renderedComponent,

        renderedView,
        renderedText,

        renderedScrollView,
        renderedSelectedImages;

    const cacheChildren = () => {
        [
            renderedView,
            renderedScrollView
        ] = renderedComponent.props.children;

        renderedText = renderedView.props.children;

        renderedSelectedImages = renderedScrollView.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<SelectedPreview {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedImages = chance.n(createRandomImage, chance.d6() + 1);
        expectedImages.forEach((i) => {
            expectedSelectedImages = {
                ...expectedSelectedImages,
                [`${i.image.filename}`]: i
            }
        });
        expectedProps = {
            selectedImages: expectedSelectedImages
        };

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render a view for the text', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render Text', () => {
        expect(renderedText.type).toBe(Text);
        expect(renderedText.props.children).toBe(`${Object.keys(expectedProps.selectedImages).length} selected`)
    });

    it('should render a ScrollView', () => {
        expect(renderedScrollView.type).toBe(ScrollView);
    });
});