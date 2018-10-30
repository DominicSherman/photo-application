import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Chance from 'chance';

import * as ActionCreators from '../src/actions';

const chance = new Chance();

jest.mock('redux');

describe('AppContainer', () => {
    const getMapStateToProps = () => connect.mock.calls[0][0];
    const getMapDispatchToProps = () => connect.mock.calls[0][1];

    beforeAll(() => {
        require('../src/AppContainer');
    });

    it('should call connect', () => {
        expect(connect).toHaveBeenCalledTimes(1);
    });

    it('should mapStateToProps', () => {
        const expectedState = chance.string();
        const actualProps = getMapStateToProps()(expectedState);

        expect(actualProps).toEqual(expectedState);
    });

    it('should mapDispatchToProps', () => {
        const dispatchSpy = jest.fn();
        const actualProps = getMapDispatchToProps()(dispatchSpy);

        expect(actualProps).toEqual({actions: bindActionCreators(ActionCreators)});
    });
});
