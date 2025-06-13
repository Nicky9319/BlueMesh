import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const ConsoleMainArea = ({ selectedServiceId, consoleEndRef }) => {
  const [output, setOutput] = useState('');

  // Read services from Redux store
  const servicesState = useSelector(state => state.serverServices.services);
  const servicesJson = useSelector(state => state.serverServices.servicesJson);
  const services = Array.isArray(servicesJson) ? servicesJson : (servicesJson?.services || []);

  const containerRef = useRef(null);
  const parentRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const newContainerHeight = containerRef.current?.getBoundingClientRect().height || 0;
      const newParentHeight = parentRef.current?.getBoundingClientRect().height || 0;
      
      // Check if parent height has changed
      if (newParentHeight !== parentHeight && newParentHeight > 0) {
        console.log(`[ConsoleMainArea] Parent height changed: ${parentHeight}px -> ${newParentHeight}px`);
      }
      
      if (containerRef.current) {
        setContainerHeight(newContainerHeight);
      }
      if (parentRef.current) {
        setParentHeight(newParentHeight);
      }
    };

    updateHeight();

    // Create ResizeObserver to watch parent height changes
    const resizeObserver = new ResizeObserver(() => {
      console.log('[ConsoleMainArea] ResizeObserver triggered - Parent height change detected');
      updateHeight();
    });

    // Observe the parent element for size changes
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    // Update heights on window resize
    const handleResize = () => updateHeight();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [parentHeight]);

  // Watch for selectedServiceId changes and update output from store
  useEffect(() => {
    if (!selectedServiceId) {
      setOutput('');
      return;
    }

    let consoleOutput = '';
    
    if (selectedServiceId === 'collective-logs') {
      const collective = servicesState.find(s => s.id === 'collective-logs');
      consoleOutput = collective ? collective.consoleOutput : '';
    } else if (selectedServiceId.startsWith('service-')) {
      // Extract service data to get the correct service ID
      const serviceIndex = parseInt(selectedServiceId.replace('service-', ''));
      const serviceData = services[serviceIndex];
      const serviceId = serviceData?.ServiceName;
      
      if (serviceId) {
        const found = servicesState.find(s => s.id === serviceId);
        consoleOutput = found ? found.consoleOutput : '';
      }
    }

    setOutput(consoleOutput || '');
    console.log(`[ConsoleMainArea] Updated output for service: ${selectedServiceId}`);
    console.log(`[ConsoleMainArea] Parent height: ${parentHeight}px, Container height: ${containerHeight}px`);
  }, [selectedServiceId, servicesState, services, parentHeight, containerHeight]);

  return (
    <div ref={parentRef} className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 bg-[#0D1117] p-4 min-h-0">
        <div
          ref={containerRef}
          className="h-full bg-[#161B22] rounded-lg border border-[#30363D] p-4 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: `${parentHeight * 0.94}px` }}
        >
          <pre className="font-mono text-sm m-0 whitespace-pre-wrap break-words">
            {output}
          </pre>
          <div ref={consoleEndRef} />
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #161B22;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363D;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #484F58;
        }
      `}</style>


        {console.log("parent Height : " , parentHeight)}
    </div>
  );
};

export default ConsoleMainArea;

// TEST CASE:
// const sampleText = `Collective logs for all services\n-------------------------------------------------\nLine 1\nLine 2\nLine 3`; 
// 
// Actually, this would come in with real newlines:
const sampleText = `Collective logs for all services
-------------------------------------------------
Line 1
Line 2
Line 3`;

// Then you’d pass it as:
// <ConsoleMainArea consoleText={sampleText} consoleEndRef={someRef} />

// This should render the text with line breaks as expected.