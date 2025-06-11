import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// New internal ServiceItem component for modularity
function ServiceItem({ service, isSelected, onSelect, getServiceIcon, getServiceStatus }) {
	const status = getServiceStatus(service);
	return (
		<div
			onClick={onSelect}
			className={`text-xs py-2 px-2 mx-1 rounded cursor-pointer flex items-center justify-between group transition-all ${
				isSelected 
					? 'bg-[#1F6FEB]/20 text-[#C9D1D9] border border-[#1F6FEB]/30' 
					: 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#21262D]'
			}`}
		>
			<div className="flex items-center gap-2 min-w-0 flex-1">
				<div className={`w-2 h-2 rounded-full ${status.color} flex-shrink-0`}></div>
				<div className="text-[#8B949E] opacity-70 flex-shrink-0">
					{getServiceIcon(service.ServiceType)}
				</div>
				<span className="truncate font-medium">
					{service.ServiceName || 'Unknown Service'}
				</span>
			</div>
			<div className="flex items-center gap-1 text-xs opacity-60">
				{service.ServiceLanguage && (
					<span className="bg-[#30363D] px-1.5 py-0.5 rounded text-[10px]">
						{service.ServiceLanguage}
					</span>
				)}
				{service.ServiceHttpPort && (
					<span className="text-[10px] text-[#8B949E]">
						:{service.ServiceHttpPort}
					</span>
				)}
			</div>
		</div>
	);
}

const ConsoleSidebar = ({ 
    isOpen, 
    onToggle, 
    onServiceSelect = () => {}, 
    onConsoleUpdate = () => {},
    selectedService = null 
}) => {
    const [expandedSections, setExpandedSections] = useState({
        allServices: true,
        miscellaneous: true
    });
    const [selectedItem, setSelectedItem] = useState(null);

    // Load servicesJson from serverServices slice
    const servicesJson = useSelector(state => state.serverServices.servicesJson);
    const services = Array.isArray(servicesJson) ? servicesJson : (servicesJson?.services || []);
    const servicesState = useSelector(state => state.serverServices.services);

    // Sync internal selected state with parent component
    useEffect(() => {
        if (selectedService && selectedService !== selectedItem) {
            setSelectedItem(selectedService);
        }
    }, [selectedService]);

    useEffect(() => {
		const handleServerFileReload = (event, data) => {
			console.log("server reload Event Triggered in Console/ConsoleSidebar");
			// Add any specific logic for file reload here if needed
		};

		if (window.api && window.api.onServerFileReload) {
			window.api.onServerFileReload(handleServerFileReload);
			console.log('[Console/ConsoleSidebar] Subscribed to server:file-reload event');
		} else {
			console.warn('[Console/ConsoleSidebar] window.api.onServerFileReload is not available');
		}

		// Cleanup listener on unmount
		return () => {
			if (window.api && window.api.removeServerFileReloadListener) {
				window.api.removeServerFileReloadListener();
				console.log('[Console/ConsoleSidebar] Unsubscribed from server:file-reload event');
			}
		};
	}, []);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Helper to handle service selection
    const handleServiceSelect = (itemId, serviceData) => {
        setSelectedItem(itemId);

        // Always fetch the latest output from the slice
        let output = '';
        if (itemId === 'collective-logs') {
            const collective = servicesState.find(s => s.id === 'collective-logs');
            output = collective ? collective.consoleOutput : '';
        } else {
            const serviceId = serviceData?.ServiceName || itemId;
            const found = servicesState.find(s => s.id === serviceId);
            output = found ? found.consoleOutput : '';
        }
        // Send the full output to parent (for tab change)
        onServiceSelect(itemId, serviceData, output);
    };

	const getServiceIcon = (serviceType) => {
		switch (serviceType) {
			case 'HTTP_QUEUE_MERGE':
				return (
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<circle cx="12" cy="12" r="3" strokeWidth="2" />
						<path d="M12 1v6m0 6v6" strokeWidth="2" />
						<path d="m21 12-6-6-6 6-6-6" strokeWidth="2" />
					</svg>
				);
			default:
				return (
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
						<line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
						<line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
					</svg>
				);
		}
	};

	const getServiceStatus = (service) => {
		if (service.ServiceHttpPort || service.ServiceWsPort) {
			return { status: 'running', color: 'bg-green-500' };
		}
		return { status: 'stopped', color: 'bg-gray-500' };
	};

	return (
		<div 
			className={`bg-[#161B22] border-r border-[#30363D] transition-all duration-300 flex flex-col h-full overflow-hidden`}
			style={{
				width: isOpen ? '288px' : '0px', // Use exact pixels for smooth transition
				minWidth: isOpen ? '288px' : '0px',
				maxWidth: isOpen ? '288px' : '0px',
				opacity: isOpen ? 1 : 0,
				visibility: isOpen ? 'visible' : 'hidden' // Add visibility for proper hiding
			}}
		>
			{isOpen && (
				<>
					{/* Header */}
					<div className="p-4 border-b border-[#30363D]">
						<h2 className="text-sm font-semibold text-[#C9D1D9] mb-1">Console Explorer</h2>
						<p className="text-xs text-[#8B949E]">Services and logs overview</p>
					</div>

					{/* All Services Section */}
					<div className="border-b border-[#30363D]">
						<button
							onClick={() => toggleSection('allServices')}
							className="w-full px-4 py-3 text-left text-[#C9D1D9] text-sm font-medium hover:bg-[#21262D] flex items-center justify-between transition-colors"
						>
							<div className="flex items-center gap-2">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" />
									<path d="M2 17l10 5 10-5" strokeWidth="2" />
									<path d="M2 12l10 5 10-5" strokeWidth="2" />
								</svg>
								All Services
							</div>
							<div className="flex items-center gap-2">
								<span className="text-xs bg-[#30363D] px-2 py-0.5 rounded-full text-[#8B949E]">
									{services.length}
								</span>
								<svg
									className={`w-4 h-4 transition-transform ${expandedSections.allServices ? 'rotate-90' : ''}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</button>
						{expandedSections.allServices && (
							<div className="px-2 pb-3">
								{services.length > 0 ? (
									services.map((service, index) => {
										const itemId = `service-${index}`;
										const isSelected = selectedItem === itemId;
										return (
											<ServiceItem 
												key={index}
												service={service}
												isSelected={isSelected}
												onSelect={() => handleServiceSelect(itemId, service)}
												getServiceIcon={getServiceIcon}
												getServiceStatus={getServiceStatus}
											/>
										);
									})
								) : (
									<div className="text-xs text-[#8B949E] py-3 px-4 text-center">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mx-auto mb-2 opacity-50">
											<circle cx="12" cy="12" r="10" strokeWidth="2" />
											<path d="M12 6v6l4 2" strokeWidth="2" />
										</svg>
										No services available
									</div>
								)}
							</div>
						)}
					</div>

					{/* Miscellaneous Section */}
					<div className="flex-1">
						<button
							onClick={() => toggleSection('miscellaneous')}
							className="w-full px-4 py-3 text-left text-[#C9D1D9] text-sm font-medium hover:bg-[#21262D] flex items-center justify-between transition-colors"
						>
							<div className="flex items-center gap-2">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
									<polyline points="14,2 14,8 20,8" strokeWidth="2" />
									<line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" />
									<line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" />
									<polyline points="10,9 9,9 8,9" strokeWidth="2" />
								</svg>
								Miscellaneous
							</div>
							<svg
								className={`w-4 h-4 transition-transform ${expandedSections.miscellaneous ? 'rotate-90' : ''}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>
						{expandedSections.miscellaneous && (
							<div className="px-2 pb-3">
								<div 
									onClick={() => handleServiceSelect('collective-logs', null)}
									className={`text-xs py-2 px-2 mx-1 rounded cursor-pointer flex items-center gap-2 group transition-all ${
										selectedItem === 'collective-logs'
											? 'bg-[#1F6FEB]/20 text-[#C9D1D9] border border-[#1F6FEB]/30'
											: 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#21262D]'
									}`}
								>
									<div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#8B949E] opacity-70">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
										<polyline points="14,2 14,8 20,8" strokeWidth="2" />
										<line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" />
										<line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" />
									</svg>
									<span className="font-medium">Collective Logs</span>
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ConsoleSidebar;
