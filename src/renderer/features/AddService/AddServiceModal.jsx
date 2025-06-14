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
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-8 w-[80vw] h-[80vh] mx-4 shadow-xl flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-[#C9D1D9]">Add New Service</h2>
                    <button 
                        onClick={onClose}
                        className="text-[#8B949E] hover:text-[#C9D1D9] transition-colors p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Language Selection - always visible */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setSelectedLanguage('python')}
                        className={`px-4 py-2 rounded-md ${
                            selectedLanguage === 'python'
                                ? 'bg-[#1F6FEB] text-white'
                                : 'bg-[#21262D] text-[#C9D1D9]'
                        }`}
                    >
                        Python
                    </button>
                    <div className="relative group">
                        <button
                            disabled
                            className="px-4 py-2 rounded-md bg-[#21262D] text-[#8B949E] opacity-50 cursor-not-allowed flex items-center gap-2"
                        >
                            JavaScript <span>🔒</span>
                        </button>
                        <div className="absolute hidden group-hover:block bg-[#30363D] text-[#C9D1D9] px-2 py-1 rounded text-sm -top-8">
                            Coming Soon
                        </div>
                    </div>
                    <div className="relative group">
                        <button
                            disabled
                            className="px-4 py-2 rounded-md bg-[#21262D] text-[#8B949E] opacity-50 cursor-not-allowed flex items-center gap-2"
                        >
                            Java <span>🔒</span>
                        </button>
                        <div className="absolute hidden group-hover:block bg-[#30363D] text-[#C9D1D9] px-2 py-1 rounded text-sm -top-8">
                            Coming Soon
                        </div>
                    </div>
                </div>

                {/* Content below changes based on selectedLanguage */}
                {selectedLanguage === 'python' ? (
                    <PythonServiceConfig onComplete={handleConfigComplete} />
                ) : (
                    <div className="text-[#C9D1D9] text-lg text-center mt-4">
                        Coming Soon
                    </div>
                )}

                {/* ...existing modal actions or footer if any... */}
            </div>
        </div>
    );
};

export default AddServiceModal;
