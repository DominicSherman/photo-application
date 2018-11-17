import React from 'react';
import Chance from 'chance';
import {SafeAreaView, ScrollView} from 'react-native';
import ShallowRenderer from 'react-test-renderer/shallow';

import Home from '../../src/screens/Home';
import Button from '../../src/components/Button';
import SelectedPreview from '../../src/components/SelectedPreview';
import UploadButton from '../../src/components/UploadButton';
import {showModal} from '../../src/services/navigation-service';
import {IMAGE_MODAL} from '../../src/constants/routes';
import LoadingView from '../../src/screens/LoadingView';

jest.mock('../../src/services/navigation-service');

const chance = new Chance();

describe('Home', () => {
    let expectedProps,

        renderedComponent,

        renderedScrollView,

        renderedUploadButton,
        renderedSelectButton,
        renderedSelectedPreview;

    const cacheChildren = () => {
        renderedScrollView = renderedComponent.props.children;

        [
            renderedUploadButton,
            renderedSelectButton,
            renderedSelectedPreview
        ] = renderedScrollView.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<Home {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setCameraRollRows: jest.fn(),
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
        cacheChildren();
    });

    it('should render a root SafeAreaView', () => {
        expect(renderedComponent.type).toBe(SafeAreaView);
    });

    it('should render a ScrollView', () => {
        expect(renderedScrollView.type).toBe(ScrollView);
    });

    it('should render the UploadButton', () => {
        expect(renderedUploadButton.type).toBe(UploadButton);
        expect(renderedUploadButton.props.actions).toBe(expectedProps.actions);
        expect(renderedUploadButton.props.selectedImages).toBe(expectedProps.selectedImages);
        expect(renderedUploadButton.props.user).toBe(expectedProps.user);
    });

    it('should render the select images button', () => {
        expect(renderedSelectButton.type).toBe(Button);
        expect(renderedSelectButton.props.fontSize).toBe(18);
        expect(renderedSelectButton.props.height).toBe(20);
        expect(renderedSelectButton.props.text).toBe('Select Images');
        expect(renderedSelectButton.props.width).toBe(30);

        renderedSelectButton.props.action();

        expect(showModal).toHaveBeenCalledTimes(1);
        expect(showModal).toHaveBeenCalledWith(IMAGE_MODAL);
    });

    it('should render the SelectedPreview', () => {
        expect(renderedSelectedPreview.type).toBe(SelectedPreview);
        expect(renderedSelectedPreview.props.actions).toBe(expectedProps.actions);
        expect(renderedSelectedPreview.props.selectedImages).toBe(expectedProps.selectedImages);
    });

    it('should return LoadingView if isUploading', () => {
        expectedProps.isUploading = true;
        renderComponent();

        expect(renderedComponent.type).toBe(LoadingView);
    });
});
