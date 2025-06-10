import React, { useState } from 'react';

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
        className="flex items-center py-1 px-2 cursor-pointer select-none text-sm leading-6 hover:bg-[#30363D] text-[#C9D1D9]"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {item.type === 'directory' && (
          <span className="w-4 text-xs mr-1 text-[#8B949E]">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <FileIcon extension={item.extension} isDirectory={item.type === 'directory'} />
        <span className="ml-1.5 whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
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

const Sidebar = ({ 
  folderStructure, 
  isLoadingStructure, 
  onFileClick, 
  onRefresh
}) => {
  return (
    <div className="w-80 bg-[#0D1117] border-r border-[#30363D] flex flex-col">
      {/* Sidebar Header */}
      <div className="p-3 bg-[#0D1117] border-b border-[#30363D] flex justify-between items-center">
        <h3 className="m-0 text-sm font-semibold uppercase text-[#C9D1D9]">
          Explorer
        </h3>
        <button 
          onClick={onRefresh} 
          disabled={isLoadingStructure}
          className="bg-transparent border-none text-[#8B949E] cursor-pointer p-1 rounded text-base hover:bg-[#30363D] hover:text-[#C9D1D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Refresh folder structure"
        >
          {isLoadingStructure ? '⟳' : '↻'}
        </button>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {isLoadingStructure ? (
          <div className="p-4 text-center text-[#8B949E] italic">
            Loading folder structure...
          </div>
        ) : folderStructure ? (
          <FileTreeItem 
            item={folderStructure} 
            onFileClick={onFileClick}
          />
        ) : (
          <div className="p-4 text-center text-[#8B949E] italic">
            No folder structure available
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
