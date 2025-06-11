import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './ServerInfoSlice';
import serverStateReducer from './ServerStateSlice';
import serverServicesReducer from './ServerServicesSlice';

const store = configureStore({
  reducer: {
    project: projectReducer,
    serverState: serverStateReducer,
    serverServices: serverServicesReducer
  }
});

export default store;
