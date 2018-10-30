import {AppRegistry} from 'react-native';

import ReduxProvider from '../src/ReduxProvider';

jest.mock('react-native');
jest.mock('../src/ReduxProvider');

describe('index', () => {
    beforeEach(() => {
        require('../index');
    });

    it('should register the component', () => {
        expect(AppRegistry.registerComponent).toHaveBeenCalledTimes(1);
        expect(AppRegistry.registerComponent).toHaveBeenCalledWith('photoapplication', expect.anything());
    });
});