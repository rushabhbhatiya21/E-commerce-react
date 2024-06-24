import { combineReducers, configureStore } from '@reduxjs/toolkit';
import cartReducer from './feature/cartSlice'

const reducer = combineReducers({
    cart: cartReducer,
  });

const store = configureStore({
    reducer: reducer,
});

export default store;