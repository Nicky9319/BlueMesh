import React from 'react';

const ConsoleMainArea = ({ consoleText, formatMessage, consoleEndRef }) => (
    <div className="flex-1 flex flex-col">
        {/* Console Output */}
        <div className="flex-1 bg-[#0D1117] p-4 overflow-hidden">
            <div className="h-full bg-[#161B22] rounded-lg border border-[#30363D] p-4 overflow-y-auto custom-scrollbar">
                <div className="font-mono text-sm space-y-1 whitespace-pre-wrap break-words">
                    {formatMessage(consoleText)}
                    <div ref={consoleEndRef} />
                </div>
            </div>
        </div>

        {/* Custom scrollbar styling */}
        <style jsx global>{`
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

export default ConsoleMainArea;
