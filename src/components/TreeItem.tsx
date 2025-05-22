import { useState, useEffect, memo } from 'react';
import { FolderIcon, DocumentIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';

export type Node = { name: string; nodes?: Node[] };

interface Props {
  node: Node;
  path: string;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

const contains = (node: Node, target: string, currentPath: string): boolean => {
  if (currentPath === target) return true;
  return !!node.nodes?.some((child) =>
    contains(child, target, `${currentPath}/${child.name}`)
  );
};

const TreeItem = memo(({ node, path, selectedPath, onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(node.nodes) && node.nodes.length > 0;
  const isSelected = path === selectedPath;

  // auto-open any branch containing the selectedPath
  useEffect(() => {
    if (selectedPath && contains(node, selectedPath, path)) {
      setOpen(true);
    }
  }, [selectedPath, node, path]);

  return (
    <li className={`my-1.5 ${isSelected ? 'bg-sky-200 rounded' : ''}`}>
      <div className="flex items-center gap-1.5 px-2">
        {hasChildren && (
          <button onClick={() => onSelect(path)}>
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            </motion.span>
          </button>
        )}

        <button
          className={`flex items-center gap-1.5 flex-1 text-left ${
            !hasChildren ? 'pl-6' : ''
          }`}
          onClick={() => onSelect(path)}
        >
          {hasChildren ? (
            <FolderIcon className="h-6 w-6 text-sky-500" />
          ) : (
            <DocumentIcon className="h-6 w-6 text-gray-900" />
          )}
          <span className="truncate" title={node.name}>
            {node.name}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && hasChildren && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="pl-6 overflow-hidden"
          >
            {node.nodes!.map((child) => (
              <TreeItem
                node={child}
                key={child.name}
                path={`${path}/${child.name}`}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
});

export default TreeItem;
