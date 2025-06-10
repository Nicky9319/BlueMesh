import React from 'react';

const Console = () => {
    return (
        <div className="h-full bg-[#0D1117] text-[#C9D1D9]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#C9D1D9] mb-2">Console Output</h1>
                <p className="text-[#8B949E]">View application logs and debug information</p>
            </div>

            {/* Console Content */}
            <div className="flex-1 bg-[#30363D] rounded-lg border border-[#30363D] p-4">
                <div className="font-mono text-sm">
                    <div className="text-[#8B949E] mb-2">Console ready...</div>
                    {/* Console output will go here */}
                </div>
            </div>
        </div>
    );
};

export default Console;