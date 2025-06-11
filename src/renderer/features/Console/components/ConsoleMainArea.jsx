import React from 'react';

const ConsoleMainArea = ({ consoleText, formatMessage, consoleEndRef }) => (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#30363D] flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* The sidebar toggle button is handled in the parent */}
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
);

export default ConsoleMainArea;
