import React, { useState } from 'react';

const TopBar = () => {
    const [state, setState] = useState('idle'); // idle, loading, running

    const handleStart = () => {
        setState('loading');
        setTimeout(() => setState('running'), 1500); // Simulate loading
    };

    const handleRestart = () => {
        setState('loading');
        setTimeout(() => setState('running'), 1500);
    };

    const handleStop = () => {
        setState('idle');
    };

    return (
        <div
            className="flex justify-center items-center"
            style={{ minWidth: 220, minHeight: 36 }}
        >
            <div className="flex justify-center items-center h-9 rounded-full shadow bg-opacity-70 px-4 backdrop-blur-sm">
                {state === 'idle' && (
                    <button
                        onClick={handleStart}
                        className="flex items-center px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition"
                    >
                        <span className="mr-2">▶️</span> Start
                    </button>
                )}
                {state === 'loading' && (
                    <div className="flex items-center text-blue-400 font-semibold text-sm">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                        </svg>
                        Loading...
                    </div>
                )}
                {state === 'running' && (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleRestart}
                            className="flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-sm transition"
                        >
                            <span className="mr-1">🔄</span> Restart
                        </button>
                        <button
                            onClick={handleStop}
                            className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition"
                        >
                            <span className="mr-1">⏹️</span> Stop
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar;
