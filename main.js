// Imports and modules !!! ---------------------------------------------------------------------------------------------------

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'
import log from 'electron-log'; // Added electron-log

const kill = require('tree-kill');
const { spawn } = require('child_process');


// Imports and modules END !!! ---------------------------------------------------------------------------------------------------




// Variables and constants !!! ---------------------------------------------------------------------------------------------------

let mainWindow;
let serverProcess = null;
let serverState = 'idle'; // Track server state in main process
console.log(`Initial server state: ${serverState}`);
log.info(`Initial server state: ${serverState}`);

let servicesProcesses = {};

const isDev = process.env.NODE_ENV === 'development';

/** Variables and constants END !!! ---------------------------------------------------------------------------------------------------*/


/** Function for the Desktop Application !!! ---------------------------------------------------------------------------------------------- */
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


// Get Project Path Information
function getCurrentProjectPath() {
  console.log('Requesting current project path from renderer.');
  log.info('Requesting current project path from renderer.');
  return new Promise((resolve, reject) => {
    ipcMain.once(`project:setProjectPath`, (event, responseData) => {
      console.log(`Received project path: ${responseData}`);
      log.info(`Received project path: ${responseData}`);
      resolve(responseData); // Fulfill the promise with data
    });

    mainWindow.webContents.send('project:getProjectPath', "Sample", "Sample Content Work"); // Send request to renderer

  })
}


// Get Service Json File
function getServicesJson() {
  console.log('Requesting services.json from renderer.');
  log.info('Requesting services.json from renderer.');
  return new Promise((resolve, reject) => {
    ipcMain.once(`services:setServicesJsonFile`, (event, responseData) => {
      console.log('Received services.json data.');
      log.info('Received services.json data.');
      resolve(responseData); // Fulfill the promise with data
    });

    mainWindow.webContents.send('services:getServicesJsonFile'); // Send request to renderer
  })
}

// updating the Console output for Service
function serviceConsoleOutput(serviceId, output) {
  mainWindow.webContents.send('services:updateConsoleOutput', serviceId, output);
  mainWindow.webContents.send('services:updateConsoleOutput', 'collective-logs', output);
  // console.log(`Service ${serviceId} Output:`, output); // Example if you also want this in main console
  // log.info(`Service ${serviceId} Output:`, output); // Use log.debug or log.verbose for frequent logs if needed
};


// Start Server Functions
function spawnService(interpretatorPath, servicePath) {
  console.log(`Spawning service: interpreter='${interpretatorPath}', service='${servicePath}'`);
  log.info(`Spawning service: interpreter='${interpretatorPath}', service='${servicePath}'`);
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
    console.log(`Executing via WSL: wsl ${args.join(' ')}`);
    log.info(`Executing via WSL: wsl ${args.join(' ')}`);
    return spawn('wsl', args, { stdio: 'pipe' });
  } else {
    // Use native Windows path
    console.log(`Executing natively: ${interpretatorPath} -u ${servicePath}`);
    log.info(`Executing natively: ${interpretatorPath} -u ${servicePath}`);
    return spawn(interpretatorPath, ['-u', servicePath], { stdio: 'pipe' });
  }
}

function startIndividualServices(service, currentProjectPath) {
  console.log(`Starting individual service: ${service.ServiceName}`);
  log.info(`Starting individual service: ${service.ServiceName}`);
  if (service.ServiceLanguage == "Python") {
    const interpretatorPath = path.join(currentProjectPath, ".venv", "bin", "python");
    const servicePath = path.join(currentProjectPath, service.ServiceFolderName, service.ServiceFileName);
    console.log(`Service: ${service.ServiceName}, Interpreter: ${interpretatorPath}, Path: ${servicePath}`);
    log.info(`Service: ${service.ServiceName}, Interpreter: ${interpretatorPath}, Path: ${servicePath}`);

    try {
      const serviceProcess = spawnService(interpretatorPath, servicePath);
      servicesProcesses[service.ServiceName] = serviceProcess;
      console.log(`Service ${service.ServiceName} process started with PID: ${serviceProcess.pid}`);
      log.info(`Service ${service.ServiceName} process started with PID: ${serviceProcess.pid}`);

      serviceProcess.stdout.on('data', (data) => {
        serviceConsoleOutput(service.ServiceName, data.toString());
      });

      serviceProcess.stderr.on('data', (data) => {
        serviceConsoleOutput(service.ServiceName, data.toString());
      });

      serviceProcess.on('close', (code) => {
        console.log(`Service ${service.ServiceName} process exited with code ${code}`);
        log.info(`Service ${service.ServiceName} process exited with code ${code}`);
      });

      serviceProcess.on('error', (err) => {
        console.error(`Error with service ${service.ServiceName} process:`, err);
        log.error(`Error with service ${service.ServiceName} process:`, err);
      });

    } catch (error) {
      console.error(`Error starting service ${service.ServiceName}:`, error);
      log.error(`Error starting service ${service.ServiceName}:`, error);
    }
  } else {
    console.warn(`Unsupported service language for ${service.ServiceName}: ${service.ServiceLanguage}`);
    log.warn(`Unsupported service language for ${service.ServiceName}: ${service.ServiceLanguage}`);
  }
}

function startAllServices(services, currentProjectPath) {
  console.log('Starting all services.');
  log.info('Starting all services.');
  services.forEach(service => {
    startIndividualServices(service, currentProjectPath);
  });

  console.log('All services start process initiated.');
  log.info('All services start process initiated.');
}

async function startServer() {
  console.log('Attempting to start server...');
  log.info('Attempting to start server...');
  return new Promise(async (resolve) => {
    try {
      const projectPath = await getCurrentProjectPath();
      console.log('Starting server for project:', projectPath);
      log.info('Starting server for project:', projectPath);

      const servicesJson = await getServicesJson();
      console.log('Services JSON for server start:', servicesJson);
      log.info('Services JSON for server start:', servicesJson);

      startAllServices(servicesJson, projectPath);
      console.log('Server services started.');
      log.info('Server services started.');
      resolve(true);
    } catch (error) {
      console.error('Error starting server:', error);
      log.error('Error starting server:', error);
      resolve(false);
    }

  });
  // Add server start logic here
}


// Stopping Server Functions
function stopIndividualService(serviceName) {
  const serviceProcess = servicesProcesses[serviceName];
  if (serviceProcess) {
    console.log(`Stopping service: ${serviceName} with PID: ${serviceProcess.pid}`);
    log.info(`Stopping service: ${serviceName} with PID: ${serviceProcess.pid}`);
    console.log(typeof (serviceProcess.pid));
    log.info(typeof (serviceProcess.pid));
    kill(serviceProcess.pid, 'SIGTERM', (err) => {
      if (err) {
        console.error(`Failed to kill process tree for ${serviceName} (PID: ${serviceProcess.pid}):`, err);
        log.error(`Failed to kill process tree for ${serviceName} (PID: ${serviceProcess.pid}):`, err);
      } else {
        console.log(`Process tree for ${serviceName} (PID: ${serviceProcess.pid}) killed successfully.`);
        log.info(`Process tree for ${serviceName} (PID: ${serviceProcess.pid}) killed successfully.`);
      }
    });
    delete servicesProcesses[serviceName];
  } else {
    console.warn(`Service ${serviceName} not found or already stopped.`);
    log.warn(`Service ${serviceName} not found or already stopped.`);
  }
}

function stopAllServices() {
  console.log('Stopping all services.');
  log.info('Stopping all services.');
  Object.keys(servicesProcesses).forEach(serviceName => {
    console.log(`Stopping service: ${serviceName}`);
    log.info(`Stopping service: ${serviceName}`);
    stopIndividualService(serviceName);
  });
  console.log('All services stop process initiated.');
  log.info('All services stop process initiated.');
}

async function stopServer() {
  console.log('Attempting to stop server...');
  log.info('Attempting to stop server...');
  stopAllServices();
  console.log('Server stopped.');
  log.info('Server stopped.');
}


// Restarting Server Functions
async function restartServer() {
  console.log('Attempting to restart server...');
  log.info('Attempting to restart server...');
  try {
    await stopServer();
    await startServer();
    console.log('Server restarted successfully');
    log.info('Server restarted successfully');
    return true;
  } catch (error) {
    console.error('Error restarting server:', error);
    log.error('Error restarting server:', error);
    return false;
  }
}

// Adding New Service Functions
async function addNewPythonService(serviceInformation) {
  console.log('Starting addNewPythonService with info:', serviceInformation);
  log.info('Starting addNewPythonService with info:', serviceInformation);
  try {
    // 1️⃣ Normalize project root for Windows vs. WSL
    const currentProject = await getCurrentProjectPath();
    const rawPath        = currentProject.trim();
    const wslPrefix      = '\\\\wsl.localhost\\\\';
    let projectBase;
    if (rawPath.startsWith(wslPrefix)) {
      const parts      = rawPath.slice(wslPrefix.length).split('\\');
      const distro     = parts.shift();
      projectBase      = [wslPrefix + distro, ...parts].join('\\');
      console.log(`→ [WSL] using UNC share: ${projectBase}`);
      log.info(`→ [WSL] using UNC share: ${projectBase}`);
    } else {
      projectBase = rawPath;
      console.log(`→ [Win] using native path: ${projectBase}`);
      log.info(`→ [Win] using native path: ${projectBase}`);
    }
    console.log(`Project base path determined: ${projectBase}`);
    log.info(`Project base path determined: ${projectBase}`);

    // 2️⃣ Load template from ServiceTemplate/<lang>/<framework>/HTTP_SERVICE.txt
    const electronRes = isDev ? path.resolve(__dirname, '../..', 'resources') : path.resolve(process.resourcesPath, "app.asar.unpacked","resources");
    console.log(`Resources Path (electronRes): ${electronRes}`);
    log.info(`Resources Path (electronRes): ${electronRes}`);

    // Access ServiceTemplates folder
    const templateRoot = path.join(electronRes, 'ServiceTemplates');
    console.log(`Template Root Path: ${templateRoot}`);
    log.info(`Template Root Path: ${templateRoot}`);
    const templateDir = path.join(templateRoot, serviceInformation.language);
    console.log(`Template Directory for ${serviceInformation.language}: ${templateDir}`);
    log.info(`Template Directory for ${serviceInformation.language}: ${templateDir}`);


    const templatePath = path.join(templateDir, 'HTTP_SERVICE.txt');
    console.log(`Template file path: ${templatePath}`);
    log.info(`Template file path: ${templatePath}`);
    if (!fs.existsSync(templatePath)) {
      console.error(`Template not found at ${templatePath}`);
      log.error(`Template not found at ${templatePath}`);
      throw new Error(`Template not found at ${templatePath}`);
    }
    let content = fs.readFileSync(templatePath, 'utf8');
    console.log(`Template content loaded from ${templatePath}`);
    log.info(`Template content loaded from ${templatePath}`);

    // 3️⃣ Create service directory
    const svcFolderName = `service_${serviceInformation.serviceName}Service`;
    const svcDir        = path.join(projectBase, svcFolderName);
    fs.mkdirSync(svcDir, { recursive: true });
    console.log(`Created service folder: ${svcDir}`);
    log.info(`Created service folder: ${svcDir}`);

    // 4️⃣ Replace HOST block, preserving indent
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_HOST_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_HOST_END>/m,
      (match, indent) => {
        const replacement = [
          `${indent}#<HTTP_SERVER_HOST_START>`,
          `${indent}httpServerHost = "${serviceInformation.host}"`,
          `${indent}#<HTTP_SERVER_HOST_END>`
        ].join('\n');
        console.log(`Replacing HOST block with: ${serviceInformation.host}`);
        log.info(`Replacing HOST block with: ${serviceInformation.host}`);
        return replacement;
      }
    );

    // 5️⃣ Replace PORT block
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_PORT_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_PORT_END>/m,
      (match, indent) => {
        const replacement = [
          `${indent}#<HTTP_SERVER_PORT_START>`,
          `${indent}httpServerPort = ${serviceInformation.port}`,
          `${indent}#<HTTP_SERVER_PORT_END>`
        ].join('\n');
        console.log(`Replacing PORT block with: ${serviceInformation.port}`);
        log.info(`Replacing PORT block with: ${serviceInformation.port}`);
        return replacement;
      }
    );

    // 6️⃣ Replace PRIVILEGED IPS block
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_END>/m,
      (match, indent) => {
        const ips = serviceInformation.privilegeIps
          .map(ip => `"${ip}"`)
          .join(', ');
        const replacement = [
          `${indent}#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_START>`,
          `${indent}httpServerPrivilegedIpAddress = [${ips}]`,
          `${indent}#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_END>`
        ].join('\n');
        console.log(`Replacing PRIVILEGED IPS block with: [${ips}]`);
        log.info(`Replacing PRIVILEGED IPS block with: [${ips}]`);
        return replacement;
      }
    );

    // 7️⃣ Replace CORS block
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_CORS_ADDITION_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_CORS_ADDITION_END>/m,
      (match, indent) => {
        const line = `self.app.add_middleware(CORSMiddleware, allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)`;
        const body = serviceInformation.cors
          ? `${indent}${line}`
          : `${indent}# ${line}`;
        const replacement = [
          `${indent}#<HTTP_SERVER_CORS_ADDITION_START>`,
          body,
          `${indent}#<HTTP_SERVER_CORS_ADDITION_END>`
        ].join('\n');
        console.log(`Replacing CORS block. CORS enabled: ${serviceInformation.cors}`);
        log.info(`Replacing CORS block. CORS enabled: ${serviceInformation.cors}`);
        return replacement;
      }
    );

    // 8️⃣ Write service file
    const svcFileName = `${serviceInformation.serviceName.toLowerCase()}-service.py`;
    const svcFilePath = path.join(svcDir, svcFileName);
    fs.writeFileSync(svcFilePath, content, 'utf8');
    console.log(`Wrote service file: ${svcFilePath}`);
    log.info(`Wrote service file: ${svcFilePath}`);

    // 9️⃣ Update services.json
    const servicesJsonPath = path.join(projectBase, 'services.json');
    let services = [];
    if (fs.existsSync(servicesJsonPath)) {
      console.log(`Reading existing services.json from ${servicesJsonPath}`);
      log.info(`Reading existing services.json from ${servicesJsonPath}`);
      services = JSON.parse(fs.readFileSync(servicesJsonPath, 'utf8'));
    } else {
      console.log(`services.json not found at ${servicesJsonPath}, creating new.`);
      log.info(`services.json not found at ${servicesJsonPath}, creating new.`);
    }
    const newServiceEntry = {
      ServiceLanguage:              "Python",
      ServiceFramework:              serviceInformation.framework,
      ServiceName:                   serviceInformation.serviceName,
      ServiceFolderName:             svcFolderName,
      ServiceFileName:               svcFileName,
      ServiceHttpHost:               serviceInformation.host,
      ServiceHttpPrivilegedIpAddress:serviceInformation.privilegeIps,
      ServiceHttpPort:               serviceInformation.port,
      ServiceType:                   "HTTP_SERVICE"
    };
    services.push(newServiceEntry);
    console.log('Added new service entry to services array:', newServiceEntry);
    log.info('Added new service entry to services array:', newServiceEntry);
    fs.writeFileSync(
      servicesJsonPath,
      JSON.stringify(services, null, 2),
      'utf8'
    );
    console.log(`Updated services.json at ${servicesJsonPath}`);
    log.info(`Updated services.json at ${servicesJsonPath}`);

    // 🔟 Update .env
    const envPath = path.join(projectBase, '.env');
    let envContent = fs.existsSync(envPath)
      ? fs.readFileSync(envPath, 'utf8')
      : '';
    if (fs.existsSync(envPath)) {
        console.log(`Reading existing .env file from ${envPath}`);
        log.info(`Reading existing .env file from ${envPath}`);
    } else {
        console.log(`.env file not found at ${envPath}, will create or use empty content.`);
        log.info(`.env file not found at ${envPath}, will create or use empty content.`);
    }
    const varName = `${serviceInformation.serviceName.toUpperCase()}_SERVICE`;
    const varLine = `${varName}="${serviceInformation.host}:${serviceInformation.port}"`;
    envContent = envContent
      .replace(
        /#<ADD_DEVELOPMENT_SERVICES_ENVRIONMENT_VARIABLES>/,
        match => `${match}\n${varLine}`
      )
      .replace(
        /#<ADD_PRODUCTION_SERVICES_ENVRIONMENT_VARIABLES>/,
        match => `${match}\n# ${varLine}`
      );
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`Updated .env at ${envPath} with variable: ${varLine}`);
    log.info(`Updated .env at ${envPath} with variable: ${varLine}`);

    console.log('✅ Python service added successfully!');
    log.info('✅ Python service added successfully!');
    
    return true;
  } catch (err) {
    console.error('Error in addNewPythonService:', err);
    log.error('Error in addNewPythonService:', err);
    return false;
  }
}

/** Function for the Desktop Application END !!! ---------------------------------------------------------------------------------------------- */

// IPC Handle Section !!! ------------------------------------------------------------------------------------------------------

ipcMain.handle('dialog:openDirectory', async () => {
  console.log('IPC: dialog:openDirectory - Open Directory Dialog Triggered');
  log.info('IPC: dialog:openDirectory - Open Directory Dialog Triggered');
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    console.log('IPC: dialog:openDirectory - Dialog result:', result);
    log.info('IPC: dialog:openDirectory - Dialog result:', result);

    // Log selected folder in main process
    if (result && !result.canceled && result.filePaths.length > 0) {
      console.log('IPC: dialog:openDirectory - Selected folder:', result.filePaths[0]);
      log.info('IPC: dialog:openDirectory - Selected folder:', result.filePaths[0]);
    }

    return result;
  } catch (error) {
    console.error('IPC: dialog:openDirectory - Dialog error:', error);
    log.error('IPC: dialog:openDirectory - Dialog error:', error);
    throw error;
  }
});

ipcMain.handle('fs:readFolderStructure', async (event, folderPath, options = {}) => {
  console.log('IPC: fs:readFolderStructure - Reading folder structure for:', folderPath, 'with options:', options);
  log.info('IPC: fs:readFolderStructure - Reading folder structure for:', folderPath, 'with options:', options);

  const {
    includeContent = false,
    maxDepth = 10,
    excludeHidden = true,
    excludeNodeModules = true
  } = options;

  async function readDirectory(dirPath, currentDepth = 0) {
    if (currentDepth > maxDepth) {
      console.warn(`Max depth ${maxDepth} reached for ${dirPath}`);
      log.warn(`Max depth ${maxDepth} reached for ${dirPath}`);
      return null;
    }

    try {
      const stats = await fs.promises.stat(dirPath);
      if (!stats.isDirectory()) {
        console.warn(`${dirPath} is not a directory.`);
        log.warn(`${dirPath} is not a directory.`);
        return null;
      }

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
        if (excludeHidden && item.startsWith('.')) {
          // console.debug(`Skipping hidden item: ${item}`);
          // log.debug(`Skipping hidden item: ${item}`);
          continue;
        }

        // Skip node_modules if excludeNodeModules is true
        if (excludeNodeModules && item === 'node_modules') {
          // console.debug(`Skipping node_modules: ${item}`);
          // log.debug(`Skipping node_modules: ${item}`);
          continue;
        }

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
                console.warn(`Could not read content for ${itemPath} as text:`, readError.message);
                log.warn(`Could not read content for ${itemPath} as text:`, readError.message);
              }
            }

            structure.children.push(fileInfo);
          }
        } catch (itemError) {
          console.warn(`Could not access ${itemPath}:`, itemError.message);
          log.warn(`Could not access ${itemPath}:`, itemError.message);
        }
      }

      return structure;
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      log.error(`Error reading directory ${dirPath}:`, error);
      throw error;
    }
  }

  try {
    const result = await readDirectory(folderPath);
    console.log('IPC: fs:readFolderStructure - Folder structure read successfully for:', folderPath);
    log.info('IPC: fs:readFolderStructure - Folder structure read successfully for:', folderPath);

    // Serialize dates before sending to renderer
    const serializedResult = serializeFolderStructure(result);

    // Send folder structure to renderer to update Redux store
    mainWindow.webContents.send('folderStructure:update', serializedResult);
    console.log('IPC: fs:readFolderStructure - Sent folderStructure:update to renderer.');
    log.info('IPC: fs:readFolderStructure - Sent folderStructure:update to renderer.');

    return result;
  } catch (error) {
    console.error('IPC: fs:readFolderStructure - Failed to read folder structure for:', folderPath, error);
    log.error('IPC: fs:readFolderStructure - Failed to read folder structure for:', folderPath, error);
    throw error;
  }
});

ipcMain.handle('fs:refreshFolderStructure', async (event, folderPath) => {
  console.log('IPC: fs:refreshFolderStructure - Refreshing folder structure for:', folderPath);
  log.info('IPC: fs:refreshFolderStructure - Refreshing folder structure for:', folderPath);

  try {
    // Call the readDirectory function directly with default options
    const {
      includeContent = false,
      maxDepth = 5,
      excludeHidden = true,
      excludeNodeModules = true
    } = {};

    async function readDirectory(dirPath, currentDepth = 0) {
      if (currentDepth > maxDepth) {
        console.warn(`Refresh: Max depth ${maxDepth} reached for ${dirPath}`);
        log.warn(`Refresh: Max depth ${maxDepth} reached for ${dirPath}`);
        return null;
      }

      try {
        const stats = await fs.promises.stat(dirPath);
        if (!stats.isDirectory()) {
          console.warn(`Refresh: ${dirPath} is not a directory.`);
          log.warn(`Refresh: ${dirPath} is not a directory.`);
          return null;
        }

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
            console.warn(`Refresh: Could not access ${itemPath}:`, itemError.message);
            log.warn(`Refresh: Could not access ${itemPath}:`, itemError.message);
          }
        }

        return structure;
      } catch (error) {
        console.error(`Refresh: Error reading directory ${dirPath}:`, error);
        log.error(`Refresh: Error reading directory ${dirPath}:`, error);
        throw error;
      }
    }

    const result = await readDirectory(folderPath);
    console.log('IPC: fs:refreshFolderStructure - Folder structure refreshed successfully for:', folderPath);
    log.info('IPC: fs:refreshFolderStructure - Folder structure refreshed successfully for:', folderPath);

    // Serialize dates before sending to renderer
    const serializedResult = serializeFolderStructure(result);

    // Send folder structure to renderer to update Redux store
    mainWindow.webContents.send('folderStructure:update', serializedResult);
    console.log('IPC: fs:refreshFolderStructure - Sent folderStructure:update to renderer.');
    log.info('IPC: fs:refreshFolderStructure - Sent folderStructure:update to renderer.');

    return { success: true };
  } catch (error) {
    console.error('IPC: fs:refreshFolderStructure - Failed to refresh folder structure for:', folderPath, error);
    log.error('IPC: fs:refreshFolderStructure - Failed to refresh folder structure for:', folderPath, error);
    throw error;
  }
});

ipcMain.handle('project:getServicesJson', async (event) => {
  console.log('IPC: project:getServicesJson - Request received.');
  log.info('IPC: project:getServicesJson - Request received.');
  const projectPath = await getCurrentProjectPath();
  const servicesJsonPath = path.join(projectPath, 'services.json');
  console.log(`IPC: project:getServicesJson - Reading services.json from: ${servicesJsonPath}`);
  log.info(`IPC: project:getServicesJson - Reading services.json from: ${servicesJsonPath}`);

  try {
    const services = JSON.parse(fs.readFileSync(servicesJsonPath, 'utf8'));
    console.log('IPC: project:getServicesJson - Services JSON read successfully:', services);
    log.info('IPC: project:getServicesJson - Services JSON read successfully:', services);
    return { success: true, services };
  } catch (error) {
    console.error('IPC: project:getServicesJson - Failed to read services.json:', error);
    log.error('IPC: project:getServicesJson - Failed to read services.json:', error);
    return { success: false, error: error.message };
  }
});

// Server management handlers
ipcMain.handle('server:start', async (event, projectPath) => {
  console.log(`[MAIN IPC] server:start - Server start requested for: ${projectPath}. Current state: ${serverState}`);
  log.info(`[MAIN IPC] server:start - Server start requested for: ${projectPath}. Current state: ${serverState}`);

  try {
    if (serverState !== 'idle') {
      console.warn(`[MAIN IPC] server:start - Server is already ${serverState}. Request denied.`);
      log.warn(`[MAIN IPC] server:start - Server is already ${serverState}. Request denied.`);
      throw new Error(`Server is already ${serverState}`);
    }

    serverState = 'loading';
    console.log(`[MAIN IPC] server:start - Server state changed to: ${serverState}`);
    log.info(`[MAIN IPC] server:start - Server state changed to: ${serverState}`);
    mainWindow.webContents.send('server:stateChanged', { state: serverState });


    const success = await startServer();

    if (success) {
      serverState = 'running';
      console.log(`[MAIN IPC] server:start - Server started successfully. State changed to: ${serverState}`);
      log.info(`[MAIN IPC] server:start - Server started successfully. State changed to: ${serverState}`);

      // Notify renderer of successful start
      mainWindow.webContents.send('server:started', {
        success: true,
        message: 'Server started successfully',
        projectPath
      });
      mainWindow.webContents.send('server:stateChanged', { state: serverState });


      return {
        success: true,
        message: 'Server started successfully',
        state: 'running'
      };
    } else {
      serverState = 'idle';
      console.error(`[MAIN IPC] server:start - Server failed to start. State changed to: ${serverState}`);
      log.error(`[MAIN IPC] server:start - Server failed to start. State changed to: ${serverState}`);

      // Notify renderer of failure
      mainWindow.webContents.send('server:failed', {
        success: false,
        message: 'Failed to start server',
        error: 'Server startup process reported failure'
      });
      mainWindow.webContents.send('server:stateChanged', { state: serverState });


      return {
        success: false,
        message: 'Failed to start server',
        error: 'Server startup process reported failure',
        state: 'idle'
      };
    }
  } catch (error) {
    const oldState = serverState;
    serverState = 'idle';
    console.error(`[MAIN IPC] server:start - Server start error. State changed from ${oldState} to: ${serverState}`, error);
    log.error(`[MAIN IPC] server:start - Server start error. State changed from ${oldState} to: ${serverState}`, error);

    mainWindow.webContents.send('server:failed', {
      success: false,
      message: error.message,
      error: error.message
    });
    mainWindow.webContents.send('server:stateChanged', { state: serverState });


    return {
      success: false,
      message: error.message,
      error: error.message,
      state: 'idle'
    };
  }
});

ipcMain.handle('server:stop', async (event) => {
  console.log(`[MAIN IPC] server:stop - Server stop requested. Current state: ${serverState}`);
  log.info(`[MAIN IPC] server:stop - Server stop requested. Current state: ${serverState}`);

  try {
    if (serverState !== 'running') {
      console.warn(`[MAIN IPC] server:stop - Server is not running (${serverState}). Request denied.`);
      log.warn(`[MAIN IPC] server:stop - Server is not running (${serverState}). Request denied.`);
      throw new Error('Server is not running');
    }
    const oldState = serverState;
    serverState = 'loading'; // Indicate stopping process
    console.log(`[MAIN IPC] server:stop - Server state changed from ${oldState} to: ${serverState} (stopping)`);
    log.info(`[MAIN IPC] server:stop - Server state changed from ${oldState} to: ${serverState} (stopping)`);
    mainWindow.webContents.send('server:stateChanged', { state: serverState });

    await stopServer();

    serverState = 'idle';
    console.log(`[MAIN IPC] server:stop - Server stopped successfully. State changed to: ${serverState}`);
    log.info(`[MAIN IPC] server:stop - Server stopped successfully. State changed to: ${serverState}`);

    // Notify renderer of successful stop
    mainWindow.webContents.send('server:stopped', {
      success: true,
      message: 'Server stopped successfully'
    });
    mainWindow.webContents.send('server:stateChanged', { state: serverState });


    return {
      success: true,
      message: 'Server stopped successfully',
      state: 'idle'
    };
  } catch (error) {
    console.error(`[MAIN IPC] server:stop - Server stop error. Current state: ${serverState}`, error);
    log.error(`[MAIN IPC] server:stop - Server stop error. Current state: ${serverState}`, error);
    // Potentially revert state if stop failed critically, or keep as 'loading' if uncertain
    // For now, we assume if an error occurs, it might not be fully stopped or in a clean idle state.
    // However, the primary goal is to stop, so if an error occurs, it's likely still not 'running'.
    // Let's assume it goes to 'idle' but with an error.
    const oldState = serverState;
    serverState = 'idle'; // Or a specific 'error_stopping' state if needed
    console.log(`[MAIN IPC] server:stop - Server state changed from ${oldState} to: ${serverState} due to error.`);
    log.info(`[MAIN IPC] server:stop - Server state changed from ${oldState} to: ${serverState} due to error.`);
    mainWindow.webContents.send('server:stateChanged', { state: serverState });


    return {
      success: false,
      message: error.message,
      error: error.message,
      state: serverState // Reflects the state after the attempted stop
    };
  }
});

ipcMain.handle('server:restart', async (event, projectPath) => {
  console.log(`[MAIN IPC] server:restart - Server restart requested. Current state: ${serverState}`);
  log.info(`[MAIN IPC] server:restart - Server restart requested. Current state: ${serverState}`);

  try {
    if (serverState !== 'running') {
      console.warn(`[MAIN IPC] server:restart - Server is not running (${serverState}). Cannot restart.`);
      log.warn(`[MAIN IPC] server:restart - Server is not running (${serverState}). Cannot restart.`);
      throw new Error('Server is not running');
    }

    const oldState = serverState;
    serverState = 'loading';
    console.log(`[MAIN IPC] server:restart - Server state changed from ${oldState} to: ${serverState} (restarting)`);
    log.info(`[MAIN IPC] server:restart - Server state changed from ${oldState} to: ${serverState} (restarting)`);
    mainWindow.webContents.send('server:stateChanged', { state: serverState });


    const success = await restartServer();

    if (success) {
      serverState = 'running';
      console.log(`[MAIN IPC] server:restart - Server restarted successfully. State changed to: ${serverState}`);
      log.info(`[MAIN IPC] server:restart - Server restarted successfully. State changed to: ${serverState}`);

      // Notify renderer of successful restart
      mainWindow.webContents.send('server:restarted', {
        success: true,
        message: 'Server restarted successfully',
        projectPath
      });
      mainWindow.webContents.send('server:stateChanged', { state: serverState });


      return {
        success: true,
        message: 'Server restarted successfully',
        state: 'running'
      };
    } else {
      serverState = 'idle';
      console.error(`[MAIN IPC] server:restart - Server failed to restart. State changed to: ${serverState}`);
      log.error(`[MAIN IPC] server:restart - Server failed to restart. State changed to: ${serverState}`);

      // Notify renderer of failure
      mainWindow.webContents.send('server:failed', {
        success: false,
        message: 'Failed to restart server',
        error: 'Simulated restart failure' // Or actual error from restartServer()
      });
      mainWindow.webContents.send('server:stateChanged', { state: serverState });


      return {
        success: false,
        message: 'Failed to restart server',
        error: 'Simulated restart failure', // Or actual error
        state: 'idle'
      };
    }
  } catch (error) {
    const oldState = serverState;
    serverState = 'idle';
    console.error(`[MAIN IPC] server:restart - Server restart error. State changed from ${oldState} to: ${serverState}`, error);
    log.error(`[MAIN IPC] server:restart - Server restart error. State changed from ${oldState} to: ${serverState}`, error);

    mainWindow.webContents.send('server:failed', {
      success: false,
      message: error.message,
      error: error.message
    });
    mainWindow.webContents.send('server:stateChanged', { state: serverState });


    return {
      success: false,
      message: error.message,
      error: error.message,
      state: 'idle'
    };
  }
});

ipcMain.handle('server:getStatus', async (event) => {
  console.log(`[MAIN IPC] server:getStatus - Server status requested. Current state: ${serverState}`);
  log.info(`[MAIN IPC] server:getStatus - Server status requested. Current state: ${serverState}`);
  return {
    state: serverState,
    success: true
  };
});

// Service management handlers
ipcMain.handle('service:addService', async (event, serviceInfo) => {
  console.log('IPC: service:addService - Request received with service info:', serviceInfo);
  log.info('IPC: service:addService - Request received with service info:', serviceInfo);
  if (serviceInfo.language === "python") {
    if (serviceInfo.framework == "fastapi") {
      try {
        console.log('IPC: service:addService - Calling addNewPythonService for FastAPI.');
        log.info('IPC: service:addService - Calling addNewPythonService for FastAPI.');
        let success = await addNewPythonService(serviceInfo)
        if (success == true) {
          console.log('IPC: service:addService - Python FastAPI service added successfully.');
          log.info('IPC: service:addService - Python FastAPI service added successfully.');
          mainWindow.webContents.send('service:newServiceAdded', serviceInfo); 
          return {
            "status": "success",
            "message": "Python service added successfully"
          }
        }
        else {
          console.error('IPC: service:addService - addNewPythonService returned false.');
          log.error('IPC: service:addService - addNewPythonService returned false.');
          return {
            "status": "error",
            "message": "Failed to add Python FastAPI service (addNewPythonService failed)."
          }
        }
      } catch (error) {
        console.error('IPC: service:addService - Error adding Python FastAPI service:', error);
        log.error('IPC: service:addService - Error adding Python FastAPI service:', error);
        return {
          "status": "error",
          "message": `Failed to add Python service: ${error.message}`
        }
      }

    }
    else {
      console.warn(`IPC: service:addService - Unsupported Python framework: ${serviceInfo.framework}`);
      log.warn(`IPC: service:addService - Unsupported Python framework: ${serviceInfo.framework}`);
      return {
        "status": "error",
        "message": "Currently only FastAPI Python Framework Services are supported"
      }
    }
  }
  else {
    console.warn(`IPC: service:addService - Unsupported language: ${serviceInfo.language}`);
    log.warn(`IPC: service:addService - Unsupported language: ${serviceInfo.language}`);
    return {
      "status": "error",
      "message": "Currently only Dealing with Python Language Services" // Message implies only Python, but code checks FastAPI
    }
  }
});

// Add this IPC handler before the App Section
ipcMain.handle('fs:checkFileExists', async (event, folderPath, fileName) => {
  console.log(`IPC: fs:checkFileExists - Checking if file '${fileName}' exists in folder '${folderPath}'`);
  log.info(`IPC: fs:checkFileExists - Checking if file '${fileName}' exists in folder '${folderPath}'`);
  try {
    const filePath = path.join(folderPath, fileName);
    const exists = await fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
    console.log(`IPC: fs:checkFileExists - File '${filePath}' exists: ${exists}`);
    log.info(`IPC: fs:checkFileExists - File '${filePath}' exists: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`IPC: fs:checkFileExists - Error checking file existence for '${path.join(folderPath, fileName)}':`, error);
    log.error(`IPC: fs:checkFileExists - Error checking file existence for '${path.join(folderPath, fileName)}':`, error);
    return false;
  }
});

ipcMain.handle('fs:readFile', async (event, folderPath, fileName) => {
  console.log(`IPC: fs:readFile - Reading file '${fileName}' from folder '${folderPath}'`);
  log.info(`IPC: fs:readFile - Reading file '${fileName}' from folder '${folderPath}'`);
  try {
    const filePath = path.join(folderPath, fileName);
    const content = await fs.promises.readFile(filePath, 'utf8');
    console.log(`IPC: fs:readFile - Successfully read file '${filePath}'. Attempting to parse as JSON.`);
    log.info(`IPC: fs:readFile - Successfully read file '${filePath}'. Attempting to parse as JSON.`);
    // Try to parse as JSON, fallback to string if not JSON
    try {
      const jsonData = JSON.parse(content);
      console.log(`IPC: fs:readFile - Parsed content of '${filePath}' as JSON.`);
      log.info(`IPC: fs:readFile - Parsed content of '${filePath}' as JSON.`);
      return jsonData;
    } catch {
      console.log(`IPC: fs:readFile - Content of '${filePath}' is not JSON, returning as string.`);
      log.info(`IPC: fs:readFile - Content of '${filePath}' is not JSON, returning as string.`);
      return content;
    }
  } catch (error) {
    console.error(`IPC: fs:readFile - Error reading file '${path.join(folderPath, fileName)}':`, error);
    log.error(`IPC: fs:readFile - Error reading file '${path.join(folderPath, fileName)}':`, error);
    throw error;
  }
});

// IPC Handle Section END !!! ---------------------------------------------------------------------------------------------------

// App Section !!! -------------------------------------------------------------------------------------

function createWindow() {
  console.log('Creating main window.');
  log.info('Creating main window.');
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
    console.log('Main window ready to show.');
    log.info('Main window ready to show.');
    mainWindow.show()
  })

  // Load the renderer process
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log(`Loading renderer URL: ${process.env['ELECTRON_RENDERER_URL']}`);
    log.info(`Loading renderer URL: ${process.env['ELECTRON_RENDERER_URL']}`);
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    const rendererPath = join(__dirname, '../renderer/index.html');
    console.log(`Loading renderer file: ${rendererPath}`);
    log.info(`Loading renderer file: ${rendererPath}`);
    mainWindow.loadFile(rendererPath)
  }

  mainWindow.setMenuBarVisibility(false);
  console.log('Menu bar visibility set to false.');
  log.info('Menu bar visibility set to false.');
}

app.whenReady().then(() => {
  console.log('App is ready.');
  log.info('App is ready.');
  // Single Instance Check 
  const AppLock = app.requestSingleInstanceLock();
  if (!AppLock) {
    console.warn('Another instance is already running. Exiting this instance.');
    log.warn('Another instance is already running. Exiting this instance.');
    app.exit(0);
  } else {
    console.log('Single instance lock acquired.');
    log.info('Single instance lock acquired.');
  }

  createWindow()

  app.on('activate', function () {
    console.log('App activated.');
    log.info('App activated.');
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log('No windows open, creating new window.');
      log.info('No windows open, creating new window.');
      createWindow()
    }
  })

  setTimeout(() => {
    console.log('Triggering server:file-reload event from main process (initial trigger).');
    log.info('Triggering server:file-reload event from main process (initial trigger).');
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('server:file-reload', { message: 'Initial file reload trigger from main process' });
      console.log('[MAIN] Sent server:file-reload event to renderer.');
      log.info('[MAIN] Sent server:file-reload event to renderer.');
    } else {
      console.warn('[MAIN] mainWindow or webContents not available to send server:file-reload event.');
      log.warn('[MAIN] mainWindow or webContents not available to send server:file-reload event.');
    }
  }, 20000);


})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  console.log('All windows closed.');
  log.info('All windows closed.');
  if (process.platform !== 'darwin') {
    console.log('Quitting app (not macOS).');
    log.info('Quitting app (not macOS).');
    app.quit()
  } else {
    console.log('Not quitting app (macOS behavior).');
    log.info('Not quitting app (macOS behavior).');
  }
})

// App Section END !!! -------------------------------------------------------------------------------------
