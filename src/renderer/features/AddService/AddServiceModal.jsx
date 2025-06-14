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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#0D1117] border border-[#30363D] rounded-lg shadow-2xl w-[88vw] max-w-6xl h-[85vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-[#30363D] bg-[#161B22]">
                    <h1 className="font-semibold text-[#C9D1D9] text-xl">Create New Service</h1>
                    <button 
                        onClick={onClose}
                        className="text-[#8B949E] hover:text-[#C9D1D9] transition-colors p-1 rounded-md hover:bg-[#30363D]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Language Selection - always visible */}
                <div className="flex gap-4 px-8 py-4 border-b border-[#30363D] bg-[#0D1117]">
                    <button
                        onClick={() => setSelectedLanguage('python')}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm flex items-center gap-2
                            ${selectedLanguage === 'python'
                                ? 'bg-[#1F6FEB]/20 text-[#58A6FF] border border-[#1F6FEB]/40'
                                : 'bg-[#21262D] text-[#C9D1D9] hover:bg-[#30363D] border border-transparent'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                        </svg>
                        Python
                    </button>
                    <div className="relative group">
                        <button
                            disabled
                            className="px-4 py-2 rounded-md bg-[#21262D] text-[#8B949E] opacity-50 cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                            </svg>
                            JavaScript <span>🔒</span>
                        </button>
                        <div className="absolute hidden group-hover:block bg-[#30363D] text-[#C9D1D9] px-3 py-1.5 rounded text-xs -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg z-10">
                            Coming Soon
                        </div>
                    </div>
                    <div className="relative group">
                        <button
                            disabled
                            className="px-4 py-2 rounded-md bg-[#21262D] text-[#8B949E] opacity-50 cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.93.828-.93-953.953 1.182-6.27 2.915-2.294 4.178 10.814 3.453 19.713-1.552 14.628-3.274M9.292 13.21s-3.057.727-1.082.996c.833.115 2.49.89 4.292.099 1.343-.39 2.692-.78 2.692-.78s-.473.202-1.314.366c-3.679 1.662-10.143.889-8.223-.813 1.9-1.487 3.635-.873 3.635-.873M17.127 17.208c3.874-2.012 2.081-3.944 2.081-3.944-.516-1.219-1.27-1.82-2.34-2.119-2.08-.472-4.967-.496-6.551-.258 0 0-.29-.682 1.819-.841 2.37-.225 5.878.188 7.627 1.174 3.596 2.047-1.863 5.583-1.863 5.583l-.773.405M12.456 0s2.146 2.148-2.030 5.448c-3.35 2.641-.765 4.148-.765 4.148s-.85-1.776.469-3.219c1.392-1.516 2.668-2.29 2.326-3.652-.159-.61.077-1.737 0-2.725M9.472 23.084c3.266.207 8.275-.115 8.389-1.633 0 0-.228.577-2.695.799-2.791.252-6.238.2-8.294-.07 0 0 .419.35 2.6.904" />
                            </svg>
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
