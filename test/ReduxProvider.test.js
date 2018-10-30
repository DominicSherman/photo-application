import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import ReduxProvider from '../src/ReduxProvider';
import AppContainer from '../src/AppContainer';
import reducer from '../src/reducer';

jest.mock('redux');
jest.mock('redux-thunk');
jest.mock('../src/reducer');

const chance = new Chance();

describe('ReduxProvider', () => {
    let expectedStore,
        expectedThunk,

        renderedComponent,
        renderedApp;

    const cacheChildren = () => {
        renderedApp = renderedComponent.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<ReduxProvider />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedStore = chance.string();
        expectedThunk = chance.string();
        createStore.mockReturnValue(expectedStore);
        applyMiddleware.mockReturnValue(expectedThunk);

        renderComponent();
    });

    it('should create the store', () => {
        expect(createStore).toHaveBeenCalledTimes(1);
        expect(createStore).toHaveBeenCalledWith(reducer, expectedThunk);
        expect(applyMiddleware).toHaveBeenCalledTimes(1);
        expect(applyMiddleware).toHaveBeenCalledWith(thunk);
    });

    it('should render a root ', () => {
        expect(renderedComponent.type).toBe(Provider);
        expect(renderedComponent.props.store).toBe(expectedStore);
    });

    it('should render the AppContainer', () => {
        expect(renderedApp.type).toBe(AppContainer);
    });
});
