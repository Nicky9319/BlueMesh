import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProjectPath: '',
  projectName: '',
  isProjectLoaded: false
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
    clearProject: (state) => {
      state.currentProjectPath = '';
      state.projectName = '';
      state.isProjectLoaded = false;
    }
  }
});

export const { setCurrentProjectPath, setProjectName, clearProject } = projectSlice.actions;
export default projectSlice.reducer;
