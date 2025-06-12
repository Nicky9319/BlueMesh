import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateConsoleOutput } from '../../store/ServerServicesSlice';

const AppEventListener = ({ onEvent }) => {
    const services = useSelector((state) => state.serverServices.services);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleEvent = (event, serviceId, output) => {
            console.log('AppEventListener: Received event', event, serviceId, output);
            
            dispatch(updateConsoleOutput({
                id: serviceId,
                consoleOutput: output
            }));
        };

        window.services.onUpdateServiceConsoleOutput(handleEvent);

        return () => {
            window.services.removeUpdateServiceConsoleOutputListener(handleEvent);
        };
    }, [dispatch, onEvent]);

    return null;
};

export default AppEventListener;