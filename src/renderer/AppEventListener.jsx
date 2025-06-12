import React, { useEffect } from 'react';

const AppEventListener = ({ onEvent }) => {
    useEffect(() => {
        const handleEvent = (event) => {
            if (onEvent) {
                onEvent(event);
            }
        };

        window.addEventListener('app-event', handleEvent);

        return () => {
            window.removeEventListener('app-event', handleEvent);
        };
    }, [onEvent]);

    return null;
};

export default AppEventListener;