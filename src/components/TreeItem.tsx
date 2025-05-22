import { useState, useEffect, memo } from 'react';
import { ChevronRight, Folder, FileText } from 'lucide-react';

export type Node = { name: string; nodes?: Node[] };

interface Props {
  node: Node;
  path: string;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

const contains = (node: Node, target: string, currentPath: string): boolean => {
  if (currentPath === target) return true;
  return !!node.nodes?.some((child) =>
    contains(child, target, `${currentPath}/${child.name}`)
  );
};

const TreeItem = memo(function TreeItem({ node, path, selectedPath, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(node.nodes) && node.nodes.length > 0;
  const isSelected = path === selectedPath;

  useEffect(() => {
    if (selectedPath && contains(node, selectedPath, path)) {
      setOpen(true);
    }
  }, [selectedPath, node, path]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleSelect = () => {
    onSelect(path);
    if (hasChildren) {
      setOpen(true);
    }
  };

  const getNodeIcon = () => {
    if (!hasChildren) return <FileText className="h-4 w-4 text-gray-500" />;
    
    // Different folder colors based on hierarchy level
    const depth = path.split('/').length;
    if (depth === 1) return <Folder className="h-4 w-4 text-blue-600" />;
    if (depth === 2) return <Folder className="h-4 w-4 text-green-600" />;
    if (depth === 3) return <Folder className="h-4 w-4 text-orange-600" />;
    return <Folder className="h-4 w-4 text-purple-600" />;
  };

  return (
    <li className="select-none">
      <div 
        className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150 hover:bg-gray-100 cursor-pointer group ${
          isSelected ? 'bg-blue-100 border-l-3 border-blue-500' : ''
        }`}
        onClick={handleSelect}
      >
        {hasChildren && (
          <button 
            onClick={handleToggle} 
            className="p-0.5 rounded hover:bg-gray-200 transition-colors"
          >
            <ChevronRight 
              className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
                open ? 'rotate-90' : ''
              }`}
            />
          </button>
        )}
        
        <div className={`flex items-center gap-2 flex-1 min-w-0 ${!hasChildren ? 'ml-5' : ''}`}>
          {getNodeIcon()}
          <span 
            className={`truncate text-sm transition-colors ${
              isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
            }`} 
            title={node.name}
          >
            {node.name}
          </span>
        </div>
      </div>

      {open && hasChildren && (
        <div className="ml-4 mt-1 border-l border-gray-200 pl-2">
          <ul className="space-y-0.5">
            {node.nodes!.map((child) => (
              <TreeItem
                node={child}
                key={child.name}
                path={`${path}/${child.name}`}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
});

export { TreeItem };
