import React from 'react';
import {Text, View, Linking} from 'react-native';
import ShallowRenderer from 'react-test-renderer/shallow';

import RequestAccess from '../../src/components/RequestAccess';

describe('RequestAccess', () => {
    let expectedProps,

        renderedComponent,

        renderedText,

        renderedTextChild,
        renderedRequestText;

    const cacheChildren = () => {
        renderedText = renderedComponent.props.children;

        [
            renderedTextChild,
            renderedRequestText
        ] = renderedText.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<RequestAccess {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {};
        Linking.openUrl = jest.fn();

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render don\'t have access text wrapper', () => {
        expect(renderedText.type).toBe(Text);
        expect(renderedTextChild).toBe('Don\'t have access? ');
    });

    it('should render request text', () => {
        expect(renderedRequestText.type).toBe(Text);
        expect(renderedRequestText.props.children).toBe('Request it');

        renderedRequestText.props.onPress();

        expect(Linking.openURL).toHaveBeenCalledTimes(1);
        expect(Linking.openURL).toHaveBeenCalledWith('mailto:dominic.sherman98@gmail.com?subject=DMPhotos Access&body=Requesting access for: ');
    });
});
