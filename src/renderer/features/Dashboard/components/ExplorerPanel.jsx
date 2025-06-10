import React from 'react';

const tabs = [
    { 
        id: 'directory', 
        title: 'Directory',
        icon: (isActive) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z" 
                    stroke={isActive ? "#C9D1D9" : "#8B949E"} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </svg>
        )
    },
    { 
        id: 'console', 
        title: 'Console',
        icon: (isActive) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke={isActive ? "#C9D1D9" : "#8B949E"} strokeWidth="2" />
                <path d="M7 9L10 12L7 15" stroke={isActive ? "#C9D1D9" : "#8B949E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15H17" stroke={isActive ? "#C9D1D9" : "#8B949E"} strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    { 
        id: 'architecture', 
        title: 'Architecture',
        icon: (isActive) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M12 3L3 9V21H21V9L12 3Z" 
                    stroke={isActive ? "#C9D1D9" : "#8B949E"} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
                <path 
                    d="M9 21V12H15V21" 
                    stroke={isActive ? "#C9D1D9" : "#8B949E"} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </svg>
        )
    }
];

const ExplorerPanel = ({ activeTab, onTabClick }) => {
    return (
        <div className="w-12 bg-[#0D1117] border-r border-[#30363D] flex flex-col">
            {/* Tab Icons */}
            <div className="flex flex-col">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors duration-200 relative ${
                            activeTab === tab.id
                                ? 'bg-[#1F6FEB]/20 text-[#C9D1D9]'
                                : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D]'
                        }`}
                        title={tab.title}
                    >
                        {activeTab === tab.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#1F6FEB]"></div>
                        )}
                        {tab.icon(activeTab === tab.id)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExplorerPanel;