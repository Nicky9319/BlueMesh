import React from 'react';
import TopBar from './TopBar';
// Import the feature components
import Directory from '../../Directory/directory';
import Console from '../../Console/console';
import ArchitectureCanvas from '../../ArchitectureCanvas/architecture-canvas';

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
                
                {selectedTabId === 'directory' && (
                    <Directory />
                )}
                {selectedTabId === 'console' && (
                    <Console />
                )}
                {selectedTabId === 'architecture' && (
                    <ArchitectureCanvas />
                )}
            </div>
        </div>
    );
};

export default MainCanvas;