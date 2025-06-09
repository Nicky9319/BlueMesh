import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const isProjectLoaded = useSelector(state => state.project.isProjectLoaded);
    
    useEffect(() => {
        console.log('Dashboard loaded - Project path from Redux:', currentProjectPath);
        console.log('Project loaded status:', isProjectLoaded);
    }, [currentProjectPath, isProjectLoaded]);
    
    const handleBackToSelection = () => {
        navigate('/');
    };
    
    return (
        <div className="flex h-screen" style={{ backgroundColor: '#121317' }}>
            <div className="w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <button
                        onClick={handleBackToSelection}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors duration-200"
                    >
                        Back to Project Selection
                    </button>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Current Project</h2>
                    <p className="text-gray-300">{currentProjectPath || 'No project selected'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Project Stats</h3>
                        <p className="text-gray-400">Coming soon...</p>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
                        <p className="text-gray-400">No recent activity</p>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
                        <p className="text-gray-400">Actions will appear here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
