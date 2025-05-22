import React, { useMemo } from 'react';
import { Node } from './TreeItem';

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

type Props = {
  selectedPath: string | null;
  onSelect: (path: string) => void;
  hierarchy: Node[];
};

export default function DataTable({ selectedPath, onSelect, hierarchy }: Props) {
  const rows = useMemo(() => {
    if (!selectedPath) {
      // show all first-level items
      return hierarchy.flatMap((cat) => cat.nodes ?? []);
    }
    // drill down: find the selected node
    const node = findNode(hierarchy, selectedPath);
    // if it has children, flatten only the leaf files
    return node?.nodes
      ?.flatMap((type) => type.nodes ?? [])
      .flatMap((level) => level.nodes ?? []) ?? [];
  }, [selectedPath, hierarchy]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">
              {selectedPath ? 'Fichier' : 'Nom'}
            </th>
            {!selectedPath && <th className="py-2 px-4 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t">
              <td className="py-2 px-4">{row.name}</td>
              {!selectedPath && (
                <td className="py-2 px-4">
                  <button
                    onClick={() => onSelect(row.name)}
                    className="text-sky-600 hover:underline"
                  >
                    Voir
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
