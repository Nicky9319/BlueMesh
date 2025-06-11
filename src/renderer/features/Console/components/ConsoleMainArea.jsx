import React, { useEffect, useState } from 'react';

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

// Individual row component for console lines
const ConsoleRow = ({ line, index }) => {
    return (
        <div className="min-h-[20px] py-0.5 px-1 hover:bg-[#1C2128] transition-colors">
            <span className="font-mono text-sm text-[#C9D1D9] whitespace-pre-wrap break-words">
                {line || '\u00A0'} {/* Non-breaking space for empty lines */}
            </span>
        </div>
    );
};

const ConsoleMainArea = ({ consoleText, consoleEndRef }) => {
    const [consoleRows, setConsoleRows] = useState([]);

    useEffect(() => {
        if (!consoleText) {
            setConsoleRows([]);
            console.log('[ConsoleMainArea] Number of rows: 0');
            return;
        }

        const formattedText = formatMessage(consoleText);
        const lines = formattedText.split('\n');
        setConsoleRows(lines);
        console.log(`[ConsoleMainArea] Number of rows: ${lines.length}`);
    }, [consoleText]);

    return (
        <div className="flex-1 flex flex-col min-h-0 max-h-full">
            {/* Console Output */}
            <div className="flex-1 bg-[#0D1117] p-4 min-h-0">
                <div className="h-full bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-2">
                            {consoleRows.map((line, index) => (
                                <ConsoleRow 
                                    key={index} 
                                    line={line} 
                                    index={index}
                                />
                            ))}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styling */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #161B22;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #30363D;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #484F58;
                }
            `}</style>
        </div>
    );
};

export default ConsoleMainArea;
