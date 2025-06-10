import React, { useState, useRef, useEffect } from 'react';

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
        className="flex items-center py-1 px-2 cursor-pointer select-none text-sm leading-6 hover:bg-gray-700 text-gray-300"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {item.type === 'directory' && (
          <span className="w-4 text-xs mr-1 text-gray-300">
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
  onRefresh,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);

  const minWidth = 200;
  const maxWidth = 600;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-2">
        <button 
          onClick={onToggleCollapse}
          className="bg-transparent border-none text-gray-300 cursor-pointer p-2 rounded text-lg hover:bg-gray-700"
          title="Expand Explorer"
        >
          📁
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={sidebarRef}
      className="bg-gray-800 border-r border-gray-700 flex flex-col relative"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Sidebar Header */}
      <div className="p-3 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleCollapse}
            className="bg-transparent border-none text-gray-300 cursor-pointer p-1 rounded text-sm hover:bg-gray-700"
            title="Collapse Explorer"
          >
            ◀
          </button>
          <h3 className="m-0 text-sm font-semibold uppercase text-gray-300">
            Explorer
          </h3>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={onRefresh} 
            disabled={isLoadingStructure}
            className="bg-transparent border-none text-gray-300 cursor-pointer p-1 rounded text-base hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh folder structure"
          >
            {isLoadingStructure ? '⟳' : '↻'}
          </button>
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {isLoadingStructure ? (
          <div className="p-4 text-center text-gray-500 italic">
            Loading folder structure...
          </div>
        ) : folderStructure ? (
          <FileTreeItem 
            item={folderStructure} 
            onFileClick={onFileClick}
          />
        ) : (
          <div className="p-4 text-center text-gray-500 italic">
            No folder structure available
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeHandleRef}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500 transition-colors duration-200"
        onMouseDown={handleMouseDown}
        style={{ 
          background: isResizing ? '#3b82f6' : 'transparent',
        }}
      />
    </div>
  );
};

export default Sidebar;
