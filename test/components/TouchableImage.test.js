import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import Touchable from 'react-native-platform-touchable';
import {ImageBackground, Text, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import TouchableImage from '../../src/components/TouchableImage';
import {getTimeForDisplay} from '../../src/constants/helper-functions';

const chance = new Chance();

jest.mock('../../src/constants/helper-functions');

describe('TouchableImage', () => {
    let expectedProps,
        expectedTime,

        renderedInstance,
        renderedComponent,
        renderedImageBackground,
        renderedView,
        renderedText,
        renderedIcon;

    const cacheChildren = () => {
        renderedImageBackground = renderedComponent.props.children;
        renderedView = renderedImageBackground.props.children;
        [
            renderedText,
            renderedIcon
        ] = renderedView.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<TouchableImage {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
        renderedInstance = shallowRenderer.getMountedInstance();

        cacheChildren();
    };

    beforeEach(() => {
        expectedTime = chance.string();
        expectedProps = {
            actions: {
                toggleSelected: jest.fn()
            },
            item: {
                image: {
                    filename: chance.string(),
                    playableDuration: chance.natural(),
                    uri: chance.string()
                }
            },
            selected: chance.bool()
        };

        getTimeForDisplay.mockReturnValue(expectedTime);
        renderComponent();
    });

    describe('componentDidMount', () => {
        beforeEach(() => {
            expectedProps.selected = true;
            renderComponent();
            renderedInstance.componentDidMount();
        });

        it('should set selected to the props', () => {
            expect(renderedIcon).toBeDefined();
        });
    });

    describe('componentDidUpdate', () => {
        it('should set selected to the props if they have changed', () => {
            const prevProps = {
                selected: false
            };

            expectedProps.selected = true;
            renderComponent();
            renderedInstance.componentDidUpdate(prevProps);

            expect(renderedIcon).toBeDefined();
        });

        it('should do nothing if the props have not change', () => {
            const prevProps = {
                selected: true
            };

            expectedProps.selected = true;
            renderComponent();
            renderedInstance.componentDidUpdate(prevProps);

            expect(renderedIcon).toBeFalsy();
        });
    });

    describe('handlePress', () => {
        beforeEach(() => {
            renderedInstance.handlePress();
        });

        it('should change selected to true if it is pressed once', () => {
            renderedComponent = renderedInstance.render();
            cacheChildren();

            expect(renderedIcon).toBeDefined();
        });

        it('should call the action to toggle the selected', () => {
            expect(expectedProps.actions.toggleSelected).toHaveBeenCalledTimes(1);
            expect(expectedProps.actions.toggleSelected).toHaveBeenCalledWith(expectedProps.item);
        });
    });

    describe('render', () => {
        it('should render a root Touchable', () => {
            expect(renderedComponent.type).toBe(Touchable);
            expect(renderedComponent.props.onPress).toBe(renderedInstance.handlePress);
        });

        it('should render an imageBackground', () => {
            expect(renderedImageBackground.type).toBe(ImageBackground);
        });

        it('should render a view', () => {
            expect(renderedView.type).toBe(View);
        });

        describe('style', () => {
            it('should use justify content flex-start if not selected', () => {
                expect(renderedView.props.style.justifyContent).toBe('flex-start');
            });

            it('should justify content space-between if selected and playable duration', () => {
                renderedInstance.toggleSelected();
                renderedComponent = renderedInstance.render();
                cacheChildren();

                expect(renderedView.props.style[0].justifyContent).toBe('space-between');
            });

            it('should justify content flex-end if selected and no playable duration', () => {
                expectedProps.item.image.playableDuration = null;
                renderComponent();
                renderedInstance.toggleSelected();
                renderedComponent = renderedInstance.render();
                cacheChildren();

                expect(renderedView.props.style[1].justifyContent).toBe('flex-end');
            });
        });

        it('should render Text if there is a playableDuration', () => {
            expect(renderedText.type).toBe(Text);
        });

        it('should render a selectedCheck mark if it is selected', () => {
            renderedInstance.toggleSelected();
            renderedComponent = renderedInstance.render();
            cacheChildren();

            expect(renderedIcon.type).toBe(EvilIcons);
        });

        it('should render nothing if it is not selected', () => {
            expect(renderedIcon).toBeFalsy();
        });
    });
});
