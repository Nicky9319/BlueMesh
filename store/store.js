import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './ProjectSlice';

const store = configureStore({
  reducer: {
    project: projectReducer
  }
});

export default store;
