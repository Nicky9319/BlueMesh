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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12"> {/* Increased gap-y-12 */}
                    {/* Left Column */}
                    <div className="flex flex-col space-y-12"> {/* Increased space-y-12 */}
                        {/* Service Name */}
                        <div className="space-y-2">
                            <label className="block text-[#C9D1D9] text-base font-semibold pb-1">
                                Service Name <span className="text-[#F85149]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="serviceName"
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-base"
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
                        <div className="space-y-6 pt-4"> {/* Added pt-4 */}
                            <h3 className="text-[#C9D1D9] text-base font-semibold mb-2">Network Configuration</h3> {/* Added mb-2 */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[#C9D1D9] text-sm font-medium">
                                        Host
                                    </label>
                                    <input
                                        type="text"
                                        name="host"
                                        value={formData.host}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[#C9D1D9] text-sm font-medium">
                                        Port
                                    </label>
                                    <input
                                        type="number"
                                        name="port"
                                        value={formData.port}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="space-y-4 pt-4"> {/* Added pt-4 */}
                            <h3 className="text-[#C9D1D9] text-base font-semibold mb-2">Security Settings</h3> {/* Added mb-2 */}
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="cors"
                                    checked={formData.cors}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#1F6FEB] bg-[#0D1117] border-[#30363D] rounded focus:ring-[#1F6FEB] focus:ring-1"
                                />
                                <div>
                                    <span className="text-[#C9D1D9] font-medium text-base">Enable CORS</span>
                                    <p className="text-[#8B949E] text-xs mt-1">Allow cross-origin requests from web browsers</p>
                                </div>
                            </label>
                        </div>
                        
                    </div>

                    {/* Right Column - Access Control */}
                    <div className="flex flex-col space-y-10 lg:pl-8"> {/* Increased space-y-10 */}
                        <div>
                            <h3 className="text-[#C9D1D9] text-base font-semibold mb-4">Access Control</h3> {/* Increased mb-4 */}
                            {/* Add IP Input */}
                            <div className="space-y-2 mb-10"> {/* Increased mb-10 */}
                                <label className="block text-[#C9D1D9] text-sm font-medium mb-1">
                                    Add Privilege IP Address
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newIp}
                                        onChange={(e) => {
                                            setNewIp(e.target.value);
                                            setIpError('');
                                        }}
                                        className="flex-1 px-3.5 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200 text-base"
                                        placeholder="192.168.1.1"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddIp}
                                        className="px-4 py-2 bg-[#238636] hover:bg-[#2EA043] text-white rounded-md transition-colors duration-200 font-medium text-base"
                                    >
                                        Add
                                    </button>
                                </div>
                                {ipError && (
                                    <p className="text-[#F85149] text-xs mt-1.5">{ipError}</p>
                                )}
                            </div>

                            {/* IP List */}
                            <div className="space-y-2 mt-6"> {/* Increased mt-6 */}
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-[#C9D1D9] text-sm font-medium">
                                        Allowed IP Addresses
                                    </label>
                                    <span className="bg-[#21262D] text-[#8B949E] text-xs px-2.5 py-1 rounded-full">
                                        {formData.privilegeIps.length} address{formData.privilegeIps.length !== 1 ? 'es' : ''}
                                    </span>
                                </div>
                                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                                    {formData.privilegeIps.map((ip, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between bg-[#21262D] hover:bg-[#30363D] px-4 py-2.5 rounded-md transition-colors duration-200 group"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-[#238636] rounded-full flex-shrink-0"></div>
                                                <span className="text-[#C9D1D9] font-mono text-base">{ip}</span>
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

            {/* Action Button */}
            <div className="flex justify-end mt-16 pt-12 border-t border-[#30363D]"> {/* Increased mt-16 and pt-12 */}
                <button
                    onClick={handleAddService}
                    disabled={!formData.serviceName.trim()}
                    className={`px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 shadow-sm text-base
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
