import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { 
  ChevronRight, 
  Folder, 
  FileText, 
  Search
} from 'lucide-react';
import { TreeItem } from './TreeItem';

// Types
export type Node = { name: string; nodes?: Node[]; size?: string; lastModified?: string };

// Enhanced document leaf nodes with metadata
const docNodes: Node[] = [
  { name: 'Procedure_Qualite_v2.1.pdf', size: '2.4 MB', lastModified: '2024-03-15' },
  { name: 'Manuel_Formation.pdf', size: '1.8 MB', lastModified: '2024-03-10' },
  { name: 'Guide_Utilisateur.pdf', size: '3.2 MB', lastModified: '2024-03-12' },
  { name: 'Politique_Securite.pdf', size: '1.1 MB', lastModified: '2024-03-08' },
];

// Confidentiality levels with colors
const confidentialityLevels = [
  'Interne',
  'Public',
  'Restreint',
  'Confidentiel',
  'Strictement Confidentiel',
];

// Document types with icons
const docTypes = ['Procédure', 'Charte', 'Guide', 'Politique', 'Enregistrement'];

// Build second-level nodes
const makeDocTypeNodes = (): Node[] =>
  docTypes.map((type) => ({
    name: type,
    nodes: confidentialityLevels.map((level) => ({
      name: level,
      nodes: docNodes,
    })),
  }));

// Build first-level items
const makeItem = (name: string): Node => ({
  name,
  nodes: makeDocTypeNodes(),
});

// Top-level hierarchy
export const rawHierarchy: Node[] = [
  {
    name: 'Pilotage (4)',
    nodes: [
      makeItem('PSP-01'),
      makeItem('PSP-02'),
      makeItem('PSP-03: Piloter le SMQ et les connaissances'),
      makeItem('PSP-04'),
    ],
  },
  {
    name: 'Réalisation (6)',
    nodes: [
      makeItem('PSR-05'),
      makeItem('PSR-06'),
      makeItem('PSR-07'),
      makeItem('PSR-09'),
    ],
  },
  {
    name: 'Support (7)',
    nodes: [
      makeItem('PSS-11'),
      makeItem('PSS-13'),
      makeItem('PSS-15'),
      makeItem('PSS-17'),
    ],
  },
];

// Helper functions
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

const contains = (node: Node, target: string, currentPath: string): boolean => {
  if (currentPath === target) return true;
  return !!node.nodes?.some((child) =>
    contains(child, target, `${currentPath}/${child.name}`)
  );
};

const getAllFilesWithPaths = (node: Node, basePath: string = ''): Array<{name: string, size?: string, lastModified?: string}> => {
  const files: Array<{name: string, size?: string, lastModified?: string}> = [];
  
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

export function Sidebar({
  selectedPath,
  onSelect,
  searchTerm,
  onSearchChange,
}: {
  selectedPath: string | null;
  onSelect: (path: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Documents</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {rawHierarchy.map((node) => (
            <TreeItem
              node={node}
              key={node.name}
              path={node.name}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}