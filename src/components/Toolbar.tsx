import React from 'react';
import { FolderPlus, Upload, Trash2, Search } from 'lucide-react';

export interface ToolbarProps {
  onCreateFolder: () => void;
  onUploadFile: () => void;
  onDeleteFolder: () => void;
  disableDelete: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onCreateFolder,
  onUploadFile,
  onDeleteFolder,
  disableDelete
}) => (
  <div className="flex items-center justify-between p-4 border-b bg-white">
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Rechercher des fichiers..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div className="flex space-x-2">
      <button
        onClick={onCreateFolder}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FolderPlus className="h-4 w-4" />
        Créer dossier
      </button>
      <button
        onClick={onUploadFile}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Upload className="h-4 w-4" />
        Télécharger fichier
      </button>
      <button
        onClick={onDeleteFolder}
        disabled={disableDelete}
        className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
          disableDelete
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-red-200 text-red-600 hover:bg-red-50'
        }`}
      >
        <Trash2 className="h-4 w-4" />
        Supprimer dossier
      </button>
    </div>
  </div>
);

export default Toolbar;