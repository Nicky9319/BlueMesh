import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExplorerPanel from './components/ExplorerPanel';
import MainCanvas from './components/MainCanvas';

const Dashboard = () => {
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeTab, setActiveTab] = useState('explorer');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    
    // Tab configuration
    const tabs = [
        { id: 'explorer', icon: '📁', title: 'Explorer', component: 'sidebar' },
        { id: 'search', icon: '🔍', title: 'Search', component: 'search' },
        { id: 'git', icon: '🌿', title: 'Source Control', component: 'git' },
        { id: 'debug', icon: '🐛', title: 'Run and Debug', component: 'debug' },
        { id: 'canvas', icon: '🎨', title: 'Architecture Canvas', component: 'canvas' }
    ];

    const handleTabClick = (tabId) => {
        if (activeTab === tabId) {
            // If clicking the same tab, toggle sidebar visibility
            setIsSidebarVisible(!isSidebarVisible);
        } else {
            // Switch to new tab and ensure sidebar is visible
            setActiveTab(tabId);
            setIsSidebarVisible(true);
        }
    };

    return (
        <div className="flex h-screen font-sans bg-gray-900 text-gray-300">
            {/* Fixed Left Navbar */}
            <ExplorerPanel/>

            {/* Main Content */}
            <MainCanvas/>
        </div>
    );
};

export default Dashboard;
