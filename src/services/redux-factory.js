import React from 'react';
import {bindActionCreators} from 'redux';
import {connect, Provider} from 'react-redux';

import * as ActionCreators from '../action-creators/index';

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(ActionCreators, dispatch)});

const mapStateToProps = (state) => state;

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
