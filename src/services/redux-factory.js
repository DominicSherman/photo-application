import React from 'react';
import {bindActionCreators} from 'redux';
import {connect, Provider} from 'react-redux';

import * as ActionCreators from '../action-creators/index';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(ActionCreators, dispatch)});

export const withRedux = (Component, store) => class ReduxComponent extends React.Component {
    render() {
        const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

        return (
            <Provider store={store}>
                <ConnectedComponent {...this.props} />
            </Provider>
        );
    }
};
