import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { appendConsoleOutput, setServicesJson, addService } from '../../store/ServerServicesSlice';

const AppEventListener = ({ onEvent }) => {
    const services = useSelector((state) => state.serverServices.services);
    const servicesJson = useSelector((state) => state.serverServices.servicesJson);
    const currentProjectPath = useSelector((state) => state.project.currentProjectPath);
    const dispatch = useDispatch();


    const handleUpdateServiceConsoleOutput = (event, serviceId, output) => {
        // console.log('AppEventListener: Received event', event, serviceId, output);

        dispatch(appendConsoleOutput({
            id: serviceId,
            consoleOutput: output
        }));
    };

    const handleNewServiceAdded = (event, newServiceInfo) => {
        console.log('AppEventListener: Received new service added event');
            console.log(newServiceInfo);

        // console.log("New Service Added:");
        
        window.project.getServicesJson().then((response) => {
            // console.log('AppEventListener: Received new service added event');
            if(response.success ==  true){
                let servicesJson = response.services;
            // console.log('Current servicesJson:', servicesJson);
            dispatch(setServicesJson(servicesJson));
            // console.log(newServiceInfo.serviceName, 'service added to servicesJson');
            dispatch(addService({
                id: newServiceInfo.serviceName,
                consoleOutput: ` Logs for ${newServiceInfo.serviceName} service
-------------------------------------------------
` 
            }));
            }
            else{
                console.error('Failed to fetch services JSON:', response.error);
            }
        }).catch((error) => {
            console.error('Error fetching services JSON:', error);
        });
    };

    const getServicesJsonFile = (event) => {
        // console.log('AppEventListener: Received services JSON file request');
        // console.log('Current servicesJson:', servicesJson);
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
        window.services.onNewServiceAdded(handleNewServiceAdded);
        window.project.onGetProjectPath(getProjectPath);

        return () => {
            window.services.removeUpdateServiceConsoleOutputListener(handleUpdateServiceConsoleOutput);
            window.services.removeGetServicesJsonFileListener(getServicesJsonFile);
            window.services.removeNewServiceAddedListener(handleNewServiceAdded);
            window.project.removeGetProjectPathListener(getProjectPath);
        };
    }, [dispatch, servicesJson, currentProjectPath, onEvent]); // Add dependencies here

    return null;
};

export default AppEventListener;