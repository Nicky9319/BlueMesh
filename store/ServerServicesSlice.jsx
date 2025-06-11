import { createSlice } from '@reduxjs/toolkit';

// Each service has: { id, consoleOutput }
const initialState = {
//     services: [{"id" : "collective-logs", 
// "consoleOutput": `Collective logs for all services
// -------------------------------------------------
// Line 1
// Line 2
// Line 3
// Line 4
// Line 5
// Line 6
// Line 7
// Line 8
// Line 9
// Line 10
// Line 11
// Line 12
// Line 13
// Line 14
// Line 15
// Line 16
// Line 17
// Line 18
// Line 19
// Line 20
// Line 21
// Line 22
// Line 23
// Line 24
// Line 25
// Line 26
// Line 27
// Line 28
// Line 29
// Line 30
// Line 31
// Line 32
// Line 33
// Line 34
// Line 35
// Line 36
// Line 37
// Line 38
// Line 39
// Line 40
// Line 41
// Line 42
// Line 43
// Line 44
// Line 45
// Line 46
// Line 47
// Line 48
// Line 49
// Line 50
// Line 51
// `}], 
services: [{"id" : "collective-logs", 
"consoleOutput": `Collective logs for all services
-------------------------------------------------`}], 
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
