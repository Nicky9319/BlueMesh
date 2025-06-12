import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateConsoleOutput } from '../../store/ServerServicesSlice';

const AppEventListener = ({ onEvent }) => {
    const services = useSelector((state) => state.serverServices.services);
    const servicesJson = useSelector((state) => state.serverServices.servicesJson);
    const currentProjectPath = useSelector((state) => state.project.currentProjectPath);
    const dispatch = useDispatch();


    const handleUpdateServiceConsoleOutput = (event, serviceId, output) => {
        console.log('AppEventListener: Received event', event, serviceId, output);

        dispatch(updateConsoleOutput({
            id: serviceId,
            consoleOutput: output
        }));
    };

    const handleGetServicesJsonFile = (event) => {
        console.log('AppEventListener: Received services JSON file request');
        console.log('Current servicesJson:', servicesJson);
        return servicesJson; // Return the Redux value directly
    }

    const handleGetProjectPath = (event) => {
        console.log('AppEventListener: Received project path request');
        console.log('Current project path:', currentProjectPath);
        return currentProjectPath; // Return the Redux value directly
    };


    useEffect(() => {
        window.services.onUpdateServiceConsoleOutput(handleUpdateServiceConsoleOutput);
        window.services.onGetServicesJsonFile(handleGetServicesJsonFile);
        window.project.onGetProjectPath(handleGetProjectPath);

        return () => {
            window.services.removeUpdateServiceConsoleOutputListener(handleUpdateServiceConsoleOutput);
            window.services.removeGetServicesJsonFileListener(handleGetServicesJsonFile);
            window.project.removeGetProjectPathListener(handleGetProjectPath);
        };
    }, [dispatch, servicesJson, currentProjectPath, onEvent]); // Add dependencies here

    return null;
};

export default AppEventListener;