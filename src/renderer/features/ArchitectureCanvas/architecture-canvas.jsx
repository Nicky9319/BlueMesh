import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ServiceCard from './components/ServiceCard';
import AddServiceModal from './components/AddServiceModal';

const ArchitectureCanvas = () => {
    const servicesJson = useSelector(state => state.serverServices.servicesJson);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log('ArchitectureCanvas mounted');
        console.log('Services JSON:', servicesJson);
    }, [servicesJson]);

    const renderServices = () => {
        if (!servicesJson) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-[#8B949E] text-lg mb-2">No services data available</div>
                        <div className="text-[#8B949E] text-sm">Load a project to view service architecture</div>
                    </div>
                </div>
            );
        }

        const services = Array.isArray(servicesJson) ? servicesJson : [];

        if (services.length === 0) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-[#8B949E] text-lg mb-2">No services found</div>
                        <div className="text-[#8B949E] text-sm">This project doesn't contain any service definitions</div>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {services.map((service, index) => (
                    <ServiceCard key={service.ServiceName || index} service={service} />
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-row items-center mb-6 border-b border-[#30363D] pb-4 w-full justify-between">
                <div>
                    <h1 className='font-bold text-[#C9D1D9] text-4xl mb-1'>Architecture View</h1>
                    <p className="text-[#8B949E] text-sm">Manage and visualize your service architecture</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#1F6FEB] hover:bg-[#58A6FF] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Service
                </button>
            </div>
            <div className="bg-[#0D1117] text-[#C9D1D9]">
                {/* Services Grid */}
                <div>
                    {renderServices()}
                </div>

                {/* Statistics Footer */}
                {servicesJson && (
                    <div className="mt-8 pt-6 border-t border-[#30363D] w-full flex justify-center">
                        <div className="flex items-center justify-between text-sm max-w-7xl w-full px-4">
                            <div className="flex items-center gap-6">
                                <span className="text-[#8B949E]">
                                    Total Services: <span className="text-[#C9D1D9] font-medium bg-[#30363D] px-2 py-1 rounded">
                                        {Array.isArray(servicesJson) ? servicesJson.length : 0}
                                    </span>
                                </span>
                                <span className="text-[#8B949E]">
                                    Last Updated: <span className="text-[#C9D1D9]">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Service Modal */}
            <AddServiceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
};

export default ArchitectureCanvas;