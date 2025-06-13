import React, { useState, useEffect, useRef } from 'react';
import ConsoleSidebar from './components/ConsoleSidebar';
import ConsoleMainArea from './components/ConsoleMainArea';

const Console = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const consoleEndRef = useRef(null);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const handleServerFileReload = (event, data) => {
            console.log("server reload Event Triggered in Console/Console");
            // Add any specific logic for file reload here if needed
        };

        if (window.api && window.api.onServerFileReload) {
            window.api.onServerFileReload(handleServerFileReload);
            console.log('[Console/Console] Subscribed to server:file-reload event');
        } else {
            console.warn('[Console/Console] window.api.onServerFileReload is not available');
        }

        // Cleanup listener on unmount
        return () => {
            if (window.api && window.api.removeServerFileReloadListener) {
                window.api.removeServerFileReloadListener();
                console.log('[Console/Console] Unsubscribed from server:file-reload event');
            }
        };
    }, []);

    const scrollToBottom = () => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    // Toggle sidebar function
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Callback for when a service is selected in the sidebar
    const handleServiceSelect = (serviceId, serviceData) => {
        setSelectedService(serviceId);
        setTimeout(scrollToBottom, 50);
    };

    return (
        <div className="h-full bg-[#0D1117] text-[#C9D1D9] flex overflow-hidden">
            {/* Sidebar */}
            <ConsoleSidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                onServiceSelect={handleServiceSelect}
                selectedService={selectedService}
            />


            {/* Main Console Area with Toggle Button */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Header with Toggle Button */}
                <div className="p-4 border-b border-[#30363D] flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Add sidebar toggle button */}
                        <button 
                            onClick={toggleSidebar}
                            className="p-1.5 rounded hover:bg-[#30363D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={sidebarOpen 
                                    ? "M18 6L6 18M6 6l12 12" // X icon when sidebar is open
                                    : "M4 6h16M4 12h16M4 18h16" // Menu icon when sidebar is closed
                                } />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-[#C9D1D9]">Console</h1>
                            <p className="text-sm text-[#8B949E]">View application logs and debug information</p>
                        </div>
                    </div>
                </div>

                <ConsoleMainArea
                    selectedServiceId={selectedService}
                    consoleEndRef={consoleEndRef}
                />
            </div>
        </div>
    );
};

export default Console;