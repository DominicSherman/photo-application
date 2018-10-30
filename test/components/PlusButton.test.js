import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';
import {View} from 'react-native';

import PlusButton from '../../src/components/PlusButton';

describe('PlusButton', () => {
    let expectedProps,

        renderedComponent,
        renderedTouchable,
        renderedIcon;

    const cacheChildren = () => {
        renderedTouchable = renderedComponent.props.children;
        renderedIcon = renderedTouchable.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<PlusButton {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            toggleImageModal: jest.fn()
        };

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render a Touchable', () => {
        expect(renderedTouchable.type).toBe(Touchable);
    });

    it('should render a plus icon', () => {
        expect(renderedIcon.type).toBe(Entypo);
        expect(renderedIcon.props.name).toBe('circle-with-plus');
        expect(renderedIcon.props.size).toBe(60);
    });
});
