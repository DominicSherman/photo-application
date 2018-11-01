import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers/reducer';
import AppContainer from './AppContainer';

export default class ReduxProvider extends Component {
    render() {
        const store = createStore(reducer, applyMiddleware(thunk));

        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}
