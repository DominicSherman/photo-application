import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Touchable from 'react-native-platform-touchable';
import {Text, View} from 'react-native';
import UploadButton from '../../src/components/UploadButton';

jest.mock('react-native-fetch-blob', () => ({
    DocumentDir: () => ({})
}));

describe('UploadButton', () => {
    let expectedProps,

        renderedComponent,
        renderedTouchable,
        renderedView,
        renderedText;

    const cacheChildren = () => {
        renderedTouchable = renderedComponent.props.children;
        renderedView = renderedTouchable.props.children;
        renderedText = renderedView.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<UploadButton {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            toggleImageModal: jest.fn()
        };

        renderComponent();
    });

    it('should render a View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render a Touchable', () => {
        expect(renderedTouchable.type).toBe(Touchable);
    });

    it('should render a View', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render Text', () => {
        expect(renderedText.type).toBe(Text);
        expect(renderedText.props.children).toBe('UPLOAD');
    });
});