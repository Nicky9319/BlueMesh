import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './ProjectInfoSlice';

const store = configureStore({
  reducer: {
    project: projectReducer
  }
});

export default store;
