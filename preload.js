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
      refreshFolderStructure: (folderPath) => ipcRenderer.invoke('fs:refreshFolderStructure', folderPath),
      startWatching: (folderPath) => ipcRenderer.invoke('fs:startWatching', folderPath),
      stopWatching: (folderPath) => ipcRenderer.invoke('fs:stopWatching', folderPath),
      stopAllWatchers: () => ipcRenderer.invoke('fs:stopAllWatchers'),
      onFileSystemChange: (callback) => ipcRenderer.on('fs:changed', callback),
      removeFileSystemListeners: () => ipcRenderer.removeAllListeners('fs:changed'),
      onFolderStructureUpdate: (callback) => ipcRenderer.on('folderStructure:update', callback),
      removeFolderStructureListeners: () => ipcRenderer.removeAllListeners('folderStructure:update'),
      // Server management APIs
      startServer: (projectPath) => ipcRenderer.invoke('server:start', projectPath),
      stopServer: () => ipcRenderer.invoke('server:stop'),
      restartServer: (projectPath) => ipcRenderer.invoke('server:restart', projectPath),
      getServerStatus: () => ipcRenderer.invoke('server:getStatus'),
      onServerStarted: (callback) => ipcRenderer.on('server:started', callback),
      onServerStopped: (callback) => ipcRenderer.on('server:stopped', callback),
      onServerRestarted: (callback) => ipcRenderer.on('server:restarted', callback),
      onServerFailed: (callback) => ipcRenderer.on('server:failed', callback),
      onServerFileReload: (callback) => ipcRenderer.on('server:file-reload', callback),
      removeServerListeners: () => {
        ipcRenderer.removeAllListeners('server:started');
        ipcRenderer.removeAllListeners('server:stopped');
        ipcRenderer.removeAllListeners('server:restarted');
        ipcRenderer.removeAllListeners('server:failed');
      },
      removeServerFileReloadListener: () => ipcRenderer.removeAllListeners('server:file-reload')
    })

    contextBridge.exposeInMainWorld('db', {
      updateAgentEnvVariable: (agentId, envVariable) => dbApi.updateAgentEnvVariable ? dbApi.updateAgentEnvVariable(agentId, envVariable) : Promise.reject('db not loaded'),
      getAgentsInfo: () => dbApi.getAgentsInfo ? dbApi.getAgentsInfo() : Promise.reject('db not loaded'),
      addAgentInfo: (agent) => dbApi.addAgentInfo ? dbApi.addAgentInfo(agent) : Promise.reject('db not loaded'),
      initDb: () => dbApi.initDb ? dbApi.initDb() : Promise.reject('db not loaded'),
    });

    contextBridge.exposeInMainWorld('services', {
      onUpdateServiceConsoleOutput: (callback) => ipcRenderer.on('services:updateConsoleOutput', callback),
      removeUpdateServiceConsoleOutputListener: () => ipcRenderer.removeAllListeners('services:updateConsoleOutput')
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
    refreshFolderStructure: (folderPath) => ipcRenderer.invoke('fs:refreshFolderStructure', folderPath),
    startWatching: (folderPath) => ipcRenderer.invoke('fs:startWatching', folderPath),
    stopWatching: (folderPath) => ipcRenderer.invoke('fs:stopWatching', folderPath),
    stopAllWatchers: () => ipcRenderer.invoke('fs:stopAllWatchers'),
    onFileSystemChange: (callback) => ipcRenderer.on('fs:changed', callback),
    removeFileSystemListeners: () => ipcRenderer.removeAllListeners('fs:changed'),
    onFolderStructureUpdate: (callback) => ipcRenderer.on('folderStructure:update', callback),
    removeFolderStructureListeners: () => ipcRenderer.removeAllListeners('folderStructure:update'),
    // Server management APIs
    startServer: (projectPath) => ipcRenderer.invoke('server:start', projectPath),
    stopServer: () => ipcRenderer.invoke('server:stop'),
    restartServer: (projectPath) => ipcRenderer.invoke('server:restart', projectPath),
    getServerStatus: () => ipcRenderer.invoke('server:getStatus'),
    onServerStarted: (callback) => ipcRenderer.on('server:started', callback),
    onServerStopped: (callback) => ipcRenderer.on('server:stopped', callback),
    onServerRestarted: (callback) => ipcRenderer.on('server:restarted', callback),
    onServerFailed: (callback) => ipcRenderer.on('server:failed', callback),
    onServerFileReload: (callback) => ipcRenderer.on('server:file-reload', callback),
    removeServerListeners: () => {
      ipcRenderer.removeAllListeners('server:started');
      ipcRenderer.removeAllListeners('server:stopped');
      ipcRenderer.removeAllListeners('server:restarted');
      ipcRenderer.removeAllListeners('server:failed');
    },
    removeServerFileReloadListener: () => ipcRenderer.removeAllListeners('server:file-reload')
  }

  window.db = {
    updateAgentEnvVariable: (agentId, envVariable) => dbApi.updateAgentEnvVariable ? dbApi.updateAgentEnvVariable(agentId, envVariable) : Promise.reject('db not loaded'),
    getAgentsInfo: () => dbApi.getAgentsInfo ? dbApi.getAgentsInfo() : Promise.reject('db not loaded'),
    addAgentInfo: (agent) => dbApi.addAgentInfo ? dbApi.addAgentInfo(agent) : Promise.reject('db not loaded'),
    initDb: () => dbApi.initDb ? dbApi.initDb() : Promise.reject('db not loaded'),
  }
}