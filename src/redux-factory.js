import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as ActionCreators from './actions';

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(ActionCreators, dispatch)});

const mapStateToProps = (state) => state;

export const withRedux = (BaseComponent) => class ReduxComponent extends Component {
    render() {
        const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(BaseComponent);

        return (
            <ConnectedComponent/>
        );
    }
};