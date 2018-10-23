import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {View} from 'react-native';

import Home from '../../src/screens/Home';

const chance = new Chance();

describe('Home', () => {
    let expectedProps,

        renderedComponent,

        renderedUserWrapper,
        renderedAdminButton,
        renderedPlusButton,
        renderedUploadButton,
        renderedPreviewWrapper,
        renderedLogoutButton,

        renderedUserText,

        renderedPreview;

    const cacheChildren = () => {
        [
            renderedUserWrapper,
            renderedAdminButton,
            renderedPlusButton,
            renderedUploadButton,
            renderedPreviewWrapper,
            renderedLogoutButton

        ] = renderedComponent.props.children;

        renderedUserText = renderedUserWrapper.props.children;

        renderedPreview = renderedPreviewWrapper.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<Home {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                toggleUserModal: jest.fn()
            },
            selectedImages: chance.string(),
            user: {
                email: chance.string(),
                isAdmin: true,
                name: chance.string()
            }
        };

        renderComponent();
    });

    it('should render a root view', () => {
        expect(renderedComponent.type).toBe(View);
    });
});
