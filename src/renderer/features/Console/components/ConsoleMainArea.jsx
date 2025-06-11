import React , {useEffect, useState} from 'react';

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

const ConsoleMainArea = ({ consoleText, consoleEndRef }) => {

    const [consoleOutput, setConsoleOutput] = useState(consoleText);

    useEffect(() => {
        setConsoleOutput(consoleText);
    }, [consoleText]);


    return (
    <div className="flex-1 flex flex-col min-h-0">

        {/* Console Output */}

        <div className="flex-1 bg-[#0D1117] p-4 min-h-0">

            <div className="h-full bg-[#161B22] rounded-lg border border-[#30363D] p-4 overflow-hidden">

                <div className="font-mono text-sm space-y-1 whitespace-pre-wrap break-words">

                    {formatMessage(consoleOutput)}

                    <div ref={consoleEndRef} />

                </div>

            </div>

        </div>

        {/* Custom scrollbar styling (unused when overflow-hidden) */}

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
)};

export default ConsoleMainArea;
