import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import auth from '../features/auth/authSlice';

const rootReducer = combineReducers({
  auth,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export function setupStore(preloadedState?: Partial<ReturnType<typeof rootReducer>>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });
}

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
