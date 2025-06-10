import React from 'react';

const tabs = [
    { id: 'directory', icon: '📂', title: 'Directory' },
    { id: 'console', icon: '🖥️', title: 'Console' },
    { id: 'architecture', icon: '🏛️', title: 'Architecture' }
];

const ExplorerPanel = ({ activeTab, onTabClick }) => {
    return (
        <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Tab Icons */}
            <div className="flex flex-col">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`w-12 h-12 flex items-center justify-center text-xl cursor-pointer border-none bg-transparent transition-colors duration-200 relative ${
                            activeTab === tab.id
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                        title={tab.title}
                    >
                        {activeTab === tab.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                        )}
                        <span aria-label={tab.title} role="img">{tab.icon}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExplorerPanel;