import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import Home from './screens/Home';

const store = createStore(reducer, applyMiddleware(thunk));

export default class ReduxProvider extends Component {
    render() {
        return (
            <Provider store={store}>
                <Home/>
            </Provider>

        );
    }
}