import { createSlice } from '@reduxjs/toolkit';

// Each service has: { id, consoleOutput }
const initialState = {
    services: [{"id" : "collective-logs", 
"consoleOutput": "Collective logs for all services\n-------------------------------------------------\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}], // default service for collective logs
    servicesJson: null // moved here from ServerInfoSlice
};

const serverServicesSlice = createSlice({
    name: 'serverServices',
    initialState,
    reducers: {
        addService: (state, action) => {
            state.services.push({
                id: action.payload.id,
                consoleOutput: action.payload.consoleOutput || ""
            });
            // Log a shallow copy to see the real array
            console.log('[ServerServicesSlice] New services state:', [...state.services]);
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
        },
        setServicesJson: (state, action) => {
            state.servicesJson = action.payload;
        }
    }
});

export const { addService, updateConsoleOutput, removeService, setServicesJson } = serverServicesSlice.actions;
export default serverServicesSlice.reducer;
