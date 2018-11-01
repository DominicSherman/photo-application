import {AsyncStorage} from 'react-native';
import {Navigation} from 'react-native-navigation';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';

import {loadIcons} from './src/services/icons-factory';
import {getDefaultOptions, getRoot} from './src/services/layout-factory';
import {HOME, LOGIN, MORE} from './src/constants/routes';
import {withRedux} from './src/services/redux-factory';
import App from './src/App';
import More from './src/screens/More';
import reducer from './src/reducer';
import {SET_ADMIN, SET_EMAIL, SET_LOGGED_IN, SET_NAME} from './src/constants/action-types';
import {action} from './src/constants/action';
import {initializeFirebase} from './src/services/firebase-service';
import Login from './src/screens/Login';
import {setUsers} from './src/actions';

console.disableYellowBox = true;
const store = createStore(reducer, applyMiddleware(thunk));

const registerScreens = () => {
    Navigation.registerComponent(HOME, () => withRedux(App, store));
    Navigation.registerComponent(LOGIN, () => withRedux(Login, store));
    Navigation.registerComponent(MORE, () => withRedux(More, store));
};

registerScreens();

const tryToLoadCredentials = () =>
    AsyncStorage.multiGet(['email', 'name', 'isAdmin']).then((data) => {

        const email = data[0][1];
        const name = data[1][1];
        const isAdmin = data[2][1];

        if (email) {
            store.dispatch(action(SET_EMAIL, email));
            store.dispatch(action(SET_LOGGED_IN, true));
        } else {
            return false;
        }

        if (name) {
            store.dispatch(action(SET_NAME, name));
        }

        if (isAdmin === 'true') {
            store.dispatch(action(SET_ADMIN, isAdmin));
        }

        return true;
    });

Navigation.events().registerAppLaunchedListener(async () => {
    initializeFirebase();
    const [creds] = await Promise.all([tryToLoadCredentials(), setUsers()(store.dispatch)]);

    await loadIcons();

    await Navigation.setDefaultOptions(getDefaultOptions());

    Navigation.setRoot(getRoot(creds));
});
