import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ExplorerPanel from './components/ExplorerPanel';
import MainCanvas from './components/MainCanvas';

const Dashboard = () => {
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const [activeTab, setActiveTab] = useState('directory');
    
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
