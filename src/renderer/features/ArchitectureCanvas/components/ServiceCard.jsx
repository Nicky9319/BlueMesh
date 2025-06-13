import React, { useState } from 'react';

const ServiceCard = ({ service }) => {
    console.log('Rendering ServiceCard for:', service);
    const [showPrivilegedIPs, setShowPrivilegedIPs] = useState(false);
    
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

    return (
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 hover:border-[#58A6FF] transition-colors duration-200 shadow-lg">
            {/* Service Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{getLanguageIcon(service.ServiceLanguage)}</span>
                    <h3 className="text-[#C9D1D9] font-semibold text-lg">{service.ServiceName}</h3>
                </div>
                <span 
                    className="px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getServiceTypeColor(service.ServiceType) }}
                >
                    {formatServiceType(service.ServiceType)}
                </span>
            </div>

            {/* Service File Info */}
            <div className="mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-[#8B949E] text-xs">📁</span>
                    <span className="text-[#C9D1D9] text-sm font-mono">{service.ServiceFileName}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#8B949E] text-xs">📂</span>
                    <span className="text-[#8B949E] text-xs">{service.ServiceFolderName}</span>
                </div>
            </div>

            {/* Service Details */}
            <div className="space-y-2">
                {/* HTTP Configuration */}
                <div className="bg-[#30363D] rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[#8B949E] text-xs font-medium">HTTP Server:</span>
                        <span className="text-[#3FB950] text-xs">●</span>
                    </div>
                    <div className="text-[#58A6FF] text-xs font-mono">
                        http://{service.ServiceHttpHost}:{service.ServiceHttpPort}
                    </div>
                    {service.ServiceHttpPriviledgedIpAddress && service.ServiceHttpPriviledgedIpAddress.length > 0 && (
                        <div className="mt-1">
                            <button
                                onClick={() => setShowPrivilegedIPs(!showPrivilegedIPs)}
                                className="flex items-center gap-1 text-[#8B949E] text-xs hover:text-[#58A6FF] transition-colors"
                            >
                                <span>Privileged IPs ({service.ServiceHttpPriviledgedIpAddress.length})</span>
                                <span className={`transform transition-transform ${showPrivilegedIPs ? 'rotate-90' : ''}`}>
                                    ▶
                                </span>
                            </button>
                            {showPrivilegedIPs && (
                                <div className="mt-1 pl-2 border-l-2 border-[#58A6FF]">
                                    {service.ServiceHttpPriviledgedIpAddress.map((ip, index) => (
                                        <div key={index} className="text-[#C9D1D9] text-xs font-mono">
                                            {ip}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Language */}
                <div className="flex items-center justify-between">
                    <span className="text-[#8B949E] text-xs">Language:</span>
                    <span className="text-[#C9D1D9] text-xs font-medium">{service.ServiceLanguage}</span>
                </div>
            </div>

            {/* Service Features */}
            <div className="mt-3 pt-3 border-t border-[#30363D]">
                <div className="flex flex-wrap gap-1">
                    <span className="bg-[#1F6FEB] text-white px-2 py-1 rounded text-xs">
                        HTTP
                    </span>
                    <span className="bg-[#30363D] text-[#C9D1D9] px-2 py-1 rounded text-xs">
                        {service.ServiceLanguage}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
