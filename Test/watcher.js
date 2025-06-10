const fs = require('fs');
const path = require('path');

const watchPath = '\\\\wsl.localhost\\Ubuntu-24.04\\home\\paarth\\MicroserviceServer_Setup';

// Track existing files to detect additions/removals
let existingFiles = new Set();
let fileStats = new Map(); // Track file modification times
let folderStructure = {}; // Store the complete folder structure
let capturedFolderStructure = {}; // Store captured folder structure

// Build folder structure object
function buildFolderStructure(dirPath, relativePath = '') {
    const structure = {};
    
    try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const itemRelativePath = relativePath ? path.join(relativePath, item) : item;
            
            try {
                const stat = fs.lstatSync(itemPath);
                
                if (stat.isSymbolicLink()) {
                    structure[item] = { type: 'symlink', path: itemRelativePath };
                } else if (stat.isDirectory()) {
                    structure[item] = {
                        type: 'directory',
                        path: itemRelativePath,
                        children: buildFolderStructure(itemPath, itemRelativePath)
                    };
                } else {
                    structure[item] = {
                        type: 'file',
                        path: itemRelativePath,
                        size: stat.size,
                        modified: stat.mtime.getTime()
                    };
                }
            } catch (error) {
                structure[item] = { type: 'error', path: itemRelativePath, error: error.message };
            }
        });
    } catch (error) {
        // Return empty structure if directory can't be read
    }
    
    return structure;
}

// Capture current folder structure and store it
function captureCurrentFolderStructure() {
    console.log('\n=== CAPTURING CURRENT FOLDER STRUCTURE ===');
    capturedFolderStructure = buildFolderStructure(watchPath);
    console.log('Folder structure captured successfully');
    return capturedFolderStructure;
}

// Print folder structure from object
function printStructureFromObject(structure, prefix = '') {
    const items = Object.keys(structure).sort((a, b) => {
        const aType = structure[a].type;
        const bType = structure[b].type;
        
        if (aType === 'directory' && bType !== 'directory') return -1;
        if (aType !== 'directory' && bType === 'directory') return 1;
        return a.localeCompare(b);
    });
    
    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const currentPrefix = isLast ? '└── ' : '├── ';
        const nextPrefix = isLast ? '    ' : '│   ';
        const node = structure[item];
        
        switch (node.type) {
            case 'directory':
                console.log(`${prefix}${currentPrefix}${item}/`);
                printStructureFromObject(node.children, prefix + nextPrefix);
                break;
            case 'symlink':
                console.log(`${prefix}${currentPrefix}${item} -> [symlink]`);
                break;
            case 'error':
                console.log(`${prefix}${currentPrefix}${item} [access denied]`);
                break;
            default:
                console.log(`${prefix}${currentPrefix}${item}`);
        }
    });
}

// Print folder structure
function printFolderStructure(dirPath, prefix = '', isLast = true) {
    try {
        const items = fs.readdirSync(dirPath);
        const stats = fs.lstatSync(dirPath);
        
        // Sort items: directories first, then files
        const sortedItems = items.sort((a, b) => {
            try {
                const aPath = path.join(dirPath, a);
                const bPath = path.join(dirPath, b);
                const aStat = fs.lstatSync(aPath);
                const bStat = fs.lstatSync(bPath);
                
                if (aStat.isDirectory() && !bStat.isDirectory()) return -1;
                if (!aStat.isDirectory() && bStat.isDirectory()) return 1;
                return a.localeCompare(b);
            } catch {
                return 0;
            }
        });

        sortedItems.forEach((item, index) => {
            const itemPath = path.join(dirPath, item);
            const isLastItem = index === sortedItems.length - 1;
            const currentPrefix = isLast ? '└── ' : '├── ';
            const nextPrefix = isLast ? '    ' : '│   ';
            
            try {
                const stat = fs.lstatSync(itemPath);
                
                if (stat.isSymbolicLink()) {
                    console.log(`${prefix}${currentPrefix}${item} -> [symlink]`);
                } else if (stat.isDirectory()) {
                    console.log(`${prefix}${currentPrefix}${item}/`);
                    printFolderStructure(itemPath, prefix + nextPrefix, isLastItem);
                } else {
                    console.log(`${prefix}${currentPrefix}${item}`);
                }
            } catch (error) {
                console.log(`${prefix}${currentPrefix}${item} [access denied]`);
            }
        });
    } catch (error) {
        console.log(`${prefix}[error reading directory: ${error.message}]`);
    }
}

// Initialize existing files
function initializeFiles() {
    console.log('\n=== BUILDING FOLDER STRUCTURE ===');
    folderStructure = buildFolderStructure(watchPath);
    
    console.log('\n=== FOLDER STRUCTURE ===');
    console.log(`${path.basename(watchPath)}/`);
    printStructureFromObject(folderStructure);
    console.log('\n=== INITIALIZING FILE TRACKING ===');
    
    try {
        const files = fs.readdirSync(watchPath, { recursive: true });
        files.forEach(file => {
            const fullPath = path.join(watchPath, file);
            try {
                const stat = fs.lstatSync(fullPath);
                if (stat.isFile() && !stat.isSymbolicLink()) {
                    existingFiles.add(fullPath);
                    fileStats.set(fullPath, stat.mtime.getTime());
                }
            } catch (error) {
                // Skip files that can't be accessed (symlinks, etc.)
            }
        });
        console.log(`Initialized with ${existingFiles.size} files`);
    } catch (error) {
        console.error('Error initializing files:', error.message);
    }
}

// Check for added/removed files
function checkFileChanges() {
    try {
        const currentFiles = new Set();
        const currentStats = new Map();
        const files = fs.readdirSync(watchPath, { recursive: true });
        
        files.forEach(file => {
            const fullPath = path.join(watchPath, file);
            try {
                const stat = fs.lstatSync(fullPath);
                if (stat.isFile() && !stat.isSymbolicLink()) {
                    currentFiles.add(fullPath);
                    currentStats.set(fullPath, stat.mtime.getTime());
                }
            } catch (error) {
                // Skip files that can't be accessed
            }
        });

        // Check for added files
        currentFiles.forEach(file => {
            if (!existingFiles.has(file)) {
                console.log(`File added: ${file}`);
                // Rebuild folder structure when files are added
                folderStructure = buildFolderStructure(watchPath);
            }
        });

        // Check for removed files
        existingFiles.forEach(file => {
            if (!currentFiles.has(file)) {
                console.log(`File removed: ${file}`);
                // Rebuild folder structure when files are removed
                folderStructure = buildFolderStructure(watchPath);
            }
        });

        // Check for changed files
        currentStats.forEach((mtime, file) => {
            const oldMtime = fileStats.get(file);
            if (oldMtime && mtime > oldMtime) {
                console.log(`File changed: ${file}`);
            }
        });

        existingFiles = currentFiles;
        fileStats = currentStats;
    } catch (error) {
        console.error('Error checking file changes:', error.message);
    }
}

// Initialize and start watching
initializeFiles();
captureCurrentFolderStructure();

// Use polling instead of fs.watch for WSL compatibility
setInterval(() => {
    checkFileChanges();
    captureCurrentFolderStructure();
}, 1000); // Check every second

console.log(`Watching: ${watchPath}`);
console.log('Polling for changes every 1 second...');