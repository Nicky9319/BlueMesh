import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProjectPath: '',
  isProjectLoaded: false,
  folderStructure: null,
  isLoadingStructure: false
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
    clearProject: (state) => {
      state.currentProjectPath = '';
      state.isProjectLoaded = false;
      state.folderStructure = null;
      state.isLoadingStructure = false;
    }
  }
});

export const { 
  setCurrentProjectPath, 
  setFolderStructure, 
  setLoadingStructure, 
  clearProject 
} = projectSlice.actions;
export default projectSlice.reducer;
