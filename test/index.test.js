import ReactNative from 'react-native';

import ReduxProvider from '../src/ReduxProvider';

describe('index', () => {
    let registerSpy;

    beforeEach(() => {
        registerSpy = jest.fn();
        ReactNative.AppRegistry.registerComponent = registerSpy;

        require('../index');
    });

    it('should register the component', () => {
        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy).toHaveBeenCalledWith('photoapplication', expect.anything());

        const registeredComponent = registerSpy.mock.calls[0][1]();

        expect(registeredComponent).toBe(ReduxProvider);
    });
});
