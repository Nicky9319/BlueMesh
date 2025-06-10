import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProjectPath: '',
  projectName: '',
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
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
    setFolderStructure: (state, action) => {
      state.folderStructure = action.payload;
    },
    setLoadingStructure: (state, action) => {
      state.isLoadingStructure = action.payload;
    },
    clearProject: (state) => {
      state.currentProjectPath = '';
      state.projectName = '';
      state.isProjectLoaded = false;
      state.folderStructure = null;
      state.isLoadingStructure = false;
    }
  }
});

export const { 
  setCurrentProjectPath, 
  setProjectName, 
  setFolderStructure, 
  setLoadingStructure, 
  clearProject 
} = projectSlice.actions;
export default projectSlice.reducer;
