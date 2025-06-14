import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ServiceCard from './components/ServiceCard';
import AddServiceModal from '../AddService/AddServiceModal';
import { motion } from 'framer-motion';

const ArchitectureCanvas = () => {
    const servicesJson = useSelector(state => state.serverServices.servicesJson);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState('grid');

    useEffect(() => {
        // console.log('ArchitectureCanvas mounted');
        // console.log('Services JSON:', servicesJson);
    }, [servicesJson]);

    const renderEmptyState = (title, message) => (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-64 w-full"
        >
            <div className="text-center max-w-md bg-[#161B22] p-8 rounded-lg border border-[#30363D]">
                <div className="text-[#8B949E] text-6xl mb-4">🏗️</div>
                <div className="text-[#C9D1D9] text-xl font-semibold mb-2">{title}</div>
                <div className="text-[#8B949E] text-sm">{message}</div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-[#1F6FEB]/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Service
                </button>
            </div>
        </motion.div>
    );

    const renderServices = () => {
        if (!servicesJson) {
            // console.log("No servicesJson available");
            return renderEmptyState(
                "No services data available", 
                "Load a project to view service architecture"
            );
        }

        // console.log("servicesJson", servicesJson);
        // console.log("typeof", typeof servicesJson, "Array?", Array.isArray(servicesJson));

        const services = Array.isArray(servicesJson) ? servicesJson : [];

        if (services.length === 0) {
            return renderEmptyState(
                "No services found",
                "This project doesn't contain any service definitions"
            );
        }

        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={view === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "flex flex-col space-y-4"
                }
            >
                {services.map((service, index) => (
                    <motion.div 
                        key={service.ServiceName || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ServiceCard service={service} view={view} />
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="px-6 py-5 border-b border-[#30363D] bg-[#0D1117]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div>
                        <h1 className='font-bold text-[#C9D1D9] text-3xl mb-1 flex items-center'>
                            <span className="mr-2">🔮</span>Architecture View
                        </h1>
                        <p className="text-[#8B949E] text-sm">Manage and visualize your service architecture</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View toggle */}
                        {servicesJson && Array.isArray(servicesJson) && servicesJson.length > 0 && (
                            <div className="flex bg-[#21262D] p-1 rounded-lg">
                                <button 
                                    onClick={() => setView('grid')}
                                    className={`p-2 rounded ${view === 'grid' 
                                        ? 'bg-[#30363D] text-[#C9D1D9]' 
                                        : 'text-[#8B949E] hover:text-[#C9D1D9]'}`}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5v-3z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => setView('list')}
                                    className={`p-2 rounded ${view === 'list' 
                                        ? 'bg-[#30363D] text-[#C9D1D9]' 
                                        : 'text-[#8B949E] hover:text-[#C9D1D9]'}`}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M2 2.5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h12a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5H2zm0 5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h12a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5H2zm0 5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h12a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5H2z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-[#1F6FEB]/20"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Service
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 bg-[#0D1117] text-[#C9D1D9]">
                <div className="max-w-7xl mx-auto">
                    {renderServices()}
                </div>
            </div>

            {/* Statistics Footer */}
            {servicesJson && Array.isArray(servicesJson) && servicesJson.length > 0 && (
                <div className="py-4 px-6 border-t border-[#30363D] bg-[#0D1117]">
                    <div className="flex items-center justify-between text-sm max-w-7xl mx-auto">
                        <div className="flex items-center gap-6">
                            <span className="text-[#8B949E] flex items-center">
                                <svg className="w-4 h-4 mr-1 text-[#58A6FF]" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M14.5 3a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h13zm-13-1A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13z" />
                                    <path d="M3 5.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM3 8a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9A.5.5 0 013 8zm0 2.5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5z" />
                                </svg>
                                Services: <span className="ml-1 text-[#C9D1D9] font-medium bg-[#21262D] px-2 py-1 rounded">
                                    {servicesJson.length}
                                </span>
                            </span>
                            <span className="text-[#8B949E] flex items-center">
                                <svg className="w-4 h-4 mr-1 text-[#58A6FF]" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zm0 1a2 2 0 012 2v6a2 2 0 11-4 0V5a2 2 0 012-2z" />
                                    <path d="M1.5 5a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm4.5 8a4 4 0 004-4V5a4 4 0 00-8 0v4a4 4 0 004 4zm0 1a5 5 0 01-5-5V5a5 5 0 0110 0v4a5 5 0 01-5 5z" />
                                </svg>
                                Last Updated: <span className="ml-1 text-[#C9D1D9]">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Service Modal */}
            <AddServiceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default ArchitectureCanvas;