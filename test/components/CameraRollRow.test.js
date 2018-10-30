import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';

import CameraRollRow from '../../src/components/CameraRollRow';
import {createRandomImage} from '../model-factory';
import TouchableImage from '../../src/components/TouchableImage';

const chance = new Chance();

jest.mock('react-native-fetch-blob', () => ({
    DocumentDir: () => ({})
}));

describe('CameraRollRow', () => {
    let expectedProps,

        renderedComponent,
        renderedView,
        renderedTouchable,
        renderedIcon,
        renderedTouchableImages;

    const cacheChildren = () => {
        [
            renderedView,
            renderedTouchableImages
        ] = renderedComponent.props.children;
        renderedTouchable = renderedView.props.children;
        renderedIcon = renderedTouchable.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<CameraRollRow {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setSelectedRow: jest.fn()
            },
            images: chance.n(createRandomImage, chance.d6() + 1),
            selectedImages: {
                [chance.string()]: chance.string()
            }
        };

        renderComponent();
    });

    it('should render a root view', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render another view', () => {
        expect(renderedView.type).toBe(View);
    });

    describe('when the row is not selected', () => {
        it('should render a Touchable', () => {
            expect(renderedTouchable.type).toBe(Touchable);

            renderedTouchable.props.onPress();

            expect(expectedProps.actions.setSelectedRow).toHaveBeenCalledTimes(1);
            expect(expectedProps.actions.setSelectedRow).toHaveBeenCalledWith(expectedProps.images, true);
        });

        it('should render an icon to select the row', () => {
            expect(renderedIcon.type).toBe(Entypo);
            expect(renderedIcon.props.color).toBe('green');
            expect(renderedIcon.props.name).toBe('circle-with-plus');
            expect(renderedIcon.props.size).toBe(20);
        });
    });

    describe('when the row is selected', () => {
        beforeEach(() => {
            expectedProps.images.forEach((i) => {
                expectedProps.selectedImages = {
                    ...expectedProps.selectedImages,
                    [`${i.image.filename}`]: chance.string()
                };
            });

            renderComponent();
        });

        it('should render a Touchable', () => {
            expect(renderedTouchable.type).toBe(Touchable);

            renderedTouchable.props.onPress();

            expect(expectedProps.actions.setSelectedRow).toHaveBeenCalledTimes(1);
            expect(expectedProps.actions.setSelectedRow).toHaveBeenCalledWith(expectedProps.images, false);
        });

        it('should render an icon to de-select the row', () => {
            expect(renderedIcon.type).toBe(Entypo);
            expect(renderedIcon.props.color).toBe('red');
            expect(renderedIcon.props.name).toBe('circle-with-minus');
            expect(renderedIcon.props.size).toBe(20);
        });
    });

    it('should render touchable images', () => {
        expectedProps.images.forEach((image, index) => {
            const renderedTouchableImage = renderedTouchableImages[index];

            expect(renderedTouchableImage.type).toBe(TouchableImage);
        });
    });
});
