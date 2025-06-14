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
                {/* Service Name - Full Width Header */}
                <div className="mb-10">
                    <label className="block text-[#C9D1D9] text-base font-medium mb-2">
                        Service Name <span className="text-[#F85149]">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200"
                            placeholder="Enter a name for your Python service"
                        />
                        {!formData.serviceName && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-[#F85149] text-xs">Required</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Configuration Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column - Network Settings */}
                    <div className="space-y-8">
                        {/* Network Configuration */}
                        <div className="relative rounded-lg bg-gradient-to-r from-[#161B22] to-[#0D1117] p-[1px] group">
                            <div className="rounded-lg bg-[#0D1117] p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-md bg-[#1F6FEB]/10 mr-3">
                                        <svg className="w-4 h-4 text-[#58A6FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[#C9D1D9] font-medium">Network Configuration</h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6 mt-2">
                                    <div className="space-y-1">
                                        <label className="text-[#8B949E] text-sm">Host</label>
                                        <input
                                            type="text"
                                            name="host"
                                            value={formData.host}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[#8B949E] text-sm">Port</label>
                                        <input
                                            type="number"
                                            name="port"
                                            value={formData.port}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="relative rounded-lg bg-gradient-to-r from-[#161B22] to-[#0D1117] p-[1px]">
                            <div className="rounded-lg bg-[#0D1117] p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-md bg-[#238636]/10 mr-3">
                                        <svg className="w-4 h-4 text-[#3FB950]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[#C9D1D9] font-medium">Security Settings</h3>
                                </div>
                                
                                <label className="flex items-start cursor-pointer hover:bg-[#161B22] p-2 rounded-md transition-colors">
                                    <div className="relative flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="cors"
                                            checked={formData.cors}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-10 h-5 bg-[#21262D] rounded-full transition-colors ${formData.cors ? 'bg-[#238636]' : ''}`}>
                                            <div className={`absolute w-4 h-4 rounded-full transition-transform transform bg-white ${formData.cors ? 'translate-x-5' : 'translate-x-1'}`} style={{ top: '2px' }}></div>
                                        </div>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <span className="text-[#C9D1D9] font-medium">Enable CORS</span>
                                        <p className="text-[#8B949E] text-xs mt-1 max-w-xs">
                                            Allow cross-origin requests from web browsers for better frontend integration
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Access Control */}
                    <div>
                        <div className="relative rounded-lg bg-gradient-to-r from-[#161B22] to-[#0D1117] p-[1px] h-full">
                            <div className="rounded-lg bg-[#0D1117] p-6 h-full flex flex-col">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-md bg-[#DA3633]/10 mr-3">
                                        <svg className="w-4 h-4 text-[#F85149]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[#C9D1D9] font-medium">Access Control</h3>
                                </div>

                                {/* Add IP Input */}
                                <div className="space-y-1">
                                    <label className="text-[#8B949E] text-sm">Add Privilege IP Address</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newIp}
                                            onChange={(e) => {
                                                setNewIp(e.target.value);
                                                setIpError('');
                                            }}
                                            className="flex-1 px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] placeholder-[#8B949E] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200"
                                            placeholder="192.168.1.1"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddIp}
                                            className="px-3 py-2 bg-[#238636] hover:bg-[#2EA043] text-white rounded-md transition-colors duration-200"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {ipError && (
                                        <p className="text-[#F85149] text-xs mt-1">{ipError}</p>
                                    )}
                                </div>

                                {/* IP List */}
                                <div className="mt-4 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[#8B949E] text-sm">Allowed IP Addresses</label>
                                        <span className="bg-[#21262D] text-[#8B949E] text-xs px-2 py-0.5 rounded-full">
                                            {formData.privilegeIps.length}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1 flex-1 overflow-y-auto border border-[#30363D] rounded-md bg-[#0D1117] p-1">
                                        {formData.privilegeIps.length === 0 ? (
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-[#8B949E] text-sm">No IP addresses added</p>
                                            </div>
                                        ) : (
                                            formData.privilegeIps.map((ip, index) => (
                                                <div 
                                                    key={index} 
                                                    className="flex items-center justify-between bg-[#21262D] hover:bg-[#30363D] px-3 py-2 rounded-md transition-colors duration-200 group"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-1 h-1 bg-[#3FB950] rounded-full mr-2"></div>
                                                        <span className="text-[#C9D1D9] font-mono text-sm">{ip}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveIp(ip)}
                                                        className="text-[#8B949E] hover:text-[#F85149] opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        aria-label="Remove IP address"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#30363D]">
                <div className="text-[#8B949E] text-sm">
                    <span className="text-[#3FB950]">•</span> Configuration ready
                </div>
                <button
                    onClick={handleAddService}
                    disabled={!formData.serviceName.trim()}
                    className={`px-5 py-2.5 text-white rounded-md font-medium transition-all duration-200 flex items-center gap-2
                        ${formData.serviceName.trim() 
                            ? 'bg-[#1F6FEB] hover:bg-[#58A6FF]' 
                            : 'bg-[#21262D] cursor-not-allowed opacity-70'}`}
                >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Create Python Service
                </button>
            </div>
        </div>
    );
};

export default PythonServiceConfig;
