/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

import rootReducer from './reducers'

import Next from './containers/Next';
import Settings from './containers/Settings';

import { createBottomTabNavigator } from 'react-navigation';

const RootComponent = createBottomTabNavigator({
  Next: {
    screen: Next,
  },
  Settings: {
    screen: Settings,
  },
}, {
  initialRouteName: 'Next',
});

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootComponent />
        </PersistGate>
      </Provider>
    );
  }
}
