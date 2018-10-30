import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {ActivityIndicator, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';

import LoadingView from '../../src/screens/LoadingView';

const chance = new Chance();

describe('LoadingView', () => {
    let expectedProgresses = {},
        expectedTotals = {},
        expectedProgress = 0,
        expectedTotal = 0,
        expectedProps,

        renderedComponent,

        renderedActivityIndicator,
        renderedView,

        renderedUploadingView,
        renderedProgressBar,

        renderedUploadingText;

    const cacheChildrenNumUpload = () => {
        [
            renderedUploadingView,
            renderedProgressBar
        ] = renderedView.props.children;

        renderedUploadingText = renderedUploadingView.props.children;
    };

    const cacheChildren = () => {
        [
            renderedActivityIndicator,
            renderedView
        ] = renderedComponent.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<LoadingView {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        const keys = chance.n(chance.string, chance.d6() + 1);

        keys.forEach((key) => {
            const progressValue = chance.natural();
            const totalValue = chance.natural();

            expectedProgresses = {
                ...expectedProgresses,
                [key]: progressValue
            };
            expectedTotals = {
                ...expectedTotals,
                [key]: totalValue
            };

            expectedProgress = expectedProgress + progressValue;
            expectedTotal = expectedTotal + totalValue;
        });
        expectedProps = {
            numFinished: chance.natural(),
            numToUpload: chance.natural(),
            progresses: expectedProgresses,
            totals: expectedTotals
        };

        renderComponent();
        cacheChildrenNumUpload();
    });

    afterEach(() => {
        expectedProgresses = {};
        expectedTotals = {};
        expectedProgress = 0;
        expectedTotal = 0;
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render an ActivityIndicator', () => {
        expect(renderedActivityIndicator.type).toBe(ActivityIndicator);
        expect(renderedActivityIndicator.props.color).toBe('#678da2');
        expect(renderedActivityIndicator.props.size).toBe('large');
    });

    it('should render a wrapper view', () => {
        expect(renderedView.type).toBe(View);
    });

    it('should render a view for the uploading text', () => {
        expect(renderedUploadingView.type).toBe(View);
    });

    it('should render the uploading text', () => {
        expect(renderedUploadingText.type).toBe(Text);
        expect(renderedUploadingText.props.children).toBe(`Uploading ${expectedProps.numFinished + 1}/${expectedProps.numToUpload}...`);
    });

    it('should render the progress bar', () => {
        expect(renderedProgressBar.type).toBe(Progress.Bar);
    });

    it('should render null when there are not any to upload', () => {
        expectedProps.numToUpload = null;
        renderComponent();

        expect(renderedView).toBeNull();
    });

    it('should render the percentage as 0 when there are no totals', () => {
        expectedProps.totals = {};
        renderComponent();
        cacheChildrenNumUpload();

        expect(renderedProgressBar.props.progress).toBe(0);
    });
});
