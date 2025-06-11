import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentProjectPath } from '../../../../store/ServerInfoSlice';
import { addService, setServicesJson } from '../../../../store/ServerServicesSlice';

const ProjectSelection = () => {
    const [selectedPath, setSelectedPath] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to read and store services.json using main process
    const readAndStoreServicesJson = async (folderPath) => {
        try {
            const servicesJsonContent = await window.electron.ipcRenderer.invoke(
                'fs:readFile',
                folderPath,
                'services.json'
            );
            dispatch(setServicesJson(servicesJsonContent));
            // console.log('services.json content:', servicesJsonContent);
            // Populate ServerServicesSlice with services from services.json
            if (servicesJsonContent && Array.isArray(servicesJsonContent)) {
                servicesJsonContent.forEach(service => {
                    // console.log('Adding service:', service);
                    dispatch(addService({
                        id: service.ServiceName,
                        consoleOutput: service.ServiceName // default value is the name of the service
                    }));
                });
            }
        } catch (error) {
            alert('Failed to read services.json: ' + error.message);
            throw error;
        }
    };

    const handleSelectFolder = async () => {
        try {
            // console.log('Attempting to open folder dialog...');
            // console.log('window.electron:', window.electron);

            const result = await window.electron.ipcRenderer.invoke('dialog:openDirectory');
            // console.log('Dialog result received:', result);
            
            if (result && !result.canceled && result.filePaths.length > 0) {
                const folderPath = result.filePaths[0];

                // Check if services.json exists in the selected folder
                const hasServicesJson = await window.electron.ipcRenderer.invoke(
                    'fs:checkFileExists',
                    folderPath,
                    'services.json'
                );

                if (hasServicesJson) {
                    console.log('Selected folder contains services.json:', folderPath);
                    setSelectedPath(folderPath);
                    dispatch(setCurrentProjectPath(folderPath));
                    // Read and store services.json, then navigate
                    try {
                        await readAndStoreServicesJson(folderPath);
                        navigate('/dashboard');
                    } catch {
                        // Error already handled in readAndStoreServicesJson
                    }
                } else {
                    alert('The selected folder does not contain a services.json file. Please select the correct project folder.');
                }
            }
        } catch (error) {
            console.error('Error selecting folder:', error);
            alert('Error opening folder dialog: ' + error.message);
        }
    };
    
    return (
        <div className="flex h-screen items-center justify-center bg-[#0D1117]">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#C9D1D9] mb-8">Select Project Folder</h1>
                <button
                    onClick={handleSelectFolder}
                    className="bg-[#1F6FEB] hover:bg-[#58A6FF] text-[#C9D1D9] font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    Open Folder
                </button>
                {selectedPath && (
                    <p className="text-[#8B949E] mt-4">Selected: {selectedPath}</p>
                )}
            </div>
        </div>
    );
};

export default ProjectSelection;
