import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { appendConsoleOutput, updateConsoleOutput } from '../../store/ServerServicesSlice';

const AppEventListener = ({ onEvent }) => {
    const services = useSelector((state) => state.serverServices.services);
    const servicesJson = useSelector((state) => state.serverServices.servicesJson);
    const currentProjectPath = useSelector((state) => state.project.currentProjectPath);
    const dispatch = useDispatch();


    const handleUpdateServiceConsoleOutput = (event, serviceId, output) => {
        console.log('AppEventListener: Received event', event, serviceId, output);

        dispatch(appendConsoleOutput({
            id: serviceId,
            consoleOutput: output
        }));
    };

    const getServicesJsonFile = (event) => {
        console.log('AppEventListener: Received services JSON file request');
        console.log('Current servicesJson:', servicesJson);
        window.services.sendServicesJsonFile(servicesJson);
    }

    const getProjectPath = (event) => {
        console.log('AppEventListener: Received project path request');
        console.log('Current project path:', currentProjectPath);
        window.project.sendProjectPath(currentProjectPath);
    };


    useEffect(() => {
        window.services.onUpdateServiceConsoleOutput(handleUpdateServiceConsoleOutput);
        window.services.onGetServicesJsonFile(getServicesJsonFile);
        window.project.onGetProjectPath(getProjectPath);

        return () => {
            window.services.removeUpdateServiceConsoleOutputListener(handleUpdateServiceConsoleOutput);
            window.services.removeGetServicesJsonFileListener(getServicesJsonFile);
            window.project.removeGetProjectPathListener(getProjectPath);
        };
    }, [dispatch, servicesJson, currentProjectPath, onEvent]); // Add dependencies here

    return null;
};

export default AppEventListener;