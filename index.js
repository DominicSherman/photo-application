import {Navigation} from 'react-native-navigation';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';

import {loadIcons} from './src/services/icons-factory';
import {getDefaultOptions, getRoot} from './src/services/layout-factory';
import reducer from './src/reducers/reducer';
import {initializeFirebase} from './src/services/firebase-service';
import {setUsers} from './src/action-creators/index';
import {registerScreens} from './src/screens';
import {tryToLoadCredentials} from './src/services/async-storage-service';

/* eslint-disable no-console */
console.disableYellowBox = true;
/* eslint-enable no-console */

const store = createStore(reducer, applyMiddleware(thunk));

registerScreens(store);

Navigation.events().registerAppLaunchedListener(async () => {
    initializeFirebase();
    setUsers()(store.dispatch, store.getState);
    const creds = await tryToLoadCredentials(store);

    await loadIcons();

    await Navigation.setDefaultOptions(getDefaultOptions());

    Navigation.setRoot(getRoot(creds));
});
