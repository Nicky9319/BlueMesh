import { createSlice } from '@reduxjs/toolkit';

// Each service has: { id, consoleOutput }
const initialState = {
    services: []
};

const serverServicesSlice = createSlice({
    name: 'serverServices',
    initialState,
    reducers: {
        addService: (state, action) => {
            // action.payload: { id, consoleOutput }
            state.services.push({
                id: action.payload.id,
                consoleOutput: action.payload.consoleOutput || ""
            });
        },
        updateConsoleOutput: (state, action) => {
            // action.payload: { id, consoleOutput }
            const service = state.services.find(s => s.id === action.payload.id);
            if (service) {
                service.consoleOutput = action.payload.consoleOutput;
            }
        },
        removeService: (state, action) => {
            // action.payload: id
            state.services = state.services.filter(s => s.id !== action.payload);
        }
    }
});

export const { addService, updateConsoleOutput, removeService } = serverServicesSlice.actions;
export default serverServicesSlice.reducer;
