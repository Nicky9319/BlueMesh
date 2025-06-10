import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExplorerPanel from './components/ExplorerPanel';
import MainCanvas from './components/MainCanvas';

const tabs = [
    { id: 'explorer', icon: '📁', title: 'Explorer', component: 'sidebar' },
    { id: 'search', icon: '🔍', title: 'Search', component: 'search' },
    { id: 'git', icon: '🌿', title: 'Source Control', component: 'git' },
    { id: 'debug', icon: '🐛', title: 'Run and Debug', component: 'debug' },
    { id: 'canvas', icon: '🎨', title: 'Architecture Canvas', component: 'canvas' }
];

const Dashboard = () => {
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const [activeTab, setActiveTab] = useState('explorer');
    
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const selectedTab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="flex h-screen font-sans bg-gray-900 text-gray-300">
            <ExplorerPanel
                tabs={tabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />
            <MainCanvas selectedTab={selectedTab} />
        </div>
    );
};

export default Dashboard;
