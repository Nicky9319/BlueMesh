import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    startServer,
    serverStarted,
    serverFailed,
    stopServer,
    selectServerStatus
} from '../../../../../store/ServeSlice';

const TopBar = () => {
    const dispatch = useDispatch();
    const state = useSelector(selectServerStatus); // idle, loading, running

    const handleStart = () => {
        dispatch(startServer());
        setTimeout(() => dispatch(serverStarted()), 1500); // Simulate loading
    };

    const handleRestart = () => {
        dispatch(startServer());
        setTimeout(() => dispatch(serverStarted()), 1500);
    };

    const handleStop = () => {
        dispatch(stopServer());
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
                className="flex items-center gap-3 px-4 py-1 rounded-md shadow-sm bg-[#0D1117] border border-[#30363D] transition-all duration-200"
                style={{ height: 32, minHeight: 32, maxHeight: 32 }}
            >
                {state === 'idle' && (
                    <button
                        onClick={handleStart}
                        className="flex items-center justify-center px-3 py-0.5 bg-transparent border border-[#3FB950] text-[#3FB950] hover:bg-[#3FB950]/10 font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] text-sm h-7"
                        style={{ minWidth: 36 }}
                        title="Start"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.5 3.5V12.5L12.5 8L4.5 3.5Z" fill="#3FB950" stroke="#3FB950" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                )}
                {state === 'loading' && (
                    <div className="flex items-center gap-2 text-[#58A6FF] font-medium text-sm h-7 px-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#58A6FF" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="#58A6FF" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                        </svg>
                    </div>
                )}
                {state === 'running' && (
                    <>
                        <button
                            onClick={handleRestart}
                            className="flex items-center justify-center px-2 py-0.5 bg-transparent border border-[#D29922] text-[#D29922] hover:bg-[#D29922]/10 font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] text-sm h-7"
                            style={{ minWidth: 32 }}
                            title="Restart"
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2" stroke="#D29922" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M8 5L11 2L8 5Z" fill="#D29922"/>
                                <path d="M8 5L11 2" stroke="#D29922" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M11 2L8 5" stroke="#D29922" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            onClick={handleStop}
                            className="flex items-center justify-center px-2 py-0.5 bg-transparent border border-[#F85149] text-[#F85149] hover:bg-[#F85149]/10 font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] text-sm h-7"
                            style={{ minWidth: 32 }}
                            title="Stop"
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="10" height="10" rx="1" stroke="#F85149" strokeWidth="1.5"/>
                            </svg>
                        </button>
                    </>
                )}
                {/* Status text */}
                <span className={`text-xs font-medium ${statusColor}`} style={{ minWidth: 60 }}>
                    {statusText}
                </span>
            </div>
        </div>
    );
};

export default TopBar;
