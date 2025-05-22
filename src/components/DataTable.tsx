import React, { useMemo } from 'react';
import { Node } from '../types';
import { FileText, Eye, Download, Folder } from 'lucide-react';

// Update getAllFilesWithPaths to include size and lastModified
const getAllFilesWithPaths = (node: Node, basePath: string = ''): Array<Node> => {
  const files: Array<Node> = [];
  
  const traverse = (currentNode: Node, currentPath: string) => {
    if (!currentNode.nodes || currentNode.nodes.length === 0) {
      files.push({
        name: currentNode.name,
        size: currentNode.size,
        lastModified: currentNode.lastModified
      });
    } else {
      currentNode.nodes.forEach(child => {
        traverse(child, `${currentPath}/${child.name}`);
      });
    }
  };
  
  traverse(node, basePath);
  return files;
};

const findFullPath = (nodes: Node[], targetName: string, currentPath = ''): string | null => {
  for (const node of nodes) {
    const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;
    if (node.name === targetName) {
      return fullPath;
    }
    if (node.nodes) {
      const found = findFullPath(node.nodes, targetName, fullPath);
      if (found) return found;
    }
  }
  return null;
};

const findNode = (nodes: Node[], target: string, currentPath = ''): Node | null => {
  for (const n of nodes) {
    const p = currentPath ? `${currentPath}/${n.name}` : n.name;
    if (p === target) return n;
    if (n.nodes) {
      const found = findNode(n.nodes, target, p);
      if (found) return found;
    }
  }
  return null;
};

interface DataTableProps {
  selectedPath: string | null;
  onSelect: (path: string) => void;
  hierarchy: Node[];
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

function DataTable({ selectedPath, onSelect, hierarchy, viewMode }: DataTableProps) {
  const { rows, showActions } = useMemo(() => {
    if (!selectedPath) {
      const firstLevelItems = hierarchy.flatMap((cat) => 
        (cat.nodes ?? []).map(node => ({
          ...node,
          parentPath: cat.name
        }))
      );
      return { rows: firstLevelItems, showActions: true };
    }
    
    const node = findNode(hierarchy, selectedPath);
    if (!node) return { rows: [], showActions: false };
    
    const files = getAllFilesWithPaths(node, selectedPath);
    return { rows: files, showActions: false };
  }, [selectedPath, hierarchy]);

  const handleVoirClick = (nodeName: string, parentPath?: string) => {
    let fullPath: string;
    if (parentPath) {
      fullPath = `${parentPath}/${nodeName}`;
    } else {
      const foundPath = findFullPath(hierarchy, nodeName);
      fullPath = foundPath || nodeName;
    }
    onSelect(fullPath);
  };

  const handleFileClick = (row: Node) => {
    if (showActions) {
      handleVoirClick(row.name, row.parentPath);
    }
  };

  if (viewMode === 'grid' && !showActions) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {rows.map((row, index) => (
          <div
            key={`${row.name}-${index}`}
            className="group p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer bg-white"
            onClick={() => handleFileClick(row)}
          >
            <div className="flex flex-col items-center text-center">
              <FileText className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-900 truncate w-full" title={row.name}>
                {row.name}
              </h3>
              {row.size && (
                <p className="text-xs text-gray-500 mt-1">{row.size}</p>
              )}
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle view action
                  }}
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle download action
                  }}
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {showActions ? 'Nom' : 'Fichier'}
            </th>
            {!showActions && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modifié
                </th>
              </>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr 
              key={`${row.name}-${index}`} 
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {showActions ? (
                    <Folder className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  ) : (
                    <FileText className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  )}
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {row.name}
                  </div>
                </div>
              </td>
              {!showActions && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.size || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.lastModified || '-'}
                  </td>
                </>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  {showActions ? (
                    <button
                      onClick={() => handleVoirClick(row.name, (row as any).parentPath)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </button>
                  ) : (
                    <>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;