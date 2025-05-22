// src/components/DataTable.tsx
import React, { useMemo } from 'react';
import { Node } from '../types';
import { FileText, Folder, Eye, Download } from 'lucide-react';

// Flatten a node into its leaf files (with metadata)
const getAllFilesWithPaths = (node: Node, basePath = ''): Node[] => {
  const files: Node[] = [];
  const traverse = (current: Node, path: string) => {
    if (!current.nodes || current.nodes.length === 0) {
      files.push({
        name: current.name,
        size: current.size,
        lastModified: current.lastModified,
      });
    } else {
      current.nodes.forEach(child =>
        traverse(child, path ? `${path}/${child.name}` : child.name)
      );
    }
  };
  traverse(node, basePath);
  return files;
};

// Find full path for a single file/folder name
const findFullPath = (nodes: Node[], target: string, cur = ''): string | null => {
  for (const n of nodes) {
    const p = cur ? `${cur}/${n.name}` : n.name;
    if (n.name === target) return p;
    if (n.nodes) {
      const f = findFullPath(n.nodes, target, p);
      if (f) return f;
    }
  }
  return null;
};

// Find a node by its path
const findNode = (nodes: Node[], target: string, cur = ''): Node | null => {
  for (const n of nodes) {
    const p = cur ? `${cur}/${n.name}` : n.name;
    if (p === target) return n;
    if (n.nodes) {
      const f = findNode(n.nodes, target, p);
      if (f) return f;
    }
  }
  return null;
};

interface DataTableProps {
  selectedPath: string | null;
  onSelect: (path: string) => void;
  hierarchy: Node[];
  viewMode: 'list' | 'grid';
}

export default function DataTable({
  selectedPath,
  onSelect,
  hierarchy,
  viewMode,
}: DataTableProps) {
  const { rows, showActions } = useMemo(() => {
    if (!selectedPath) {
      // Show top‐level first‐level folders
      const folders = hierarchy.flatMap(cat =>
        (cat.nodes ?? []).map(node => ({
          ...node,
          parentPath: cat.name,
        }))
      );
      return { rows: folders as Node[], showActions: true };
    }
    const node = findNode(hierarchy, selectedPath);
    if (!node) return { rows: [], showActions: false };
    const files = getAllFilesWithPaths(node, selectedPath);
    return { rows: files, showActions: false };
  }, [selectedPath, hierarchy]);

  const handleRowClick = (row: Node) => {
    if (showActions) {
      const full = row.parentPath
        ? `${row.parentPath}/${row.name}`
        : findFullPath(hierarchy, row.name) || row.name;
      onSelect(full);
    }
  };

  // Grid view for leaf files
  if (viewMode === 'grid' && !showActions) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {rows.map((row, i) => (
          <div
            key={`${row.name}-${i}`}
            className="group p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer bg-white"
            onClick={() => handleRowClick(row)}
          >
            <div className="flex flex-col items-center text-center">
              <FileText className="h-12 w-12 text-red-500 mb-2" />
              <h3
                className="text-sm font-medium text-gray-900 truncate w-full"
                title={row.name}
              >
                {row.name}
              </h3>
              {row.size && <p className="text-xs text-gray-500 mt-1">{row.size}</p>}
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-gray-100 rounded" onClick={e => e.stopPropagation()}>
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded" onClick={e => e.stopPropagation()}>
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table view for both folders (showActions) and files
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, i) => (
            <tr
              key={`${row.name}-${i}`}
              className="hover:bg-gray-50 transition-colors group cursor-pointer"
              onClick={() => handleRowClick(row)}
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
                  {!showActions && (
                    <>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" onClick={e => e.stopPropagation()}>
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" onClick={e => e.stopPropagation()}>
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
