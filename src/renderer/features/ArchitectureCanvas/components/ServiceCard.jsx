import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const ServiceCard = ({ service, view = 'grid' }) => {
    const [showPrivilegedIPs, setShowPrivilegedIPs] = useState(false);
    const [showActionWidget, setShowActionWidget] = useState(false);
    const [widgetPosition, setWidgetPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const widgetRef = useRef(null);
    const actionButtonRef = useRef(null);
    
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
    
    // Close widget when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showActionWidget && 
                widgetRef.current && 
                !widgetRef.current.contains(event.target) &&
                actionButtonRef.current && 
                !actionButtonRef.current.contains(event.target)) {
                setShowActionWidget(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showActionWidget]);
    
    const handleActionButtonClick = (e) => {
        e.stopPropagation();
        
        // Calculate the position for the widget relative to the button
        const buttonRect = e.currentTarget.getBoundingClientRect();
        const cardRect = cardRef.current.getBoundingClientRect();
        
        // Position widget above the action button
        const x = buttonRect.left - cardRect.left + buttonRect.width / 2;
        const y = buttonRect.top - cardRect.top;
        
        setWidgetPosition({ x, y });
        setShowActionWidget(!showActionWidget);
    };
    
    // Action widget component - Now rendered with Portal to escape overflow context
    const ActionWidget = () => (
        showActionWidget && createPortal(
            <motion.div
                ref={widgetRef}
                className="fixed z-50 bg-[#21262D] rounded-full shadow-lg border border-[#30363D] flex items-center p-1"
                style={{ 
                    left: cardRef.current ? cardRef.current.getBoundingClientRect().left + widgetPosition.x : 0, 
                    top: cardRef.current ? cardRef.current.getBoundingClientRect().top + widgetPosition.y - 50 : 0,
                    transform: 'translate(-50%, -50%)' 
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
            >
                {/* Removed the edit button */}
                {/* <motion.button ...> ...Edit... </motion.button> */}
                <motion.button 
                    whileHover={{ scale: 1.2 }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#30363D] text-[#8B949E] hover:text-[#58A6FF] m-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('View service details:', service.ServiceName);
                        setShowActionWidget(false);
                    }}
                    title="View details"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"/>
                        </svg>
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.2 }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#30363D] text-[#F85149] hover:text-[#FA7A74] m-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete service:', service.ServiceName);
                        setShowActionWidget(false);
                    }}
                    title="Delete service"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </motion.button>
            </motion.div>,
            document.body
        )
    );
    
    // Grid view card
    if (view === 'grid') {
        return (
            <motion.div 
                ref={cardRef}
                className="bg-[#161B22] border border-[#30363D] rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 relative"
                whileHover={{ borderColor: '#58A6FF' }}
            >
                {/* Action Widget */}
                <ActionWidget />
                
                {/* Service Header - With gradient overlay based on service type */}
                <div 
                    className="p-4 pb-4 relative"
                    style={{
                        background: `linear-gradient(to right, #161B22 80%, ${getServiceTypeColor(service.ServiceType)}20)`
                    }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
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
                    <div className="flex items-center text-[#8B949E] text-xs overflow-hidden">
                        <svg className="min-w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M9.828 3h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0113.174 14H2.825a2 2 0 01-1.991-1.819l-.637-7a2 2 0 011.991-2.181h3.982L7.5.416a1 1 0 011 0L9.828 3zm-7.002 9l.637-7h9.074l.637 7H2.826z"/>
                        </svg>
                        <span className="truncate">{service.ServiceFolderName}/{service.ServiceFileName}</span>
                    </div>
                </div>
                
                {/* Service Details */}
                <div className="px-4 pb-4">
                    {/* HTTP Server */}
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <div className="flex items-center px-2 py-1 rounded bg-[#21262D] text-xs text-[#8B949E]">
                                <span className="h-2 w-2 bg-[#3FB950] rounded-full mr-2"></span>
                                <span>HTTP Server</span>
                            </div>
                        </div>

                        <div className="flex items-center mb-2">
                            <code className="text-[#58A6FF] text-xs font-mono bg-[#0D1117] px-3 py-2 rounded w-full truncate">
                                http://{service.ServiceHttpHost}:{service.ServiceHttpPort}
                            </code>
                        </div>

                        {/* Privileged IPs */}
                        {service.ServiceHttpPriviledgedIpAddress && service.ServiceHttpPriviledgedIpAddress.length > 0 && (
                            <div className="mt-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPrivilegedIPs(!showPrivilegedIPs);
                                    }}
                                    className="flex items-center gap-2 text-[#8B949E] text-xs hover:text-[#58A6FF] transition-colors"
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
                                        className="mt-2 pl-3 border-l-2 border-[#30363D] text-[#C9D1D9] text-xs font-mono space-y-1"
                                    >
                                        {service.ServiceHttpPriviledgedIpAddress.map((ip, index) => (
                                            <div key={index} className="truncate py-0.5">{ip}</div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Service Info Tags */}
                    <div className="pt-3 border-t border-[#30363D]">
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-[#1F6FEB] bg-opacity-20 text-[#58A6FF] px-3 py-1.5 rounded-full text-xs font-medium">
                                HTTP
                            </span>
                            <span className="bg-[#21262D] text-[#C9D1D9] px-3 py-1.5 rounded-full text-xs font-medium">
                                {service.ServiceLanguage}
                            </span>
                            <span className="bg-[#21262D] text-[#C9D1D9] px-3 py-1.5 rounded-full text-xs font-medium">
                                Port: {service.ServiceHttpPort}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Action Button in bottom right corner */}
                <motion.button
                    ref={actionButtonRef}
                    className="absolute bottom-3 right-3 w-8 h-8 bg-[#30363D] rounded-full flex items-center justify-center text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#444C56] transition-colors z-10"
                    onClick={handleActionButtonClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                    </svg>
                </motion.button>
            </motion.div>
        );
    }
    
    // List view card - With edit and delete buttons
    return (
        <motion.div 
            ref={cardRef}
            className="bg-[#161B22] border border-[#30363D] rounded-lg shadow hover:shadow-md transition-all duration-200 relative"
            whileHover={{ borderColor: '#58A6FF' }}
        >
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Service Info */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#21262D] text-xl">
                        {getLanguageIcon(service.ServiceLanguage)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-[#C9D1D9] font-semibold">{service.ServiceName}</h3>
                            <span 
                                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: getServiceTypeColor(service.ServiceType) }}
                            >
                                {formatServiceType(service.ServiceType)}
                            </span>
                        </div>
                        <div className="text-[#8B949E] text-xs flex items-center">
                            <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M9.828 3h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0113.174 14H2.825a2 2 0 01-1.991-1.819l-.637-7a2 2 0 011.991-2.181h3.982L7.5.416a1 1 0 011 0L9.828 3zm-7.002 9l.637-7h9.074l.637 7H2.826z"/>
                            </svg>
                            <span className="truncate">{service.ServiceFolderName}/{service.ServiceFileName}</span>
                        </div>
                    </div>
                </div>
                
                {/* HTTP Info */}
                <div className="flex flex-1 items-center mx-4">
                    <div className="flex items-center gap-3 bg-[#0D1117] px-3 py-2 rounded-lg flex-1">
                        <span className="h-2 w-2 bg-[#3FB950] rounded-full"></span>
                        <code className="text-[#58A6FF] text-xs font-mono truncate">
                            http://{service.ServiceHttpHost}:{service.ServiceHttpPort}
                        </code>
                    </div>
                </div>
                
                {/* Tags */}
                <div className="flex items-center gap-3">
                    <span className="bg-[#21262D] text-[#C9D1D9] px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium">
                        {service.ServiceLanguage}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button 
                        className="p-2 rounded hover:bg-[#30363D] transition-colors text-[#8B949E] hover:text-[#C9D1D9]"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Edit service:', service.ServiceName);
                        }}
                        title="Edit service"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"/>
                        </svg>
                    </button>
                    <button 
                        className="p-2 rounded hover:bg-[#30363D] transition-colors text-[#F85149] hover:text-[#FA7A74]"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete service:', service.ServiceName);
                        }}
                        title="Delete service"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Privileged IPs - Collapsible section */}
            {service.ServiceHttpPriviledgedIpAddress && service.ServiceHttpPriviledgedIpAddress.length > 0 && (
                <div className="border-t border-[#30363D] px-4 py-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPrivilegedIPs(!showPrivilegedIPs);
                        }}
                        className="flex items-center gap-2 text-[#8B949E] text-xs hover:text-[#58A6FF] transition-colors w-full"
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
                            className="mt-3 pl-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
                        >
                            {service.ServiceHttpPriviledgedIpAddress.map((ip, index) => (
                                <div key={index} className="text-[#C9D1D9] text-xs font-mono bg-[#0D1117] px-3 py-2 rounded">
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



// export default ServiceCard;
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//             >
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
//                     <path d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
//                 </svg>
//             </motion.button>
//         </motion.div>
//     );
// };



export default ServiceCard;
