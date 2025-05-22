import { useState } from 'react';

type Row = { id: number; nom: string };

// First-level items across all categories
const items: string[] = [
  'PSP-01',
  'PSP-02',
  'PSP-03: Piloter le SMQ et les connaissances',
  'PSP-04',
  'PSR-05',
  'PSR-06',
  'PSR-07',
  'PSR-09',
  'PSS-11',
  'PSS-13',
  'PSS-15',
  'PSS-17',
];

export default function DataTable() {
  const [rows] = useState<Row[]>(
    items.map((name, idx) => ({ id: idx + 1, nom: name }))
  );

  const handleView = (id: number) => {
    // TODO: implement view/edit action
    console.log(`View action for row ${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ id, nom }) => (
            <tr key={id} className="border-t">
              <td className="py-2 px-4">{nom}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleView(id)}
                  className="text-sky-600 hover:underline"
                >
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
