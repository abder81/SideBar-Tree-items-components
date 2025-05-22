import { useMemo } from 'react';
import TreeItem, { Node } from './TreeItem';

// Static document leaf nodes
const docNodes: Node[] = [
  { name: 'document.pdf' },
  { name: 'document.pdf' },
  { name: 'document.pdf' },
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
const docTypes = ['Procédure', 'Charte', 'Guide', 'Politique'];

// Build second-level nodes (doc types → confidentiality → files)
const makeDocTypeNodes = (): Node[] =>
  docTypes.map((type) => ({
    name: type,
    nodes: confidentialityLevels.map((level) => ({
      name: level,
      nodes: docNodes,
    })),
  }));

// Build first-level items (e.g., PSP-01 → doc types)
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

interface SidebarProps {
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export default function Sidebar({
  selectedPath,
  onSelect,
}: SidebarProps) {
  // …
  return (
    <div className="p-8 max-w-full mx-auto">
      <div className="bg-gray-200 rounded shadow p-4 w-full">
        <ul>
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

