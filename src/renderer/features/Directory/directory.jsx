import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFolderStructure, setLoadingStructure } from '../../../../store/ServerInfoSlice';
import Sidebar from './components/Sidebar';

function SelectedFileDetails({ file }) {
    if (!file) return null;
    return (
        <div className="bg-[#30363D] p-4 rounded-lg border border-[#30363D]">
            <h3 className="mt-0 text-[#C9D1D9] font-semibold mb-3">Selected File: {file.name}</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-[#8B949E] text-sm">Path:</span>
                    <span className="text-[#C9D1D9] font-mono text-sm">{file.path}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#8B949E] text-sm">Size:</span>
                    <span className="text-[#C9D1D9] text-sm">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#8B949E] text-sm">Modified:</span>
                    <span className="text-[#C9D1D9] text-sm">{new Date(file.modified).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const isProjectLoaded = useSelector(state => state.project.isProjectLoaded);
    const folderStructure = useSelector(state => state.project.folderStructure);
    const isLoadingStructure = useSelector(state => state.project.isLoadingStructure);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
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

    useEffect(() => {
        const handleServerFileReload = (event, data) => {
            console.log("server reload Event Triggered in Directory/Dashboard");
            // Add any specific logic for file reload here if needed
        };

        if (window.api && window.api.onServerFileReload) {
            window.api.onServerFileReload(handleServerFileReload);
            console.log('[Directory/Dashboard] Subscribed to server:file-reload event');
        } else {
            console.warn('[Directory/Dashboard] window.api.onServerFileReload is not available');
        }

        // Cleanup listener on unmount
        return () => {
            if (window.api && window.api.removeServerFileReloadListener) {
                window.api.removeServerFileReloadListener();
                console.log('[Directory/Dashboard] Unsubscribed from server:file-reload event');
            }
        };
    }, []);
    
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

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };
    
    return (
        <div className="h-full bg-[#0D1117] text-[#C9D1D9]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#C9D1D9] mb-2">Project Explorer</h1>
                <p className="text-[#8B949E]">Browse and manage your project files</p>
            </div>

            <div className="flex h-full bg-[#0D1117] text-[#C9D1D9] border border-[#30363D] rounded-lg overflow-hidden">
                {/* Resizable Sidebar */}
                <Sidebar
                    folderStructure={folderStructure}
                    isLoadingStructure={isLoadingStructure}
                    onFileClick={handleFileClick}
                    onRefresh={refreshFolderStructure}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={handleToggleSidebar}
                />
                
                {/* Main Content */}
                <div className="flex-1 p-5 bg-[#0D1117] text-[#C9D1D9] overflow-y-auto">
                    {/* Content Header */}
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#30363D]">
                        <h2 className="m-0 text-[#C9D1D9] text-xl font-semibold">Current Project</h2>
                        <button 
                            onClick={handleBackToSelection}
                            className="px-4 py-2 bg-[#1F6FEB] text-white border-none rounded cursor-pointer text-sm hover:bg-[#58A6FF] transition-colors duration-200"
                        >
                            Back to Selection
                        </button>
                    </div>
                    
                    {/* Project Path */}
                    <div className="bg-[#30363D] p-4 rounded-lg border border-[#30363D] mb-5">
                        <p className="text-[#8B949E] text-sm mb-2">Project Path:</p>
                        <p className="font-mono text-[#C9D1D9] break-all">{currentProjectPath}</p>
                    </div>
                    
                    {/* Selected File Info */}
                    <SelectedFileDetails file={selectedFile} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
