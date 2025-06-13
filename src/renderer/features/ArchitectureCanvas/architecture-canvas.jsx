import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import ServiceCard from './components/ServiceCard';

const ArchitectureCanvas = () => {
    const servicesJson = useSelector(state => state.serverServices.servicesJson);

    useEffect(() => {
        console.log('ArchitectureCanvas mounted');
        console.log('Services JSON:', servicesJson);
    },[ servicesJson ]);


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
        <div className="`font-bold mb-4 text-[#C9D1D9] text-3xl border-b border-[#30363D] pb-2">
                Architecture View
            </div>
        <div className="h-full bg-[#0D1117] text-[#C9D1D9]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#C9D1D9] mb-2">Service Architecture</h1>
                <p className="text-[#8B949E]">Overview of all services in your project</p>
            </div>

            {/* Services Grid */}
            <div className="flex-1 overflow-y-auto">
                {renderServices()}
            </div>

            {/* Statistics Footer */}
            {servicesJson && (
                <div className="mt-6 pt-4 border-t border-[#30363D]">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8B949E]">
                            Total Services: <span className="text-[#C9D1D9] font-medium">
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
            )}
        </div>
        </>
    );
};

export default ArchitectureCanvas;