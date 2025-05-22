import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';

export default function App() {
  // state for sidebar width in pixels
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const draggingRef = useRef(false);

  // start dragging
  const onMouseDownGutter = () => {
    draggingRef.current = true;
    // disable text selection while dragging
    document.body.style.userSelect = 'none';
  };

  // stop dragging
  const onMouseUp = () => {
    if (draggingRef.current) {
      draggingRef.current = false;
      document.body.style.userSelect = '';
    }
  };

  // handle movement
  const onMouseMove = (e: MouseEvent) => {
    if (draggingRef.current) {
      // clamp to min/max if you like, e.g. 200–800px
      const newWidth = Math.max(200, Math.min(800, e.clientX));
      setSidebarWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar: fixed width from state, scrollable */}
      <aside
        className="flex-none overflow-y-auto border-r"
        style={{ width: sidebarWidth }}
      >
        <Sidebar />
      </aside>

      {/* Draggable gutter */}
      <div
        className="w-1 hover:w-2 bg-gray-300 hover:bg-gray-400 cursor-ew-resize transition-all"
        onMouseDown={onMouseDownGutter}
      />

      {/* Main area: flex-1 so it fills remaining space */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        <DataTable />
      </main>
    </div>
  );
}
