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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#C9D1D9]">Add New Service</h2>
                    <button 
                        onClick={onClose}
                        className="text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Service Name */}
                    <div>
                        <label className="block text-[#C9D1D9] text-sm font-medium mb-2">
                            Service Name *
                        </label>
                        <input
                            type="text"
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent"
                            placeholder="Enter service name"
                        />
                    </div>

                    {/* Service Type */}
                    <div>
                        <label className="block text-[#C9D1D9] text-sm font-medium mb-2">
                            Service Type
                        </label>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent"
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
                        <label className="block text-[#C9D1D9] text-sm font-medium mb-2">
                            Technology
                        </label>
                        <input
                            type="text"
                            name="technology"
                            value={formData.technology}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent"
                            placeholder="e.g., Node.js, Python, React"
                        />
                    </div>

                    {/* Port */}
                    <div>
                        <label className="block text-[#C9D1D9] text-sm font-medium mb-2">
                            Port
                        </label>
                        <input
                            type="number"
                            name="port"
                            value={formData.port}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent"
                            placeholder="e.g., 3000, 8080"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[#C9D1D9] text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-transparent resize-none"
                            placeholder="Brief description of the service"
                        />
                    </div>

                    {/* Modal Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-[#30363D] text-[#C9D1D9] rounded-md hover:bg-[#30363D] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-[#1F6FEB] hover:bg-[#58A6FF] text-white rounded-md transition-colors font-medium"
                        >
                            Create Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceModal;
