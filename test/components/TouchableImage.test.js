import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Touchable from 'react-native-platform-touchable';
import {ImageBackground, Text, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import TouchableImage from '../../src/components/TouchableImage';

describe('TouchableImage', () => {
    let expectedProps,

        renderedComponent,
        renderedImageBackground,
        renderedView,
        renderedText,
        renderedIcon;

    const cacheChildren = () => {
        renderedImageBackground = renderedComponent.props.children;
        renderedView = renderedImageBackground.props.children;

        [
            renderedText,
            renderedIcon
        ] = renderedView.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<TouchableImage {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            toggleImageModal: jest.fn()
        };

        renderComponent();
    });

    it('should render a root Touchable', () => {
        expect(renderedComponent.type).toBe(Touchable);
    });

    it('should render a view', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render Text if there is a playableDuration', () => {
        expect(renderedText.type).toBe(Text);
    });

    it('should render a selectedCheck mark if it is selected', () => {
        expect(renderedIcon.type).toBe(EvilIcons);
    });
});