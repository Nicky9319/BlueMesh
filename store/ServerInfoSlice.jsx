import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProjectPath: '',
  isProjectLoaded: false,
  folderStructure: null,
  isLoadingStructure: false,
  servicesJson: null // Add this line
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProjectPath: (state, action) => {
      state.currentProjectPath = action.payload;
      state.isProjectLoaded = true;
    },
    setFolderStructure: (state, action) => {
      state.folderStructure = action.payload;
    },
    setLoadingStructure: (state, action) => {
      state.isLoadingStructure = action.payload;
    },
    setServicesJson: (state, action) => { // Add this reducer
      // console.log(action.payload);
      state.servicesJson = action.payload;
    },
    clearProject: (state) => {
      state.currentProjectPath = '';
      state.isProjectLoaded = false;
      state.folderStructure = null;
      state.isLoadingStructure = false;
      state.servicesJson = null; // Clear on reset
    }
  }
});

export const { 
  setCurrentProjectPath, 
  setFolderStructure, 
  setLoadingStructure, 
  setServicesJson, // Export this
  clearProject 
} = projectSlice.actions;
export default projectSlice.reducer;
