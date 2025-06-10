import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFolderStructure, setLoadingStructure } from '../../../../store/ProjectInfoSlice';

const FileIcon = ({ extension, isDirectory }) => {
  if (isDirectory) return '📁';
  
  const iconMap = {
    '.js': '📄',
    '.jsx': '⚛️',
    '.ts': '📘',
    '.tsx': '⚛️',
    '.html': '🌐',
    '.css': '🎨',
    '.json': '📋',
    '.md': '📝',
    '.txt': '📄',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.gif': '🖼️',
    '.svg': '🖼️'
  };
  
  return iconMap[extension] || '📄';
};

const FileTreeItem = ({ item, level = 0, onFileClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggle = () => {
    if (item.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };
  
  return (
    <div>
      <div 
        className="flex items-center py-1 px-2 cursor-pointer select-none text-sm leading-6 hover:bg-gray-700 text-gray-300"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {item.type === 'directory' && (
          <span className="w-4 text-xs mr-1 text-gray-300">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <FileIcon extension={item.extension} isDirectory={item.type === 'directory'} />
        <span className="ml-1.5 whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
      </div>
      {item.type === 'directory' && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileTreeItem 
              key={index} 
              item={child} 
              level={level + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const isProjectLoaded = useSelector(state => state.project.isProjectLoaded);
    const folderStructure = useSelector(state => state.project.folderStructure);
    const isLoadingStructure = useSelector(state => state.project.isLoadingStructure);
    const [selectedFile, setSelectedFile] = useState(null);
    
    useEffect(() => {
        console.log('Dashboard loaded - Project path from Redux:', currentProjectPath);
        console.log('Project loaded status:', isProjectLoaded);
        
        if (currentProjectPath && isProjectLoaded) {
            loadFolderStructure();
        }
    }, [currentProjectPath, isProjectLoaded]);

    useEffect(() => {
        // Set up folder structure update listener
        const handleFolderStructureUpdate = (event, structure) => {
            console.log('Folder structure updated:', structure);
            dispatch(setFolderStructure(structure));
            dispatch(setLoadingStructure(false));
        };

        window.api.onFolderStructureUpdate(handleFolderStructureUpdate);

        // Cleanup listener on unmount
        return () => {
            window.api.removeFolderStructureListeners();
        };
    }, [dispatch]);
    
    const loadFolderStructure = async () => {
        if (!currentProjectPath) return;
        
        dispatch(setLoadingStructure(true));
        try {
            await window.api.readFolderStructure(currentProjectPath, {
                includeContent: false,
                maxDepth: 5,
                excludeHidden: true,
                excludeNodeModules: true
            });
            console.log('Folder structure load initiated');
        } catch (error) {
            console.error('Failed to load folder structure:', error);
            dispatch(setLoadingStructure(false));
        }
    };

    const refreshFolderStructure = async () => {
        if (!currentProjectPath) return;
        
        dispatch(setLoadingStructure(true));
        try {
            await window.api.refreshFolderStructure(currentProjectPath);
            console.log('Folder structure refresh initiated');
        } catch (error) {
            console.error('Failed to refresh folder structure:', error);
            dispatch(setLoadingStructure(false));
        }
    };
    
    const handleFileClick = async (file) => {
        console.log('File clicked:', file.path);
        setSelectedFile(file);
        
        // Load file content if it's a text file
        if (file.type === 'file' && file.size < 1024 * 1024) {
            try {
                const structure = await window.api.readFolderStructure(file.path, {
                    includeContent: true
                });
                console.log('File content loaded for:', file.name);
            } catch (error) {
                console.error('Failed to load file content:', error);
            }
        }
    };
    
    const handleBackToSelection = () => {
        navigate('/');
    };
    
    return (
        <div className="flex h-screen font-sans bg-gray-900 text-gray-300">
            {/* Sidebar */}
            <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-3 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="m-0 text-sm font-semibold uppercase text-gray-300">
                        Explorer
                    </h3>
                    <div className="flex gap-1">
                        <button 
                            onClick={refreshFolderStructure} 
                            disabled={isLoadingStructure}
                            className="bg-transparent border-none text-gray-300 cursor-pointer p-1 rounded text-base hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Refresh folder structure"
                        >
                            {isLoadingStructure ? '⟳' : '↻'}
                        </button>
                    </div>
                </div>
                
                {/* File Tree */}
                <div className="flex-1 overflow-y-auto py-1">
                    {isLoadingStructure ? (
                        <div className="p-4 text-center text-gray-500 italic">
                            Loading folder structure...
                        </div>
                    ) : folderStructure ? (
                        <FileTreeItem 
                            item={folderStructure} 
                            onFileClick={handleFileClick}
                        />
                    ) : (
                        <div className="p-4 text-center text-gray-500 italic">
                            No folder structure available
                        </div>
                    )}
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-5 bg-gray-900 text-gray-300 overflow-y-auto">
                {/* Content Header */}
                <div className="flex justify-between items-center mb-5 pb-2.5 border-b border-gray-700">
                    <h2 className="m-0 text-white text-xl">Current Project</h2>
                    <button 
                        onClick={handleBackToSelection}
                        className="px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700"
                    >
                        Back to Selection
                    </button>
                </div>
                
                {/* Project Path */}
                <p className="font-mono bg-gray-800 p-3 rounded border border-gray-700 mb-5 break-all">
                    {currentProjectPath}
                </p>
                
                {/* Selected File Info */}
                {selectedFile && (
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                        <h3 className="mt-0 text-white">Selected File: {selectedFile.name}</h3>
                        <p className="my-2 font-mono text-xs">Path: {selectedFile.path}</p>
                        <p className="my-2 font-mono text-xs">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                        <p className="my-2 font-mono text-xs">Modified: {new Date(selectedFile.modified).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
