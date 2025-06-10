import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFolderStructure, setLoadingStructure } from '../../../../store/ServerInfoSlice';
import Sidebar from './components/Sidebar';

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
        <div className="flex h-screen font-sans bg-gray-900 text-gray-300">
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
