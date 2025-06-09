// Imports and modules !!! ---------------------------------------------------------------------------------------------------

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// Imports and modules END !!! ---------------------------------------------------------------------------------------------------




// Variables and constants !!! ---------------------------------------------------------------------------------------------------

let mainWindow;

// Variables and constants END !!! ---------------------------------------------------------------------------------------------------





// IPC Handle Section !!! ------------------------------------------------------------------------------------------------------

ipcMain.handle('dialog:openDirectory', async () => {
  console.log('Open Directory Dialog Triggered');
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    console.log('Dialog result:', result);
    return result;
  } catch (error) {
    console.error('Dialog error:', error);
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
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// App Section END !!! --------------------------------------------------------------------------------
