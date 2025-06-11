import React, { useState, useEffect, useRef } from 'react';
import ConsoleSidebar from './components/ConsoleSidebar';
import ConsoleMainArea from './components/ConsoleMainArea';

// Helper function to process escape sequences in log messages
function formatMessage(messageString) {
    if (typeof messageString !== 'string') {
        return messageString;
    }
    // Replace literal escape sequences with their actual characters
    // Order is important: \\ first (via placeholder), then \n, \t, etc.
    return messageString
        .replace(/\\\\/g, '\uE000TEMP_BACKSLASH\uE001') // Use PUA characters as placeholder for \
        .replace(/\\n/g, '\n') // literal \n to newline
        .replace(/\\t/g, '\t') // literal \t to tab
        .replace(/\\r/g, '\r') // literal \r to carriage return
        .replace(/\uE000TEMP_BACKSLASH\uE001/g, '\\'); // placeholder back to \
}

const Console = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [consoleText, setConsoleText] = useState(
        "This is the Console Output for the Service \\n-------------------------------------------------\n\n"
    );
    const consoleEndRef = useRef(null);

    useEffect(() => {
        const handleServerFileReload = (event, data) => {
            console.log("server reload Event Triggered in Console/Console");
            // Add any specific logic for file reload here if needed
        };

        if (window.api && window.api.onServerFileReload) {
            window.api.onServerFileReload(handleServerFileReload);
            console.log('[Console/Console] Subscribed to server:file-reload event');
        } else {
            console.warn('[Console/Console] window.api.onServerFileReload is not available');
        }

        // Cleanup listener on unmount
        return () => {
            if (window.api && window.api.removeServerFileReloadListener) {
                window.api.removeServerFileReloadListener();
                console.log('[Console/Console] Unsubscribed from server:file-reload event');
            }
        };
    }, []);

    const scrollToBottom = () => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    // Toggle sidebar function
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="h-full bg-[#0D1117] text-[#C9D1D9] flex">
            {/* Sidebar */}
            <ConsoleSidebar 
                isOpen={sidebarOpen} 
                onToggle={toggleSidebar} 
            />

            {/* Main Console Area with Toggle Button */}
            <div className="flex-1 flex flex-col">
                {/* Header with Toggle Button */}
                <div className="p-4 border-b border-[#30363D] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Add sidebar toggle button */}
                        <button 
                            onClick={toggleSidebar}
                            className="p-1.5 rounded hover:bg-[#30363D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={sidebarOpen 
                                    ? "M18 6L6 18M6 6l12 12" // X icon when sidebar is open
                                    : "M4 6h16M4 12h16M4 18h16" // Menu icon when sidebar is closed
                                } />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-[#C9D1D9]">Console</h1>
                            <p className="text-sm text-[#8B949E]">View application logs and debug information</p>
                        </div>
                    </div>
                </div>

                {/* Console Output */}
                <div className="flex-1 bg-[#0D1117] p-4 overflow-hidden">
                    <div className="h-full bg-[#161B22] rounded-lg border border-[#30363D] p-4 overflow-y-auto">
                        <div className="font-mono text-sm space-y-1 whitespace-pre-wrap break-words">
                            {formatMessage(consoleText)}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Console;