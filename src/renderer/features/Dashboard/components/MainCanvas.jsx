import React from 'react';

const MainCanvas = ({ selectedTab }) => {
    return (
        <div className="flex-1 p-5 bg-gray-900 text-gray-300 overflow-y-auto">
            {selectedTab ? (
                <div className="text-2xl font-bold">
                    Selected Widget: {selectedTab.title}
                </div>
            ) : (
                <div>No widget selected</div>
            )}
        </div>
    );
};

export default MainCanvas;