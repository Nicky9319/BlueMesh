import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ service, view = 'grid' }) => {
    const [showPrivilegedIPs, setShowPrivilegedIPs] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const getServiceTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'http_merge':
            case 'api':
            case 'rest':
                return '#1F6FEB'; // Primary Accent
            case 'http_service':
                return '#3FB950'; // Success Green
            case 'database':
            case 'db':
                return '#3FB950'; // Success Green
            case 'cache':
            case 'redis':
                return '#D29922'; // Warning Yellow
            case 'queue':
            case 'messaging':
                return '#F85149'; // Error Red
            case 'websocket':
            case 'ws':
                return '#58A6FF'; // Secondary Accent
            default:
                return '#58A6FF'; // Secondary Accent
        }
    };

    const getLanguageIcon = (language) => {
        switch (language?.toLowerCase()) {
            case 'python':
                return '🐍';
            case 'javascript':
            case 'node.js':
                return '⚡';
            case 'java':
                return '☕';
            case 'go':
                return '🐹';
            case 'rust':
                return '🦀';
            default:
                return '💻';
        }
    };

    const formatServiceType = (type) => {
        return type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Service';
    };
    
    // Grid view card
    if (view === 'grid') {
        return (
            <motion.div 
                className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, borderColor: '#58A6FF' }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {/* Service Header - With gradient overlay based on service type */}
                <div 
                    className="p-4 pb-3 relative"
                    style={{
                        background: `linear-gradient(to right, #161B22 80%, ${getServiceTypeColor(service.ServiceType)}20)`
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#21262D] text-lg">
                                {getLanguageIcon(service.ServiceLanguage)}
                            </div>
                            <h3 className="text-[#C9D1D9] font-semibold text-lg">{service.ServiceName}</h3>
                        </div>
                        <span 
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: getServiceTypeColor(service.ServiceType) }}
                        >
                            {formatServiceType(service.ServiceType)}
                        </span>
                    </div>
                    
                    {/* Service Path Info */}
                    <div className="mt-2 flex items-center text-[#8B949E] text-xs overflow-hidden">
                        <svg className="min-w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M9.828 3h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0113.174 14H2.825a2 2 0 01-1.991-1.819l-.637-7a2 2 0 011.991-2.181h3.982L7.5.416a1 1 0 011 0L9.828 3zm-7.002 9l.637-7h9.074l.637 7H2.826z"/>
                        </svg>
                        <span className="truncate">{service.ServiceFolderName}/{service.ServiceFileName}</span>
                    </div>
                </div>
                
                {/* Service Details */}
                <div className="p-4 pt-2">
                    {/* HTTP Server */}
                    <div className="mb-3">
                        <div className="flex items-center mb-1">
                            <div className="flex items-center px-2 py-0.5 rounded bg-[#21262D] text-xs text-[#8B949E]">
                                <span className="h-2 w-2 bg-[#3FB950] rounded-full mr-1.5"></span>
                                <span>HTTP Server</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <code className="text-[#58A6FF] text-xs font-mono bg-[#0D1117] px-2 py-1 rounded w-full truncate">
                                http://{service.ServiceHttpHost}:{service.ServiceHttpPort}
                            </code>
                        </div>

                        {/* Privileged IPs */}
                        {service.ServiceHttpPriviledgedIpAddress && service.ServiceHttpPriviledgedIpAddress.length > 0 && (
                            <div className="mt-1.5">
                                <button
                                    onClick={() => setShowPrivilegedIPs(!showPrivilegedIPs)}
                                    className="flex items-center gap-1 text-[#8B949E] text-xs hover:text-[#58A6FF] transition-colors"
                                >
                                    <svg className={`w-3 h-3 transition-transform ${showPrivilegedIPs ? 'rotate-90' : ''}`} 
                                         fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z"/>
                                    </svg>
                                    <span>Privileged IPs ({service.ServiceHttpPriviledgedIpAddress.length})</span>
                                </button>
                                {showPrivilegedIPs && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-1.5 pl-2 border-l-2 border-[#30363D] text-[#C9D1D9] text-xs font-mono space-y-1"
                                    >
                                        {service.ServiceHttpPriviledgedIpAddress.map((ip, index) => (
                                            <div key={index} className="truncate">{ip}</div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Service Info Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#30363D]">
                        <span className="bg-[#1F6FEB] bg-opacity-20 text-[#58A6FF] px-2 py-1 rounded-full text-xs">
                            HTTP
                        </span>
                        <span className="bg-[#21262D] text-[#C9D1D9] px-2 py-1 rounded-full text-xs">
                            {service.ServiceLanguage}
                        </span>
                        <span className="bg-[#21262D] text-[#C9D1D9] px-2 py-1 rounded-full text-xs">
                            Port: {service.ServiceHttpPort}
                        </span>
                    </div>
                </div>
                
                {/* Quick Action Footer - Shows on hover */}
                <motion.div 
                    className="flex items-center gap-2 p-3 bg-[#21262D] justify-end border-t border-[#30363D]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
                >
                    <button className="text-[#8B949E] hover:text-[#C9D1D9] p-1.5 rounded hover:bg-[#30363D] transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"/>
                        </svg>
                    </button>
                    <button className="text-[#8B949E] hover:text-[#C9D1D9] p-1.5 rounded hover:bg-[#30363D] transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 118 0a8 8 0 010 16z"/>
                            <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/>
                        </svg>
                    </button>
                    <button className="text-[#F85149] hover:text-[#F85149] p-1.5 rounded hover:bg-[#30363D] transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </motion.div>
            </motion.div>
        );
    }
    
    // List view card
    return (
        <motion.div 
            className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-200"
            whileHover={{ borderColor: '#58A6FF' }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Service Info */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#21262D] text-xl">
                        {getLanguageIcon(service.ServiceLanguage)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-[#C9D1D9] font-semibold">{service.ServiceName}</h3>
                            <span 
                                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: getServiceTypeColor(service.ServiceType) }}
                            >
                                {formatServiceType(service.ServiceType)}
                            </span>
                        </div>
                        <div className="text-[#8B949E] text-xs mt-0.5 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M9.828 3h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0113.174 14H2.825a2 2 0 01-1.991-1.819l-.637-7a2 2 0 011.991-2.181h3.982L7.5.416a1 1 0 011 0L9.828 3zm-7.002 9l.637-7h9.074l.637 7H2.826z"/>
                            </svg>
                            <span className="truncate">{service.ServiceFolderName}/{service.ServiceFileName}</span>
                        </div>
                    </div>
                </div>
                
                {/* HTTP Info */}
                <div className="flex flex-1 items-center">
                    <div className="flex items-center gap-2 bg-[#0D1117] px-3 py-2 rounded-lg flex-1">
                        <span className="h-2 w-2 bg-[#3FB950] rounded-full"></span>
                        <code className="text-[#58A6FF] text-xs font-mono truncate">
                            http://{service.ServiceHttpHost}:{service.ServiceHttpPort}
                        </code>
                    </div>
                </div>
                
                {/* Tags */}
                <div className="flex items-center gap-2">
                    <span className="bg-[#21262D] text-[#C9D1D9] px-2 py-1 rounded-full text-xs whitespace-nowrap">
                        {service.ServiceLanguage}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-[#30363D] transition-colors text-[#8B949E] hover:text-[#C9D1D9]">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
                                </svg>
                        </button>
                        <button className="p-1.5 rounded hover:bg-[#30363D] transition-colors text-[#F85149]">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Privileged IPs - Collapsible section */}
            {service.ServiceHttpPriviledgedIpAddress && service.ServiceHttpPriviledgedIpAddress.length > 0 && (
                <div className="border-t border-[#30363D] px-4 py-2">
                    <button
                        onClick={() => setShowPrivilegedIPs(!showPrivilegedIPs)}
                        className="flex items-center gap-1 text-[#8B949E] text-xs hover:text-[#58A6FF] transition-colors w-full"
                    >
                        <svg className={`w-3 h-3 transition-transform ${showPrivilegedIPs ? 'rotate-90' : ''}`} 
                             fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z"/>
                        </svg>
                        <span>Privileged IPs ({service.ServiceHttpPriviledgedIpAddress.length})</span>
                    </button>
                    {showPrivilegedIPs && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 pl-4 grid grid-cols-1 sm:grid-cols-2 gap-1"
                        >
                            {service.ServiceHttpPriviledgedIpAddress.map((ip, index) => (
                                <div key={index} className="text-[#C9D1D9] text-xs font-mono bg-[#0D1117] px-2 py-1 rounded">
                                    {ip}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default ServiceCard;
