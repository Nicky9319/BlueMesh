import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './ServerInfoSlice';
import serverStateReducer from './ServeSlice';

const store = configureStore({
  reducer: {
    project: projectReducer,
    serverState: serverStateReducer,
  }
});

export default store;
