import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {View, Text} from 'react-native';
import Touchable from 'react-native-platform-touchable';

import Button from '../../src/components/Button';

const chance = new Chance();

describe('Button', () => {
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

        shallowRenderer.render(<Button {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            action: jest.fn(),
            text: chance.string()
        };

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render a Touchable', () => {
        expect(renderedTouchable.type).toBe(Touchable);

        renderedTouchable.props.onPress();

        expect(expectedProps.action).toHaveBeenCalledTimes(1);
    });

    it('should render a View', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render Text', () => {
        expect(renderedText.type).toBe(Text);
        expect(renderedText.props.children).toBe(expectedProps.text);
    });
});