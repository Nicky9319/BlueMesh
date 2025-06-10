import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './ServerInfoSlice';
import serverStateReducer from './ServerStateSlice';

const store = configureStore({
  reducer: {
    project: projectReducer,
    serverState: serverStateReducer,
  }
});

export default store;
