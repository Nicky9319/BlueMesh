import React from 'react';
import TopBar from './TopBar';

const MainCanvas = ({ selectedTab }) => {
    return (
        <div className="flex-1 flex flex-col bg-gray-900 text-gray-300 overflow-y-auto">
            {/* TopBar always at the top, not floating */}
            <div className="flex justify-center items-center w-full" style={{ minHeight: 40 }}>
                <TopBar />
            </div>
            <div className="flex-1 p-5">
                {selectedTab ? (
                    <div className="text-2xl font-bold">
                        Selected Widget: {selectedTab.title}
                    </div>
                ) : (
                    <div>No widget selected</div>
                )}
            </div>
        </div>
    );
};

export default MainCanvas;