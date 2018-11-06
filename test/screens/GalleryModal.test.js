import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import Gallery from 'react-native-image-gallery';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {View, SafeAreaView, Text} from 'react-native';

import GalleryModal from '../../src/screens/GalleryModal';
import {createRandomPicture} from '../model-factory';
import {dismissModal} from '../../src/services/navigation-service';

jest.mock('../../src/services/navigation-service');

const chance = new Chance();

describe('GalleryModal', () => {
    let expectedProps,

        renderedInstance,
        renderedComponent,

        renderedHeaderView,
        renderedGallery,

        renderedHeaderText,
        renderedCloseTouchable,

        renderedCloseIcon;

    const cacheChildren = () => {
        [
            renderedHeaderView,
            renderedGallery
        ] = renderedComponent.props.children;

        [
            renderedHeaderText,
            renderedCloseTouchable
        ] = renderedHeaderView.props.children;

        renderedCloseIcon = renderedCloseTouchable.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<GalleryModal {...expectedProps} />);

        renderedInstance = shallowRenderer.getMountedInstance();
        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            componentId: chance.natural(),
            initialPage: chance.natural(),
            pictures: chance.n(createRandomPicture, chance.d6() + 1)
        };

        renderComponent();
    });

    it('should render a root SafeAreaView', () => {
        expect(renderedComponent.type).toBe(SafeAreaView);
    });

    it('should render a header view', () => {
        expect(renderedHeaderView.type).toBe(View);
    });

    it('should render header text', () => {
        expect(renderedHeaderText.type).toBe(Text);
        expect(renderedHeaderText.props.children).toBe(`${expectedProps.initialPage}/${expectedProps.pictures.length}`);
    });

    it('should render a close touchable', () => {
        expect(renderedCloseTouchable.type).toBe(Touchable);

        renderedCloseTouchable.props.onPress();

        expect(dismissModal).toHaveBeenCalledTimes(1);
        expect(dismissModal).toHaveBeenCalledWith(expectedProps.componentId);
    });

    it('should render a close icon', () => {
        expect(renderedCloseIcon.type).toBe(EvilIcons);
        expect(renderedCloseIcon.props.name).toBe('close');
        expect(renderedCloseIcon.props.size).toBe(30);
    });

    it('should render a Gallery', () => {
        expect(renderedGallery.type).toBe(Gallery);
        expect(renderedGallery.props.images).toBe(expectedProps.pictures);
        expect(renderedGallery.props.initialPage).toBe(expectedProps.initialPage);
        expect(renderedGallery.props.pageMargin).toBe(5);

        const data = {
            position: chance.natural()
        };

        renderedGallery.props.onPageScroll(data);

        renderedComponent = renderedInstance.render();
        cacheChildren();

        expect(renderedHeaderText.props.children).toBe(`${data.position + 1}/${expectedProps.pictures.length}`);
    });
});
