import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {ActivityIndicator, Text, View} from 'react-native';

import LoadingView from '../../src/screens/LoadingView';

const chance = new Chance();

describe('LoadingView', () => {
    let expectedProgresses = {},
        expectedTotals = {},
        expectedProgress = 0,
        expectedTotal = 0,
        expectedProps,

        renderedComponent;

    const cacheChildren = () => {};

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
});
