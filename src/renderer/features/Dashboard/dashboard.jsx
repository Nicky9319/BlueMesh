import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const FileIcon = ({ extension, isDirectory }) => {
  if (isDirectory) return '📁';
  
  const iconMap = {
    '.js': '📄',
    '.jsx': '⚛️',
    '.ts': '📘',
    '.tsx': '⚛️',
    '.html': '🌐',
    '.css': '🎨',
    '.json': '📋',
    '.md': '📝',
    '.txt': '📄',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.gif': '🖼️',
    '.svg': '🖼️'
  };
  
  return iconMap[extension] || '📄';
};

const FileTreeItem = ({ item, level = 0, onFileClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggle = () => {
    if (item.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };
  
  return (
    <div>
      <div 
        className="file-tree-item"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {item.type === 'directory' && (
          <span className="expand-icon">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <FileIcon extension={item.extension} isDirectory={item.type === 'directory'} />
        <span className="file-name">{item.name}</span>
      </div>
      {item.type === 'directory' && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileTreeItem 
              key={index} 
              item={child} 
              level={level + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const currentProjectPath = useSelector(state => state.project.currentProjectPath);
    const isProjectLoaded = useSelector(state => state.project.isProjectLoaded);
    const [folderStructure, setFolderStructure] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    
    useEffect(() => {
        console.log('Dashboard loaded - Project path from Redux:', currentProjectPath);
        console.log('Project loaded status:', isProjectLoaded);
        
        if (currentProjectPath && isProjectLoaded) {
            loadFolderStructure();
        }
    }, [currentProjectPath, isProjectLoaded]);
    
    const loadFolderStructure = async () => {
        if (!currentProjectPath) return;
        
        setLoading(true);
        try {
            const structure = await window.api.readFolderStructure(currentProjectPath, {
                includeContent: false,
                maxDepth: 5,
                excludeHidden: true,
                excludeNodeModules: true
            });
            setFolderStructure(structure);
            console.log('Folder structure loaded:', structure);
        } catch (error) {
            console.error('Failed to load folder structure:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFileClick = async (file) => {
        console.log('File clicked:', file.path);
        setSelectedFile(file);
        
        // Load file content if it's a text file
        if (file.type === 'file' && file.size < 1024 * 1024) {
            try {
                const structure = await window.api.readFolderStructure(file.path, {
                    includeContent: true
                });
                // Handle single file content loading
                console.log('File content loaded for:', file.name);
            } catch (error) {
                console.error('Failed to load file content:', error);
            }
        }
    };
    
    const handleBackToSelection = () => {
        navigate('/');
    };
    
    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>Explorer</h3>
                    <button onClick={loadFolderStructure} disabled={loading}>
                        {loading ? '⟳' : '↻'}
                    </button>
                </div>
                <div className="file-tree">
                    {loading ? (
                        <div className="loading">Loading folder structure...</div>
                    ) : folderStructure ? (
                        <FileTreeItem 
                            item={folderStructure} 
                            onFileClick={handleFileClick}
                        />
                    ) : (
                        <div className="no-folder">No folder structure available</div>
                    )}
                </div>
            </div>
            
            <div className="main-content">
                <div className="content-header">
                    <h2>Current Project</h2>
                    <button onClick={handleBackToSelection}>Back to Selection</button>
                </div>
                <p className="project-path">{currentProjectPath}</p>
                
                {selectedFile && (
                    <div className="file-info">
                        <h3>Selected File: {selectedFile.name}</h3>
                        <p>Path: {selectedFile.path}</p>
                        <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                        <p>Modified: {new Date(selectedFile.modified).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
