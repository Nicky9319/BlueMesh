import React, { useState, useRef, useEffect } from 'react';

const PythonServiceConfig = ({ onComplete }) => {
    const [selectedFramework, setSelectedFramework] = useState('fastapi');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
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
        console.log(formData);
        onComplete();
    };

    const isFormValid = () => {
        return formData.serviceName.trim() && 
               formData.host.trim() && 
               formData.port && 
               formData.port > 0;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                {/* Service Name with Framework Dropdown in a single row */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-[#C9D1D9] text-base font-medium">
                            Service Name <span className="text-[#F85149]">*</span>
                        </label>
                        
                        <label className="text-[#8B949E] text-sm">
                            Framework
                        </label>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* Service Name Input */}
                        <div className="relative flex-1">
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
                        
                        {/* Framework Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="h-full px-4 py-2.5 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] hover:bg-[#21262D] transition-all duration-200 flex items-center gap-2"
                            >
                                {selectedFramework === 'fastapi' && (
                                    <svg className="w-4 h-4 text-[#58A6FF]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12c6.616 0 12-5.383 12-12S18.616 0 12 0zm0 4.25A7.751 7.751 0 0119.75 12 7.751 7.751 0 0112 19.75 7.751 7.751 0 014.25 12 7.751 7.751 0 0112 4.25zm0 3.141L7.391 12 12 16.609 16.609 12 12 7.391z"/>
                                    </svg>
                                )}
                                <span>{selectedFramework === 'fastapi' ? 'FastAPI' : selectedFramework}</span>
                                <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-1 w-48 bg-[#161B22] border border-[#30363D] rounded-md shadow-lg z-10 py-1">
                                    <button
                                        onClick={() => {
                                            setSelectedFramework('fastapi');
                                            setDropdownOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs hover:bg-[#21262D] text-[#C9D1D9]"
                                    >
                                        <svg className="w-3 h-3 text-[#58A6FF]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12c6.616 0 12-5.383 12-12S18.616 0 12 0zm0 4.25A7.751 7.751 0 0119.75 12 7.751 7.751 0 0112 19.75 7.751 7.751 0 014.25 12 7.751 7.751 0 0112 4.25zm0 3.141L7.391 12 12 16.609 16.609 12 12 7.391z"/>
                                        </svg>
                                        FastAPI
                                    </button>
                                    
                                    <div className="group">
                                        <div className="px-3 py-2 text-xs text-[#8B949E] opacity-50 cursor-not-allowed flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M11.93.005c-.514 0-1.016.098-1.487.291-1.22.5-2.202 1.51-2.701 2.755a5.279 5.279 0 0 0-.348 1.373a79.375 79.375 0 0 0-.275 6.895 164.494 164.494 0 0 0 .025 2.193 27.983 27.983 0 0 1-4.55 1.812a9.93 9.93 0 0 0-1.651.756C.28 16.51 0 17.191 0 18.029c0 .893.203 1.42.583 1.928.38.508.94.833 1.585.96a5.893 5.893 0 0 0 1.142.04c1.76-.15 3.8-.893 6.009-2.31 2.21 1.417 4.25 2.16 6.01 2.31.38.033.762.016 1.141-.04.646-.127 1.206-.452 1.586-.96.38-.508.583-1.035.583-1.928 0-.838-.28-1.52-.943-1.95a9.926 9.926 0 0 0-1.65-.755 27.92 27.92 0 0 1-4.552-1.812c.01-.728.017-1.461.025-2.193.051-2.966.043-5.042-.275-6.895a5.517 5.517 0 0 0-.347-1.373c-.5-1.244-1.481-2.255-2.702-2.755a4.012 4.012 0 0 0-1.487-.29z"/>
                                                </svg>
                                                Django
                                            </div>
                                            <span className="text-xs">🔒</span>
                                        </div>
                                        <div className="hidden group-hover:block absolute right-full mr-2 -top-2 bg-[#30363D] text-[#C9D1D9] px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-20">
                                            Coming Soon
                                        </div>
                                    </div>
                                    
                                    <div className="group">
                                        <div className="px-3 py-2 text-xs text-[#8B949E] opacity-50 cursor-not-allowed flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M10.68 18.474c-1.154-.612-1.953-1.556-2.35-2.691-.34-.971-.376-1.858-.376-2.861 0-.91.035-1.798.375-2.769.397-1.135 1.196-2.08 2.35-2.691 1.153.611 1.952 1.556 2.35 2.691.34.971.375 1.859.375 2.769 0 1.003-.036 1.89-.375 2.861-.398 1.135-1.197 2.08-2.35 2.691z"/>
                                                </svg>
                                                Flask
                                            </div>
                                            <span className="text-xs">🔒</span>
                                        </div>
                                        <div className="hidden group-hover:block absolute right-full mr-2 -top-2 bg-[#30363D] text-[#C9D1D9] px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-20">
                                            Coming Soon
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Configuration Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Network Settings */}
                    <div className="space-y-6">
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
                                        <label className="text-[#8B949E] text-sm">
                                            Host <span className="text-[#F85149]">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="host"
                                                value={formData.host}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200"
                                            />
                                            {!formData.host.trim() && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-[#F85149] text-xs">Required</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[#8B949E] text-sm">
                                            Port <span className="text-[#F85149]">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="port"
                                                value={formData.port}
                                                onChange={handleChange}
                                                required
                                                min="1"
                                                max="65535"
                                                className="w-full px-3 py-2 bg-[#161B22] border border-[#30363D] rounded-md text-[#C9D1D9] focus:outline-none focus:ring-1 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] transition-all duration-200"
                                            />
                                            {(!formData.port || formData.port <= 0) && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-[#F85149] text-xs">Required</span>
                                                </div>
                                            )}
                                        </div>
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
                    <span className={isFormValid() ? "text-[#3FB950]" : "text-[#F85149]"}>•</span> 
                    {isFormValid() ? "Configuration ready" : "Please fill required fields"}
                </div>
                <button
                    onClick={handleAddService}
                    disabled={!isFormValid()}
                    className={`px-5 py-2.5 text-white rounded-md font-medium transition-all duration-200 flex items-center gap-2
                        ${isFormValid() 
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
