import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import PhotoGrid from 'react-native-thumbnail-grid';
import {Dimensions, ScrollView, Text, View} from 'react-native';

import Photos from '../../src/screens/Photos';
import {createRandomPicture} from '../model-factory';
import {showModal} from '../../src/services/navigation-service';
import {GALLERY} from '../../src/constants/routes';
import LoadingView from '../../src/screens/LoadingView';

jest.mock('../../src/services/navigation-service');

const chance = new Chance();

describe('Photos', () => {
    let expectedProps,

        renderedInstance,
        renderedComponent,
        renderedPhotosOrText;

    const cacheChildren = () => {
        renderedPhotosOrText = renderedComponent.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<Photos {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setMedia: jest.fn()
            },
            pictures: chance.n(createRandomPicture, chance.d6() + 1)
        };

        renderComponent();
    });

    describe('componentDidMount', () => {
        it('should set the media', () => {
            renderedInstance.componentDidMount();

            expect(expectedProps.actions.setMedia).toHaveBeenCalledTimes(1);
        });
    });

    describe('when pictures is null', () => {
        it('should render LoadingView', () => {
            expectedProps.pictures = null;
            renderComponent();

            expect(renderedComponent.type).toBe(LoadingView);
        });
    });

    describe('when pictures is an empty list', () => {
        beforeEach(() => {
            expectedProps.pictures = [];
            renderComponent();
        });

        it('should render a View', () => {
            expect(renderedComponent.type).toBe(View);
        });

        it('should render Text', () => {
            expect(renderedPhotosOrText.type).toBe(Text);
            expect(renderedPhotosOrText.props.children).toBe('No pictures have been uploaded yet 😕');
        });
    });

    describe('when there are pictures', () => {
        it('should render a root ScrollView', () => {
            expect(renderedComponent.type).toBe(ScrollView);
        });

        it('should render a PhotoGrid', () => {
            expect(renderedPhotosOrText.type).toBe(PhotoGrid);
            expect(renderedPhotosOrText.props.height).toBe(Dimensions.get('window').height);
            expect(renderedPhotosOrText.props.source).toEqual(expectedProps.pictures.map((i) => i.source.uri));

            const proxy = chance.string();
            const index = chance.natural({
                max: expectedProps.pictures.length - 1,
                min: 0
            });
            const uri = expectedProps.pictures[index].source.uri;

            renderedPhotosOrText.props.onPressImage(proxy, uri);

            expect(showModal).toHaveBeenCalledTimes(1);
            expect(showModal).toHaveBeenCalledWith(GALLERY, {
                passProps: {
                    initialPage: index
                }
            });
        });
    });
});
