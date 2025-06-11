import React from 'react';

const ConsoleMainArea = ({ consoleText, formatMessage, consoleEndRef }) => (
    <div className="flex-1 flex flex-col">
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
);

export default ConsoleMainArea;
