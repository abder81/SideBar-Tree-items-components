// src/App.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Filter, Grid3X3, List, SortAsc, Search, FileText } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Breadcrumb } from './components/Breadcrumb';
import DataTable from './components/DataTable';
import { rawHierarchy, searchFiles } from './components/Sidebar';

export default function App() {
  const MIN_WIDTH = 280;
  const MAX_WIDTH = 600;

  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Move search here—only when ≥3 chars
  const searchResults = useMemo(
    () => (searchTerm.length < 3 ? [] : searchFiles(rawHierarchy, searchTerm)),
    [searchTerm]
  );
  const isSearching = searchTerm.length >= 3;

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      let w = e.clientX - rect.left;
      w = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, w));
      setSidebarWidth(w);
    };
    const handleMouseUp = () => setIsDragging(false);

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

  const handleSearchResultClick = (r: { name: string; fullPath: string }) => {
    const parts = r.fullPath.split('/');
    parts.pop();
    setSelectedPath(parts.join('/'));
    setSearchTerm('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="flex-none border-r border-gray-200 bg-white shadow-sm"
        style={{ width: sidebarWidth }}
      >
        <Sidebar selectedPath={selectedPath} onSelect={setSelectedPath} />
      </aside>

      {/* Gutter */}
      <div
        className="w-1 hover:w-2 bg-gray-200 hover:bg-blue-300 cursor-ew-resize transition-all duration-150"
        onMouseDown={() => setIsDragging(true)}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header (no global search here now) */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb selectedPath={selectedPath} onNavigate={setSelectedPath} />
            <div className="flex items-center gap-3">
              {selectedPath && !isSearching && (
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                    } hover:text-gray-700 transition-colors`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                    } hover:text-gray-700 transition-colors`}
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
          {/* ← Global search moved here */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des fichiers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {isSearching ? (
            // search results panel
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Résultats de recherche ({searchResults.length})
              </h3>
              {searchResults.length === 0 ? (
                <p className="text-gray-500">
                  Aucun fichier trouvé pour « {searchTerm} »
                </p>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleSearchResultClick(r)}
                    >
                      <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {r.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {r.fullPath}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // normal data table
            <DataTable
              selectedPath={selectedPath}
              onSelect={setSelectedPath}
              hierarchy={rawHierarchy}
              viewMode={viewMode}
            />
          )}
        </div>
      </main>
    </div>
  );
}
