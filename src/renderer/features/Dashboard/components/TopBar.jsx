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

    // Status text and color
    let statusText = '';
    let statusColor = '';
    if (state === 'idle') {
        statusText = 'Idle';
        statusColor = 'text-[#8B949E]';
    } else if (state === 'loading') {
        statusText = 'Starting...';
        statusColor = 'text-[#58A6FF]';
    } else if (state === 'running') {
        statusText = 'Running';
        statusColor = 'text-[#3FB950]';
    }

    return (
        <div
            className="flex justify-center items-center w-full"
            style={{ minWidth: 180, minHeight: 32 }}
        >
            <div
                className="flex items-center gap-2 px-3 py-0.5 rounded shadow bg-[#0D1117] border border-[#30363D] transition-all duration-200"
                style={{ height: 32, minHeight: 32, maxHeight: 32 }}
            >
                {state === 'idle' && (
                    <button
                        onClick={handleStart}
                        className="flex items-center gap-1 px-3 py-0.5 bg-transparent border-2 border-[#3FB950] text-[#3FB950] hover:bg-[#3FB950]/10 font-medium rounded transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] text-sm h-7"
                        style={{ minWidth: 60 }}
                    >
                        <span className="text-base">▶️</span>
                    </button>
                )}
                {state === 'loading' && (
                    <div className="flex items-center gap-1 text-[#58A6FF] font-medium text-sm h-7">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                        </svg>
                    </div>
                )}
                {state === 'running' && (
                    <>
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-1 px-2 py-0.5 bg-transparent border border-[#D29922] text-[#D29922] hover:bg-[#D29922]/10 font-medium rounded transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] text-sm h-7"
                            style={{ minWidth: 32 }}
                            title="Restart"
                        >
                            <span className="text-base">🔄</span>
                        </button>
                        <button
                            onClick={handleStop}
                            className="flex items-center gap-1 px-2 py-0.5 bg-transparent border border-[#F85149] text-[#F85149] hover:bg-[#F85149]/10 font-medium rounded transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] text-sm h-7"
                            style={{ minWidth: 32 }}
                            title="Stop"
                        >
                            <span className="text-base">⏹️</span>
                        </button>
                    </>
                )}
                {/* Status text */}
                <span className={`ml-2 text-xs font-medium ${statusColor}`} style={{ minWidth: 60 }}>
                    {statusText}
                </span>
            </div>
        </div>
    );
};

export default TopBar;
