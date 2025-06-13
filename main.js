// Imports and modules !!! ---------------------------------------------------------------------------------------------------

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'
import { data } from 'react-router-dom'
const { spawn } = require('child_process');

// Imports and modules END !!! ---------------------------------------------------------------------------------------------------




// Variables and constants !!! ---------------------------------------------------------------------------------------------------

let mainWindow;
let serverProcess = null;
let serverState = 'idle'; // Track server state in main process

// Variables and constants END !!! ---------------------------------------------------------------------------------------------------

// Helper function to serialize dates in folder structure
function serializeFolderStructure(structure) {
  if (!structure) return structure;

  const serialized = {
    ...structure,
    modified: structure.modified ? structure.modified.toISOString() : null
  };

  if (structure.children) {
    serialized.children = structure.children.map(child => serializeFolderStructure(child));
  }

  return serialized;
}

function getCurrentProjectPath() {
  return new Promise((resolve, reject) => {
    ipcMain.once(`project:setProjectPath`, (event, responseData) => {
      resolve(responseData); // Fulfill the promise with data
    });

    mainWindow.webContents.send('project:getProjectPath', "Sample", "Sample Content Work"); // Send request to renderer

  })
}

function getServicesJson() {
  return new Promise((resolve, reject) => {
    ipcMain.once(`services:setServicesJsonFile`, (event, responseData) => {
      resolve(responseData); // Fulfill the promise with data
    });

    mainWindow.webContents.send('services:getServicesJsonFile'); // Send request to renderer
  })
}

function serviceConsoleOutput(serviceId, output) {
  mainWindow.webContents.send('services:updateConsoleOutput', serviceId, output);
  mainWindow.webContents.send('services:updateConsoleOutput', 'collective-logs', output);
  // console.log(`Service ${serviceId} Output:`, output);
};

function spawnService(interpretatorPath, servicePath) {
  const wslPrefix = "\\\\wsl.localhost\\";
  let isInterpreterWSL = interpretatorPath.trim().startsWith(wslPrefix);
  let isServiceWSL = servicePath.trim().startsWith(wslPrefix);

  let wslDistro = "";
  let linuxInterpreterPath = interpretatorPath;
  let linuxServicePath = servicePath;

  if (isInterpreterWSL) {
    // Extract distro and convert interpreter path to Linux style
    const parts = interpretatorPath.trim().slice(wslPrefix.length).split("\\");
    wslDistro = parts.shift();
    linuxInterpreterPath = "/" + parts.join("/");
  }

  if (isServiceWSL) {
    // Convert service path to Linux style (ignore distro)
    const serviceParts = servicePath.trim().slice(wslPrefix.length).split("\\");
    serviceParts.shift();
    linuxServicePath = "/" + serviceParts.join("/");
  }

  if (isInterpreterWSL) {
    // Use WSL to spawn the process
    const args = ['-d', wslDistro, linuxInterpreterPath, '-u', linuxServicePath];
    console.log(`Executing: wsl ${args.join(' ')}`);
    return spawn('wsl', args, { stdio: 'pipe' });
  } else {
    // Use native Windows path
    console.log(`Executing: ${interpretatorPath} -u ${servicePath}`);
    return spawn(interpretatorPath, ['-u', servicePath], { stdio: 'pipe' });
  }
}

function startIndividualServices(service, currentProjectPath) {
  if (service.ServiceLanguage == "Python") {
    const interpretatorPath = path.join(currentProjectPath, ".venv", "bin", "python");
    const servicePath = path.join(currentProjectPath, service.ServiceFolderName, service.ServiceFileName);

    try {
      const serviceProcess = spawnService(interpretatorPath, servicePath);

      serviceProcess.stdout.on('data', (data) => {
        serviceConsoleOutput(service.ServiceName, data.toString());
      });
    } catch (error) {
      console.error(`Error starting service ${service.ServiceName}:`, error);
    }
  }
}

function startAllServices(services, currentProjectPath) {
  services.forEach(service => {
    startIndividualServices(service, currentProjectPath);
  });
}

async function startServer() {
  try {
    const projectPath = await getCurrentProjectPath();
    console.log('Starting server for project:', projectPath);

    const servicesJson = await getServicesJson();
    console.log('Services JSON:', servicesJson);

    startAllServices(servicesJson, projectPath);
    return true;
  } catch (error) {
    console.error('Error starting server:', error);
    return false;
  }

  // Add server start logic here
}

// IPC Handle Section !!! ------------------------------------------------------------------------------------------------------

ipcMain.handle('dialog:openDirectory', async () => {
  console.log('Open Directory Dialog Triggered');
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    console.log('Dialog result:', result);

    // Log selected folder in main process
    if (result && !result.canceled && result.filePaths.length > 0) {
      console.log('MAIN PROCESS - Selected folder:', result.filePaths[0]);
    }

    return result;
  } catch (error) {
    console.error('Dialog error:', error);
    throw error;
  }
});

ipcMain.handle('fs:readFolderStructure', async (event, folderPath, options = {}) => {
  console.log('Reading folder structure for:', folderPath);

  const {
    includeContent = false,
    maxDepth = 10,
    excludeHidden = true,
    excludeNodeModules = true
  } = options;

  async function readDirectory(dirPath, currentDepth = 0) {
    if (currentDepth > maxDepth) return null;

    try {
      const stats = await fs.promises.stat(dirPath);
      if (!stats.isDirectory()) return null;

      const items = await fs.promises.readdir(dirPath);
      const structure = {
        name: path.basename(dirPath),
        path: dirPath,
        type: 'directory',
        size: stats.size,
        modified: stats.mtime,
        children: []
      };

      for (const item of items) {
        // Skip hidden files/folders if excludeHidden is true
        if (excludeHidden && item.startsWith('.')) continue;

        // Skip node_modules if excludeNodeModules is true
        if (excludeNodeModules && item === 'node_modules') continue;

        const itemPath = path.join(dirPath, item);

        try {
          const itemStats = await fs.promises.stat(itemPath);

          if (itemStats.isDirectory()) {
            const subDir = await readDirectory(itemPath, currentDepth + 1);
            if (subDir) structure.children.push(subDir);
          } else {
            const fileInfo = {
              name: item,
              path: itemPath,
              type: 'file',
              extension: path.extname(item),
              size: itemStats.size,
              modified: itemStats.mtime
            };

            // Include file content if requested and file is not too large (< 1MB)
            if (includeContent && itemStats.size < 1024 * 1024) {
              try {
                const content = await fs.promises.readFile(itemPath, 'utf8');
                fileInfo.content = content;
              } catch (readError) {
                // If can't read as text, mark as binary
                fileInfo.isBinary = true;
                console.log(`Could not read content for ${itemPath}:`, readError.message);
              }
            }

            structure.children.push(fileInfo);
          }
        } catch (itemError) {
          console.warn(`Could not access ${itemPath}:`, itemError.message);
        }
      }

      return structure;
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      throw error;
    }
  }

  try {
    const result = await readDirectory(folderPath);
    console.log('Folder structure read successfully');

    // Serialize dates before sending to renderer
    const serializedResult = serializeFolderStructure(result);

    // Send folder structure to renderer to update Redux store
    mainWindow.webContents.send('folderStructure:update', serializedResult);

    return result;
  } catch (error) {
    console.error('Failed to read folder structure:', error);
    throw error;
  }
});

ipcMain.handle('fs:refreshFolderStructure', async (event, folderPath) => {
  console.log('Refreshing folder structure for:', folderPath);

  try {
    // Call the readDirectory function directly with default options
    const {
      includeContent = false,
      maxDepth = 5,
      excludeHidden = true,
      excludeNodeModules = true
    } = {};

    async function readDirectory(dirPath, currentDepth = 0) {
      if (currentDepth > maxDepth) return null;

      try {
        const stats = await fs.promises.stat(dirPath);
        if (!stats.isDirectory()) return null;

        const items = await fs.promises.readdir(dirPath);
        const structure = {
          name: path.basename(dirPath),
          path: dirPath,
          type: 'directory',
          size: stats.size,
          modified: stats.mtime,
          children: []
        };

        for (const item of items) {
          if (excludeHidden && item.startsWith('.')) continue;
          if (excludeNodeModules && item === 'node_modules') continue;

          const itemPath = path.join(dirPath, item);

          try {
            const itemStats = await fs.promises.stat(itemPath);

            if (itemStats.isDirectory()) {
              const subDir = await readDirectory(itemPath, currentDepth + 1);
              if (subDir) structure.children.push(subDir);
            } else {
              const fileInfo = {
                name: item,
                path: itemPath,
                type: 'file',
                extension: path.extname(item),
                size: itemStats.size,
                modified: itemStats.mtime
              };

              structure.children.push(fileInfo);
            }
          } catch (itemError) {
            console.warn(`Could not access ${itemPath}:`, itemError.message);
          }
        }

        return structure;
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        throw error;
      }
    }

    const result = await readDirectory(folderPath);

    // Serialize dates before sending to renderer
    const serializedResult = serializeFolderStructure(result);

    // Send folder structure to renderer to update Redux store
    mainWindow.webContents.send('folderStructure:update', serializedResult);

    return { success: true };
  } catch (error) {
    console.error('Failed to refresh folder structure:', error);
    throw error;
  }
});

// Server management handlers
ipcMain.handle('server:start', async (event, projectPath) => {
  try {
    await startServer();
  }
  catch (error) {
    console.error('[MAIN] Error starting server:', error);
  }
  console.log('[MAIN] Server start requested for:', projectPath);

  try {
    if (serverState !== 'idle') {
      throw new Error('Server is already running or starting');
    }

    serverState = 'loading';

    const success = await startServer();

    if (success) {
      serverState = 'running';
      console.log('[MAIN] Server started successfully');

      // Notify renderer of successful start
      mainWindow.webContents.send('server:started', {
        success: true,
        message: 'Server started successfully',
        projectPath
      });

      return {
        success: true,
        message: 'Server started successfully',
        state: 'running'
      };
    } else {
      serverState = 'idle';
      console.log('[MAIN] Server failed to start');

      // Notify renderer of failure
      mainWindow.webContents.send('server:failed', {
        success: false,
        message: 'Failed to start server',
        error: 'Simulated startup failure'
      });

      return {
        success: false,
        message: 'Failed to start server',
        error: 'Simulated startup failure',
        state: 'idle'
      };
    }
  } catch (error) {
    serverState = 'idle';
    console.error('[MAIN] Server start error:', error);

    mainWindow.webContents.send('server:failed', {
      success: false,
      message: error.message,
      error: error.message
    });

    return {
      success: false,
      message: error.message,
      error: error.message,
      state: 'idle'
    };
  }
});

ipcMain.handle('server:stop', async (event) => {
  console.log('[MAIN] Server stop requested');

  try {
    if (serverState !== 'running') {
      throw new Error('Server is not running');
    }

    // TODO: Add actual server shutdown logic here
    // For now, we'll simulate shutdown
    await new Promise(resolve => setTimeout(resolve, 500));

    serverState = 'idle';
    console.log('[MAIN] Server stopped successfully');

    // Notify renderer of successful stop
    mainWindow.webContents.send('server:stopped', {
      success: true,
      message: 'Server stopped successfully'
    });

    return {
      success: true,
      message: 'Server stopped successfully',
      state: 'idle'
    };
  } catch (error) {
    console.error('[MAIN] Server stop error:', error);

    return {
      success: false,
      message: error.message,
      error: error.message,
      state: serverState
    };
  }
});

ipcMain.handle('server:restart', async (event, projectPath) => {
  console.log('[MAIN] Server restart requested');

  try {
    if (serverState !== 'running') {
      throw new Error('Server is not running');
    }

    serverState = 'loading';
    console.log('[MAIN] Server state changed to: loading (restarting)');

    // TODO: Add actual server restart logic here
    // For now, simulate restart
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = Math.random() > 0.1; // 90% success rate for restart

    if (success) {
      serverState = 'running';
      console.log('[MAIN] Server restarted successfully');

      // Notify renderer of successful restart
      mainWindow.webContents.send('server:restarted', {
        success: true,
        message: 'Server restarted successfully',
        projectPath
      });

      return {
        success: true,
        message: 'Server restarted successfully',
        state: 'running'
      };
    } else {
      serverState = 'idle';
      console.log('[MAIN] Server failed to restart');

      // Notify renderer of failure
      mainWindow.webContents.send('server:failed', {
        success: false,
        message: 'Failed to restart server',
        error: 'Simulated restart failure'
      });

      return {
        success: false,
        message: 'Failed to restart server',
        error: 'Simulated restart failure',
        state: 'idle'
      };
    }
  } catch (error) {
    serverState = 'idle';
    console.error('[MAIN] Server restart error:', error);

    mainWindow.webContents.send('server:failed', {
      success: false,
      message: error.message,
      error: error.message
    });

    return {
      success: false,
      message: error.message,
      error: error.message,
      state: 'idle'
    };
  }
});

ipcMain.handle('server:getStatus', async (event) => {
  console.log('[MAIN] Server status requested:', serverState);
  return {
    state: serverState,
    success: true
  };
});

// Add this IPC handler before the App Section
ipcMain.handle('fs:checkFileExists', async (event, folderPath, fileName) => {
  try {
    const filePath = path.join(folderPath, fileName);
    const exists = await fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
    return exists;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
});

ipcMain.handle('fs:readFile', async (event, folderPath, fileName) => {
  try {
    const filePath = path.join(folderPath, fileName);
    const content = await fs.promises.readFile(filePath, 'utf8');
    // Try to parse as JSON, fallback to string if not JSON
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

// IPC Handle Section END !!! ---------------------------------------------------------------------------------------------------

// App Section !!! -------------------------------------------------------------------------------------

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      contextIsolation: true,
      devTools: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Load the renderer process
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  // Single Instance Check 
  const AppLock = app.requestSingleInstanceLock();
  if (!AppLock) {
    app.exit(0);
  }

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  setTimeout(() => {
    console.log('Triggering server reload event from main process');
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('server:file-reload', { message: 'Initial file reload trigger from main process' });
      console.log('[MAIN] Sent server:file-reload event to renderer.');
    }
  }, 20000);


})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// App Section END !!! -------------------------------------------------------------------------------------
