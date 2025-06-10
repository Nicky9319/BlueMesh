import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ExplorerPanel from './components/ExplorerPanel';
import MainCanvas from './components/MainCanvas';

const Dashboard = () => {
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const [activeTab, setActiveTab] = useState('directory');

    useEffect(() => {
        const handleServerFileReload = (event, data) => {
            console.log("server reload Event Triggered in Dashboard/Dashboard");
            // Add any specific logic for file reload here if needed
        };

        if (window.api && window.api.onServerFileReload) {
            window.api.onServerFileReload(handleServerFileReload);
            console.log('[Dashboard/Dashboard] Subscribed to server:file-reload event');
        } else {
            console.warn('[Dashboard/Dashboard] window.api.onServerFileReload is not available');
        }

        // Cleanup listener on unmount
        return () => {
            if (window.api && window.api.removeServerFileReloadListener) {
                window.api.removeServerFileReloadListener();
                console.log('[Dashboard/Dashboard] Unsubscribed from server:file-reload event');
            }
        };
    }, []);
    
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const selectedTabId = activeTab;

    return (
        <div className="flex h-screen font-sans bg-[#0D1117] text-[#C9D1D9]">
            <ExplorerPanel
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />
            <MainCanvas 
                selectedTabId={selectedTabId} 
                currentProjectPath={currentProjectPath}
            />
        </div>
    );
};

export default Dashboard;
