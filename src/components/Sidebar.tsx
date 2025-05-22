// src/components/Sidebar.tsx
import React from 'react';
import { Node } from '../types';
import { TreeItem } from './TreeItem';

// Enhanced document leaf nodes with metadata
const docNodes: Node[] = [
  { name: 'Procedure_Qualite_v2.1.pdf', size: '2.4 MB', lastModified: '2024-03-15' },
  { name: 'Manuel_Formation.pdf', size: '1.8 MB', lastModified: '2024-03-10' },
  { name: 'Guide_Utilisateur.pdf', size: '3.2 MB', lastModified: '2024-03-12' },
  { name: 'Politique_Securite.pdf', size: '1.1 MB', lastModified: '2024-03-08' },
];

// Confidentiality levels
const confidentialityLevels = [
  'Interne',
  'Public',
  'Restreint',
  'Confidentiel',
  'Strictement Confidentiel',
];

// Document types
const docTypes = ['Procédure', 'Charte', 'Guide', 'Politique', 'Enregistrement'];

// Build second-level nodes
const makeDocTypeNodes = (): Node[] =>
  docTypes.map(type => ({
    name: type,
    nodes: confidentialityLevels.map(level => ({
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

/**
 * Search files by name within the hierarchy.
 */
export const searchFiles = (
  nodes: Node[],
  searchTerm: string
): Array<{ name: string; fullPath: string }> => {
  const results: Array<{ name: string; fullPath: string }> = [];

  const traverse = (currentNode: Node, path: string) => {
    if (!currentNode.nodes || currentNode.nodes.length === 0) {
      if (currentNode.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({ name: currentNode.name, fullPath: path });
      }
    } else {
      currentNode.nodes.forEach(child => {
        const childPath = path ? `${path}/${child.name}` : child.name;
        traverse(child, childPath);
      });
    }
  };

  nodes.forEach(node => traverse(node, node.name));
  return results;
};

interface SidebarProps {
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export function Sidebar({ selectedPath, onSelect }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
      </div>

      {/* Folder tree */}
      <div className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {rawHierarchy.map(node => (
            <TreeItem
              key={node.name}
              node={node}
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
