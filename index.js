import {Navigation} from 'react-native-navigation';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';

import {loadIcons} from './src/services/icons-factory';
import {getDefaultOptions, getRoot} from './src/services/layout-factory';
import reducer from './src/reducer';
import {initializeFirebase} from './src/services/firebase-service';
import {registerScreens} from './src/screens';
import {tryToLoadCredentials} from './src/services/async-storage-service';
import {setEvents} from './src/action-creators';

/* eslint-disable no-console */
console.disableYellowBox = true;
/* eslint-enable no-console */

const store = createStore(reducer, applyMiddleware(thunk));

registerScreens(store);

Navigation.events().registerAppLaunchedListener(async () => {
    initializeFirebase();
    setEvents()(store.dispatch, store.getState);
    const [isLoggedIn, eventName] = await tryToLoadCredentials(store);

    await loadIcons();

    await Navigation.setDefaultOptions(getDefaultOptions());

    await Navigation.setRoot(getRoot(isLoggedIn, eventName));
});
