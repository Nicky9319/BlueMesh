import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExplorerPanel from './components/ExplorerPanel';
import MainCanvas from './components/MainCanvas';

const tabs = [
    { id: 'directory', icon: '📂', title: 'Directory' },
    { id: 'console', icon: '🖥️', title: 'Console' },
    { id: 'architecture', icon: '🏛️', title: 'Architecture' }
];

const Dashboard = () => {
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const [activeTab, setActiveTab] = useState('directory');
    
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const selectedTab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="flex h-screen font-sans bg-gray-900 text-gray-300">
            <ExplorerPanel
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />
            <MainCanvas selectedTab={selectedTab} />
        </div>
    );
};

export default Dashboard;
