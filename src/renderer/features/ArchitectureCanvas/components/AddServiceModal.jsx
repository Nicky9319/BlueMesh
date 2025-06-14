import React, { useState } from 'react';

const AddServiceModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        serviceName: '',
        serviceType: 'web',
        description: '',
        port: '',
        technology: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Add service creation logic here
        console.log('Creating service:', formData);
        onClose();
        setFormData({
            serviceName: '',
            serviceType: 'web',
            description: '',
            port: '',
            technology: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

                {/* Modal Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            {/* Service Name */}
                            <div>
                                <label className="block text-[#C9D1D9] text-sm font-medium mb-3">
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    name="serviceName"
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent text-lg"
                                    placeholder="Enter service name"
                                />
                            </div>

                            {/* Service Type */}
                            <div>
                                <label className="block text-[#C9D1D9] text-sm font-medium mb-3">
                                    Service Type
                                </label>
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent text-lg"
                                >
                                    <option value="web">Web Service</option>
                                    <option value="api">API Service</option>
                                    <option value="database">Database</option>
                                    <option value="microservice">Microservice</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Technology */}
                            <div>
                                <label className="block text-[#C9D1D9] text-sm font-medium mb-3">
                                    Technology
                                </label>
                                <input
                                    type="text"
                                    name="technology"
                                    value={formData.technology}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent text-lg"
                                    placeholder="e.g., Node.js, Python, React"
                                />
                            </div>

                            {/* Port */}
                            <div>
                                <label className="block text-[#C9D1D9] text-sm font-medium mb-3">
                                    Port
                                </label>
                                <input
                                    type="number"
                                    name="port"
                                    value={formData.port}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent text-lg"
                                    placeholder="e.g., 3000, 8080"
                                />
                            </div>

                            {/* Description - Full Width */}
                            <div className="md:col-span-2">
                                <label className="block text-[#C9D1D9] text-sm font-medium mb-3">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent resize-none text-lg"
                                    placeholder="Brief description of the service"
                                />
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex gap-4 pt-6 border-t border-[#30363D] flex-shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-[#30363D] text-[#C9D1D9] rounded-md hover:bg-[#30363D] transition-colors text-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-[#1F6FEB] hover:bg-[#58A6FF] text-white rounded-md transition-colors font-medium text-lg"
                            >
                                Create Service
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddServiceModal;
