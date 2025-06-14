import React from 'react';

const PythonServiceConfig = ({ onComplete }) => {
    return (
        <div className="flex flex-col flex-1">
            <div className="text-[#C9D1D9] text-lg mb-6">
                Python Service Configuration
            </div>
            
            {/* Add your Python-specific configuration here */}
            
            <div className="mt-auto flex gap-4 pt-6 border-t border-[#30363D]">
                <button
                    onClick={() => onComplete()}
                    className="flex-1 px-6 py-3 bg-[#1F6FEB] hover:bg-[#58A6FF] text-white rounded-md transition-colors font-medium text-lg"
                >
                    Create Python Service
                </button>
            </div>
        </div>
    );
};

export default PythonServiceConfig;
