import React, { useState } from 'react';

const PythonServiceConfig = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        serviceName: '',
        host: '127.0.0.1',
        port: Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000,
        privilegeIps: ['127.0.0.1'],
        cors: true
    });

    const [newIp, setNewIp] = useState('');
    const [ipError, setIpError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateIP = (ip) => {
        const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
        return ipRegex.test(ip);
    };

    const handleAddIp = () => {
        if (!newIp.trim()) {
            setIpError('Please enter an IP address');
            return;
        }
        if (!validateIP(newIp)) {
            setIpError('Please enter a valid IP address');
            return;
        }
        if (formData.privilegeIps.includes(newIp)) {
            setIpError('IP address already exists');
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            privilegeIps: [...prev.privilegeIps, newIp]
        }));
        setNewIp('');
        setIpError('');
    };

    const handleRemoveIp = (ip) => {
        setFormData(prev => ({
            ...prev,
            privilegeIps: prev.privilegeIps.filter(item => item !== ip)
        }));
    };

    const handleAddService = () => {
        console.log('new service add functionality called');
        onComplete();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Service Name */}
                        <div className="space-y-3">
                            <label className="block text-[#C9D1D9] text-sm font-medium">
                                Service Name <span className="text-[#F85149]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="serviceName"
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-sm"
                                    placeholder="my-python-service"
                                />
                                {!formData.serviceName && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-[#F85149] text-xs">Required</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Network Configuration */}
                        <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
                            <div className="bg-[#21262D] px-5 py-3 border-b border-[#30363D]">
                                <h3 className="text-[#C9D1D9] text-sm font-semibold">Network Configuration</h3>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="block text-[#C9D1D9] text-sm">
                                            Host
                                        </label>
                                        <input
                                            type="text"
                                            name="host"
                                            value={formData.host}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="block text-[#C9D1D9] text-sm">
                                            Port
                                        </label>
                                        <input
                                            type="number"
                                            name="port"
                                            value={formData.port}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
                            <div className="bg-[#21262D] px-5 py-3 border-b border-[#30363D]">
                                <h3 className="text-[#C9D1D9] text-sm font-semibold">Security Settings</h3>
                            </div>
                            <div className="p-5">
                                <label className="flex items-start space-x-4 cursor-pointer">
                                    <div className="relative mt-0.5">
                                        <input
                                            type="checkbox"
                                            name="cors"
                                            checked={formData.cors}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded border transition-all duration-200 ${
                                            formData.cors 
                                                ? 'bg-[#1F6FEB] border-[#1F6FEB]' 
                                                : 'bg-transparent border-[#30363D]'
                                        }`}>
                                            {formData.cors && (
                                                <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[#C9D1D9] font-medium text-sm">Enable CORS</span>
                                        <p className="text-[#8B949E] text-xs mt-1">Allow cross-origin requests from web browsers</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
                            <div className="bg-[#21262D] px-5 py-3 border-b border-[#30363D]">
                                <h3 className="text-[#C9D1D9] text-sm font-semibold">Access Control</h3>
                            </div>
                            <div className="p-5 space-y-6">
                                {/* Add IP Input */}
                                <div className="space-y-2.5">
                                    <label className="block text-[#C9D1D9] text-sm">
                                        Add Privilege IP Address
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={newIp}
                                                onChange={(e) => {
                                                    setNewIp(e.target.value);
                                                    setIpError('');
                                                }}
                                                className="w-full px-3.5 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-sm"
                                                placeholder="192.168.1.1"
                                            />
                                            {ipError && (
                                                <p className="text-[#F85149] text-xs mt-1.5">{ipError}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddIp}
                                            className="px-4 py-2 bg-[#238636] hover:bg-[#2EA043] text-white rounded-md transition-colors duration-200 font-medium text-sm flex-shrink-0"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* IP List */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[#C9D1D9] text-sm">
                                            Allowed IP Addresses
                                        </label>
                                        <span className="bg-[#21262D] text-[#8B949E] text-xs px-2.5 py-1 rounded-full">
                                            {formData.privilegeIps.length} address{formData.privilegeIps.length !== 1 ? 'es' : ''}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1.5 max-h-60 overflow-y-auto border border-[#30363D] rounded-md bg-[#0D1117] p-2">
                                        {formData.privilegeIps.map((ip, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center justify-between bg-[#21262D] hover:bg-[#30363D] px-4 py-2.5 rounded-md transition-colors duration-200 group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-[#238636] rounded-full flex-shrink-0"></div>
                                                    <span className="text-[#C9D1D9] font-mono text-sm">{ip}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveIp(ip)}
                                                    className="text-[#8B949E] hover:text-[#F85149] opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 flex-shrink-0"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-[#30363D]">
                <button
                    onClick={handleAddService}
                    disabled={!formData.serviceName.trim()}
                    className={`px-5 py-2.5 text-white rounded-lg font-medium transition-all duration-200 shadow-sm text-sm
                        ${formData.serviceName.trim() 
                            ? 'bg-[#1F6FEB] hover:bg-[#58A6FF] cursor-pointer' 
                            : 'bg-[#21262D] cursor-not-allowed opacity-70'}`}
                >
                    Add Service
                </button>
            </div>
        </div>
    );
};

export default PythonServiceConfig;
