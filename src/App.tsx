import { useState, useEffect, useRef } from 'react';
import { Filter, Grid3X3, List, SortAsc } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Breadcrumb } from './components/Breadcrumb';
import DataTable from './components/DataTable';
import { rawHierarchy } from './components/Sidebar';

export default function App() {
  const MIN_WIDTH = 280;
  const MAX_WIDTH = 600;

  const [sidebarWidth, setSidebarWidth] = useState<number>(420);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      let newWidth = e.clientX - rect.left;
      newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="flex-none border-r border-gray-200 bg-white shadow-sm"
        style={{ width: sidebarWidth }}
      >
        <Sidebar
          selectedPath={selectedPath}
          onSelect={setSelectedPath}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </aside>

      {/* Resizable Gutter */}
      <div
        className="w-1 hover:w-2 bg-gray-200 hover:bg-blue-300 cursor-ew-resize transition-all duration-150 flex-shrink-0 relative group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb 
              selectedPath={selectedPath} 
              onNavigate={setSelectedPath}
            />
            
            <div className="flex items-center gap-3">
              {selectedPath && (
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'} hover:text-gray-700 transition-colors`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'} hover:text-gray-700 transition-colors`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <SortAsc className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <DataTable
            selectedPath={selectedPath}
            onSelect={setSelectedPath}
            hierarchy={rawHierarchy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </main>
    </div>
  );
}