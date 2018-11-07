import React from 'react';
import {View} from 'react-native';
import Chance from 'chance';
import * as reactRedux from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import {bindActionCreators} from 'redux';

import {withRedux} from '../../src/services/redux-factory';
import * as ActionCreators from '../../src/action-creators/index';

jest.mock('redux');

const chance = new Chance();

describe('redux-factory', () => {
    let connectCallback,
        Component,
        ConnectedComponent,
        WithReduxComponent,
        expectedStore,
        expectedProps,

        renderedComponent;

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<WithReduxComponent {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();
    };

    beforeEach(() => {
        expectedStore = chance.string();
        expectedProps = {
            [chance.string()]: chance.string()
        };

        Component = <View />;
        WithReduxComponent = withRedux(Component, expectedStore);
        ConnectedComponent = <View />;

        connectCallback = jest.fn(() => ConnectedComponent);
        reactRedux.connect.mockReturnValue(connectCallback);

        renderComponent();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should mapStateToProps', () => {
        const mapStateToProps = reactRedux.connect.mock.calls[0][0];
        const expectedState = chance.string();

        const state = mapStateToProps(expectedState);

        expect(state).toBe(expectedState);
    });

    it('should mapDispatchToProps', () => {
        const mapDispatchToProps = reactRedux.connect.mock.calls[0][1];
        const dispatchSpy = jest.fn();
        const expectedActions = {
            [chance.string()]: jest.fn()
        };

        bindActionCreators.mockReturnValue(expectedActions);

        const dispatch = mapDispatchToProps(dispatchSpy);

        expect(dispatch).toEqual({
            actions: expectedActions
        });
        expect(bindActionCreators).toHaveBeenCalledTimes(1);
        expect(bindActionCreators).toHaveBeenCalledWith(ActionCreators, dispatchSpy);
    });

    it('should connect the component', () => {
        expect(reactRedux.connect).toHaveBeenCalledTimes(1);
        expect(connectCallback).toHaveBeenCalledTimes(1);
        expect(connectCallback).toHaveBeenCalledWith(Component);
    });

    it('should render a Provider as the root component', () => {
        expect(renderedComponent.type).toBe(reactRedux.Provider);
        expect(renderedComponent.props.store).toBe(expectedStore);
    });

    it('should render the ConnectedComponent', () => {
        const renderedConnectedComponent = renderedComponent.props.children;

        expect(renderedConnectedComponent.type).toEqual(Component);
        expect(renderedConnectedComponent.props).toEqual(expectedProps);
    });
});
