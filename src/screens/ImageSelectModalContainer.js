import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as ActionCreators from '../actions';

import ImageSelectModal from './ImageSelectModal';

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(ActionCreators, dispatch)});

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelectModal);
