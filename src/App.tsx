import { useState, useRef, useEffect } from 'react';
import Sidebar, { rawHierarchy } from './components/Sidebar';
import DataTable from './components/DataTable';

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const draggingRef = useRef(false);
  // rename to selectedPath
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // … your gutter handlers …

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className="flex-none overflow-y-auto border-r"
        style={{ width: sidebarWidth, minWidth: 260 }}
      >
        {/* pass selectedPath + onSelect */}
        <Sidebar
          selectedPath={selectedPath}
          onSelect={setSelectedPath}
        />
      </aside>

      {/* Draggable gutter */}
      <div
        className="w-1 hover:w-2 bg-gray-300 hover:bg-gray-400 cursor-ew-resize transition-all"
        onMouseDown={() => {
          draggingRef.current = true;
          document.body.style.userSelect = 'none';
        }}
      />

      {/* Main area */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {selectedPath ? selectedPath.split('/').pop() : 'Documents'}
        </h1>
        <DataTable
          selectedPath={selectedPath}
          onSelect={setSelectedPath}
          hierarchy={rawHierarchy}
        />
      </main>
    </div>
  );
}
