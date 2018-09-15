import React from 'react';
import ShallowRenderer from 'react-test-renderer';

import {Home} from '../../src/screens/Home';

describe('Home.js', () => {
    let renderedComponent,

        expectedProps;

    const renderComponent = () => {
        const shallowRenderer = new ShallowRenderer();

        shallowRenderer.render(<Home {...expectedProps}/>);

        const renderedComponent = shallowRenderer.getRenderOutput();
    };

    it('should render a wrapper view', () => {
        expect(renderedComponent.type).toBe(View);
    });
});
