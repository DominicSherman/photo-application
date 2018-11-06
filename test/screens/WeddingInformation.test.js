import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {View} from 'react-native';

import WeddingInformation from '../../src/screens/WeddingInformation';

const chance = new Chance();

describe('WeddingInformation', () => {
    let expectedProps,

        renderedComponent;

    const cacheChildren = () => {};

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<WeddingInformation {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {};

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });
});
