import React, { useState, useEffect, useRef } from 'react';
import ConsoleSidebar from './components/ConsoleSidebar';
import ConsoleMainArea from './components/ConsoleMainArea'; // <-- new import

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

    return (
        <div className="h-full bg-[#0D1117] text-[#C9D1D9] flex">
            {/* Sidebar */}
            <ConsoleSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)} 
            />

            {/* Main Console Area */}
            <ConsoleMainArea
                consoleText={consoleText}
                formatMessage={formatMessage}
                consoleEndRef={consoleEndRef}
            />
        </div>
    );
};

export default Console;