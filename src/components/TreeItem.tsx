import { useState, memo } from 'react';
import { FolderIcon, DocumentIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';

export type Node = { name: string; nodes?: Node[] };

type Props = { node: Node };

const TreeItem = memo(({ node }: Props) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.nodes?.length! > 0;

  return (
    <li className="my-1.5">
      <div className="flex items-center gap-1.5">
        {hasChildren && (
          <button onClick={() => setOpen(o => !o)}>
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            </motion.span>
          </button>
        )}
        {hasChildren
          ? <FolderIcon className="h-6 w-6 text-sky-500" />
          : <DocumentIcon className="h-6 w-6 text-gray-900 ml-5" />
        }
        <span title={node.name} className="truncate max-w-full">
          {node.name}
        </span>
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
            {node.nodes!.map(child => (
              <TreeItem node={child} key={child.name + Math.random()} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
});

export default TreeItem;
