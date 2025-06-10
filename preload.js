import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const path = require('path')

import { initDb,
  getAgentsInfo,
  addAgentInfo,
  updateAgentEnvVariable} from './db/db.js';

  
// Import the db functions with direct relative path
let dbApi = {initDb, getAgentsInfo, addAgentInfo, updateAgentEnvVariable};



if (process.contextIsolated) {
  try{
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
        on: (channel, func) => ipcRenderer.on(channel, func),
        removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
      }
    })

    contextBridge.exposeInMainWorld('api', {
      openDirectoryDialog: () => ipcRenderer.invoke('dialog:openDirectory'),
      readFolderStructure: (folderPath, options) => ipcRenderer.invoke('fs:readFolderStructure', folderPath, options),
      startWatching: (folderPath) => ipcRenderer.invoke('fs:startWatching', folderPath),
      stopWatching: (folderPath) => ipcRenderer.invoke('fs:stopWatching', folderPath),
      stopAllWatchers: () => ipcRenderer.invoke('fs:stopAllWatchers'),
      onFileSystemChange: (callback) => ipcRenderer.on('fs:changed', callback),
      removeFileSystemListeners: () => ipcRenderer.removeAllListeners('fs:changed')
    })

    contextBridge.exposeInMainWorld('db', {
      updateAgentEnvVariable: (agentId, envVariable) => dbApi.updateAgentEnvVariable ? dbApi.updateAgentEnvVariable(agentId, envVariable) : Promise.reject('db not loaded'),
      getAgentsInfo: () => dbApi.getAgentsInfo ? dbApi.getAgentsInfo() : Promise.reject('db not loaded'),
      addAgentInfo: (agent) => dbApi.addAgentInfo ? dbApi.addAgentInfo(agent) : Promise.reject('db not loaded'),
      initDb: () => dbApi.initDb ? dbApi.initDb() : Promise.reject('db not loaded'),
    });

  }
  catch (error) {
    console.error(error)
  }
}
else{
  window.electron = {
    ...electronAPI,
    ipcRenderer: {
      invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
      on: (channel, func) => ipcRenderer.on(channel, func),
      removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
    }
  }

  window.api = {
    openDirectoryDialog: () => ipcRenderer.invoke('dialog:openDirectory'),
    readFolderStructure: (folderPath, options) => ipcRenderer.invoke('fs:readFolderStructure', folderPath, options),
    startWatching: (folderPath) => ipcRenderer.invoke('fs:startWatching', folderPath),
    stopWatching: (folderPath) => ipcRenderer.invoke('fs:stopWatching', folderPath),
    stopAllWatchers: () => ipcRenderer.invoke('fs:stopAllWatchers'),
    onFileSystemChange: (callback) => ipcRenderer.on('fs:changed', callback),
    removeFileSystemListeners: () => ipcRenderer.removeAllListeners('fs:changed')
  }

  window.db = {
    updateAgentEnvVariable: (agentId, envVariable) => dbApi.updateAgentEnvVariable ? dbApi.updateAgentEnvVariable(agentId, envVariable) : Promise.reject('db not loaded'),
    getAgentsInfo: () => dbApi.getAgentsInfo ? dbApi.getAgentsInfo() : Promise.reject('db not loaded'),
    addAgentInfo: (agent) => dbApi.addAgentInfo ? dbApi.addAgentInfo(agent) : Promise.reject('db not loaded'),
    initDb: () => dbApi.initDb ? dbApi.initDb() : Promise.reject('db not loaded'),
  }
}