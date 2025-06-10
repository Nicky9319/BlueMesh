import React from 'react';
import TopBar from './TopBar';

const MainCanvas = ({ selectedTabId, currentProjectPath }) => {
    // Map tab IDs to their titles for display
    const tabTitles = {
        'directory': 'Directory Explorer',
        'console': 'Console Output',
        'architecture': 'Architecture View'
    };

    const selectedTabTitle = tabTitles[selectedTabId] || 'Unknown Tab';

    return (
        <div className="flex-1 flex flex-col bg-[#0D1117] text-[#C9D1D9] overflow-y-auto">
            {/* TopBar always at the top, not floating */}
            <div className="flex justify-center items-center w-full" style={{ minHeight: 40 }}>
                <TopBar />
            </div>
            <div className="flex-1 p-5">
                <div className="text-2xl font-bold mb-4 text-[#C9D1D9]">
                    {selectedTabTitle}
                </div>
                
                {selectedTabId === 'directory' && currentProjectPath && (
                    <div className="bg-[#0D1117] p-3 border border-[#30363D] rounded">
                        <p className="text-[#8B949E] mb-2">Current Project:</p>
                        <p className="text-[#C9D1D9] font-mono break-all">{currentProjectPath}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainCanvas;