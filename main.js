// Imports and modules !!! ---------------------------------------------------------------------------------------------------

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'

// Imports and modules END !!! ---------------------------------------------------------------------------------------------------




// Variables and constants !!! ---------------------------------------------------------------------------------------------------

let mainWindow;
let fileWatchers = new Map(); // Store active watchers

// Variables and constants END !!! ---------------------------------------------------------------------------------------------------





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
    return result;
  } catch (error) {
    console.error('Failed to read folder structure:', error);
    throw error;
  }
});

ipcMain.handle('fs:startWatching', async (event, folderPath) => {
  console.log('Starting file watcher for:', folderPath);
  
  // Stop existing watcher if any
  if (fileWatchers.has(folderPath)) {
    fileWatchers.get(folderPath).close();
    fileWatchers.delete(folderPath);
  }

  try {
    const watcher = fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
      console.log(`File system change detected: ${eventType} - ${filename}`);
      
      // Debounce multiple rapid changes
      clearTimeout(watcher.debounceTimer);
      watcher.debounceTimer = setTimeout(() => {
        mainWindow.webContents.send('fs:changed', {
          eventType,
          filename,
          folderPath
        });
      }, 300); // 300ms debounce
    });

    fileWatchers.set(folderPath, watcher);
    console.log('File watcher started successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to start file watcher:', error);
    throw error;
  }
});

ipcMain.handle('fs:stopWatching', async (event, folderPath) => {
  console.log('Stopping file watcher for:', folderPath);
  
  if (fileWatchers.has(folderPath)) {
    fileWatchers.get(folderPath).close();
    fileWatchers.delete(folderPath);
    console.log('File watcher stopped successfully');
    return { success: true };
  }
  
  return { success: false, message: 'No active watcher found' };
});

ipcMain.handle('fs:stopAllWatchers', async () => {
  console.log('Stopping all file watchers');
  
  for (const [folderPath, watcher] of fileWatchers) {
    watcher.close();
    console.log(`Stopped watcher for: ${folderPath}`);
  }
  
  fileWatchers.clear();
  return { success: true };
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
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  // Clean up file watchers before closing
  for (const watcher of fileWatchers.values()) {
    watcher.close();
  }
  fileWatchers.clear();
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// App Section END !!! --------------------------------------------------------------------------------
