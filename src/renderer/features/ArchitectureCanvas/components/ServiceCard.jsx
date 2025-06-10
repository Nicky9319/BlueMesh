import React from 'react';

const ServiceCard = ({ service }) => {
    console.log('Rendering ServiceCard for:', service);
    
    const getServiceTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'http_queue_merge':
            case 'api':
            case 'rest':
                return '#1F6FEB'; // Primary Accent
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
                {service.ServiceHttpHost && service.ServiceHttpPort && (
                    <div className="bg-[#30363D] rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[#8B949E] text-xs font-medium">HTTP Endpoint:</span>
                            <span className="text-[#3FB950] text-xs">●</span>
                        </div>
                        <div className="text-[#58A6FF] text-xs font-mono">
                            http://{service.ServiceHttpHost}:{service.ServiceHttpPort}
                        </div>
                    </div>
                )}

                {/* WebSocket Configuration */}
                {service.ServiceWsHost && service.ServiceWsPort && (
                    <div className="bg-[#30363D] rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[#8B949E] text-xs font-medium">WebSocket:</span>
                            <span className="text-[#3FB950] text-xs">●</span>
                        </div>
                        <div className="text-[#58A6FF] text-xs font-mono">
                            ws://{service.ServiceWsHost}:{service.ServiceWsPort}
                        </div>
                    </div>
                )}

                {/* Language */}
                <div className="flex items-center justify-between">
                    <span className="text-[#8B949E] text-xs">Language:</span>
                    <span className="text-[#C9D1D9] text-xs font-medium">{service.ServiceLanguage}</span>
                </div>

                {/* Message Queue Support */}
                {service.ServiceMessageQueue !== undefined && (
                    <div className="flex items-center justify-between">
                        <span className="text-[#8B949E] text-xs">Message Queue:</span>
                        <span className={`text-xs font-medium ${
                            service.ServiceMessageQueue ? 'text-[#3FB950]' : 'text-[#8B949E]'
                        }`}>
                            {service.ServiceMessageQueue ? '✓ Enabled' : '✗ Disabled'}
                        </span>
                    </div>
                )}
            </div>

            {/* Service Features */}
            <div className="mt-3 pt-3 border-t border-[#30363D]">
                <div className="flex flex-wrap gap-1">
                    {service.ServiceHttpHost && (
                        <span className="bg-[#1F6FEB] text-white px-2 py-1 rounded text-xs">
                            HTTP
                        </span>
                    )}
                    {service.ServiceWsHost && (
                        <span className="bg-[#58A6FF] text-white px-2 py-1 rounded text-xs">
                            WebSocket
                        </span>
                    )}
                    {service.ServiceMessageQueue && (
                        <span className="bg-[#F85149] text-white px-2 py-1 rounded text-xs">
                            Queue
                        </span>
                    )}
                    <span className="bg-[#30363D] text-[#C9D1D9] px-2 py-1 rounded text-xs">
                        {service.ServiceLanguage}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
