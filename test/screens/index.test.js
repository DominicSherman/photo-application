import Chance from 'chance';
import {Navigation} from 'react-native-navigation';

import {registerScreens, screens} from '../../src/screens';
import {withRedux} from '../../src/services/redux-factory';

jest.mock('react-native-navigation');
jest.mock('../../src/services/redux-factory');

const chance = new Chance();

describe('screens index', () => {
    let expectedStore;

    beforeEach(() => {
        expectedStore = chance.string();

        registerScreens(expectedStore);
    });

    it('should register each component', () => {
        screens.forEach((screen, index) => {
            expect(Navigation.registerComponent).toHaveBeenCalledWith(screen.route, expect.any(Function));

            Navigation.registerComponent.mock.calls[index][1]();

            expect(withRedux).toHaveBeenCalledWith(screen.component, expectedStore);
        });

        expect(withRedux).toHaveBeenCalledTimes(screens.length);
        expect(Navigation.registerComponent).toHaveBeenCalledTimes(screens.length);
    });
});
