import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import favoriteReducer from './reducers/favoriteReducer';
import serviceReducer from './reducers/serviceReducer';
import userReducer from './reducers/userReducer';
import orderReducer from './reducers/orderReducer';
import referentialReducer from './reducers/referentialReducer';
import publicationReducer from './reducers/publicationReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  favorite: favoriteReducer,
  service: serviceReducer,
  user: userReducer,
  order: orderReducer,
  referential: referentialReducer,
  publication: publicationReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const middlewares = [thunk];

export const store = createStore(
  persistedReducer,
  {favorite: [], service: []},
  applyMiddleware(...middlewares),
);
export const persistor = persistStore(store);
