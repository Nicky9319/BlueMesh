import React, { useState } from 'react';

const ExplorerPanel = () => {
    const [activeTab, setActiveTab] = useState('explorer');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const tabs = [
        { id: 'explorer', icon: '📁', title: 'Explorer', component: 'sidebar' },
        { id: 'search', icon: '🔍', title: 'Search', component: 'search' },
        { id: 'git', icon: '🌿', title: 'Source Control', component: 'git' },
        { id: 'debug', icon: '🐛', title: 'Run and Debug', component: 'debug' },
        { id: 'canvas', icon: '🎨', title: 'Architecture Canvas', component: 'canvas' }
    ];

    const handleTabClick = (tabId) => {
        if (activeTab === tabId) {
            setIsSidebarVisible(!isSidebarVisible);
        } else {
            setActiveTab(tabId);
            setIsSidebarVisible(true);
        }
    };

    return (
        <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Tab Icons */}
            <div className="flex flex-col">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-12 h-12 flex items-center justify-center text-xl cursor-pointer border-none bg-transparent transition-colors duration-200 relative ${
                            activeTab === tab.id && isSidebarVisible
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                        title={tab.title}
                    >
                        {activeTab === tab.id && isSidebarVisible && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                        )}
                        {tab.icon}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExplorerPanel;