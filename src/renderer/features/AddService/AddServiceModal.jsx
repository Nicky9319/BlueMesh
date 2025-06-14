import React, { useState } from 'react';
import PythonServiceConfig from './components/PythonServiceConfig';

const AddServiceModal = ({ isOpen, onClose }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [showConfig, setShowConfig] = useState(false);

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setShowConfig(true);
    };

    const handleConfigComplete = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-[#0D1117] border border-[#30363D] rounded-lg shadow-2xl w-[85vw] h-[85vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-[#30363D] bg-[#161B22]">
                    <h1 className="font-bold text-[#C9D1D9] text-2xl">Add New Service</h1>
                    <button 
                        onClick={onClose}
                        className="text-[#8B949E] hover:text-[#C9D1D9] transition-colors p-1 rounded-md hover:bg-[#30363D]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Language Selection - always visible */}
                <div className="flex gap-4 px-8 py-4 border-b border-[#30363D] bg-[#0D1117]">
                    <button
                        onClick={() => setSelectedLanguage('python')}
                        className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 text-sm ${
                            selectedLanguage === 'python'
                                ? 'bg-[#1F6FEB] text-white shadow-sm'
                                : 'bg-[#21262D] text-[#C9D1D9] hover:bg-[#30363D]'
                        }`}
                    >
                        Python
                    </button>
                    <div className="relative group">
                        <button
                            disabled
                            className="px-5 py-2 rounded-lg bg-[#21262D] text-[#8B949E] opacity-50 cursor-not-allowed flex items-center gap-2"
                        >
                            JavaScript <span>🔒</span>
                        </button>
                        <div className="absolute hidden group-hover:block bg-[#30363D] text-[#C9D1D9] px-3 py-1.5 rounded text-xs -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg z-10">
                            Coming Soon
                        </div>
                    </div>
                    <div className="relative group">
                        <button
                            disabled
                            className="px-5 py-2 rounded-lg bg-[#21262D] text-[#8B949E] opacity-50 cursor-not-allowed flex items-center gap-2"
                        >
                            Java <span>🔒</span>
                        </button>
                        <div className="absolute hidden group-hover:block bg-[#30363D] text-[#C9D1D9] px-3 py-1.5 rounded text-xs -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg z-10">
                            Coming Soon
                        </div>
                    </div>
                </div>

                {/* Content Container with Padding */}
                <div className="flex-1 overflow-hidden px-8 py-6">
                    {/* Content below changes based on selectedLanguage */}
                    {selectedLanguage === 'python' ? (
                        <PythonServiceConfig onComplete={handleConfigComplete} />
                    ) : (
                        <div className="text-[#C9D1D9] text-xl text-center mt-8">
                            Coming Soon
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddServiceModal;
