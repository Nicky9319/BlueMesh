import React, { useState } from 'react';


const MainPage = () => {
    const [activeTab, setActiveTab] = useState('agents'); // Default to agents tab
    
    return (
        <div className="flex h-screen" style={{ backgroundColor: '#121317' }}>
            This is the Main Page;
        </div>
    );
};

export default MainPage;