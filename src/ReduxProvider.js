import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import App from './App';

const store = createStore(reducer, applyMiddleware(thunk));

export default class ReduxProvider extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
