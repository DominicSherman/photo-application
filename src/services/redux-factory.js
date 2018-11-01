import React from 'react';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';

import reducer from '../reducer';

const store = createStore(reducer, applyMiddleware(thunk));

export const withProvider = (Component) => class ProviderComponent extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Component />
            </Provider>
        );
    }
};
