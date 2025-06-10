import React, { useState, useEffect, useRef } from 'react';
import ConsoleSidebar from './components/ConsoleSidebar';

// New internal LogEntry component
function LogEntry({ log, getLogColor }) {
	return (
		<div className="flex items-start gap-3 py-1">
			<span className="text-[#8B949E] text-xs whitespace-nowrap">
				{new Date(log.timestamp).toLocaleTimeString()}
			</span>
			<span className={`text-xs font-bold uppercase whitespace-nowrap ${getLogColor(log.level)}`}>
				[{log.level}]
			</span>
			<span className="text-[#8B949E] text-xs whitespace-nowrap">
				[{log.service}]
			</span>
			<span className="text-[#C9D1D9] text-xs flex-1 break-words">
				{log.message}
			</span>
		</div>
	);
}

const Console = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [logs, setLogs] = useState([
        { id: 1, timestamp: new Date().toISOString(), level: 'info', message: 'Console ready...', service: 'System' },
        { id: 2, timestamp: new Date().toISOString(), level: 'info', message: 'Application started successfully', service: 'Application' },
        { id: 3, timestamp: new Date().toISOString(), level: 'warn', message: 'Configuration file not found, using defaults', service: 'Config' },
        { id: 4, timestamp: new Date().toISOString(), level: 'error', message: 'Failed to connect to database', service: 'Database' },
        { id: 5, timestamp: new Date().toISOString(), level: 'info', message: 'Server listening on port 3000', service: 'Server' }
    ]);
    const consoleEndRef = useRef(null);

    const scrollToBottom = () => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const getLogColor = (level) => {
        switch (level) {
            case 'error':
                return 'text-red-400';
            case 'warn':
                return 'text-yellow-400';
            case 'info':
                return 'text-blue-400';
            default:
                return 'text-[#C9D1D9]';
        }
    };

    const addLog = (level, message, service = 'System') => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            level,
            message,
            service
        };
        setLogs(prev => [...prev, newLog]);
    };

    return (
        <div className="h-full bg-[#0D1117] text-[#C9D1D9] flex">
            {/* Sidebar */}
            <ConsoleSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)} 
            />

            {/* Main Console Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-[#30363D] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded hover:bg-[#30363D] transition-colors"
                            title="Toggle Sidebar"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-[#C9D1D9]">Console</h1>
                            <p className="text-sm text-[#8B949E]">View application logs and debug information</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setLogs([])}
                            className="px-3 py-1 bg-[#30363D] text-[#C9D1D9] rounded text-sm hover:bg-[#40464D] transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => addLog('info', 'Test log message', 'Test Service')}
                            className="px-3 py-1 bg-[#1F6FEB] text-white rounded text-sm hover:bg-[#1F6FEB]/80 transition-colors"
                        >
                            Test Log
                        </button>
                    </div>
                </div>

                {/* Console Output */}
                <div className="flex-1 bg-[#0D1117] p-4 overflow-hidden">
                    <div className="h-full bg-[#161B22] rounded-lg border border-[#30363D] p-4 overflow-y-auto">
                        <div className="font-mono text-sm space-y-1">
                            {logs.map(log => (
                                <LogEntry key={log.id} log={log} getLogColor={getLogColor} />
                            ))}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Console;