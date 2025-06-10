import { createSlice } from '@reduxjs/toolkit';

// Define server state constants
export const SERVER_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  RUNNING: 'running'
};

const initialState = {
  status: SERVER_STATES.IDLE,
  startTime: null,
  error: null
};

const serverStateSlice = createSlice({
  name: 'serverState',
  initialState,
  reducers: {
    startServer: (state) => {
      state.status = SERVER_STATES.LOADING;
      state.error = null;
    },
    serverStarted: (state) => {
      state.status = SERVER_STATES.RUNNING;
      state.startTime = Date.now();
    },
    serverFailed: (state, action) => {
      state.status = SERVER_STATES.IDLE;
      state.error = action.payload;
    },
    stopServer: (state) => {
      state.status = SERVER_STATES.IDLE;
      state.startTime = null;
    }
  }
});

// Export actions
export const { 
  startServer, 
  serverStarted, 
  serverFailed, 
  stopServer 
} = serverStateSlice.actions;

// Selectors
export const selectServerStatus = (state) => state.serverState.status;
export const selectServerStartTime = (state) => state.serverState.startTime;
export const selectServerError = (state) => state.serverState.error;

// Export the reducer
export default serverStateSlice.reducer;
