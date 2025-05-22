import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { FolderIcon, DocumentIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';


type Node = {
  name: string;
  nodes?: Node[];
};

function App() {
  const docNodes = [
    { name: 'document.pdf' },
    { name: 'document.pdf' },
    { name: 'document.pdf' },
  ];

  // Helper to generate confidentiality levels
  const confidentialityLevels = [
    'Interne',
    'Public',
    'Restreint',
    'Confidentiel',
    'Strictement Confidentiel',
  ];

  // Helper to generate document types
  const docTypes = ['Procédure', 'Charte', 'Guide', 'Politique'];

  // Helper to generate nodes for a PSP/PSR/PSS item
  const makeDocTypeNodes = () =>
    docTypes.map((type) => ({
      name: type,
      nodes: confidentialityLevels.map((level) => ({
        name: level,
        nodes: [...docNodes],
      })),
    }));

  // Helper to generate a PSP/PSR/PSS node
  const makeItem = (name: string) => ({
    name,
    nodes: makeDocTypeNodes(),
  });

  // Main nodes array
  let nodes: Node[] = [
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

  return (
    <div className='p-8 max-w-full mx-auto' style={{ marginTop: '' }}>
      <div className="bg-gray-200 rounded shadow p-4 w-[420px]">
      <ul>
        {nodes.map((node) => (
        <FileSystemItem node={node} key={node.name} />
        ))}
      </ul>
      </div>
    </div>
  )
}

function FileSystemItem({ node }: { node: Node }) {

  let [isOpen, setIsOpen] = useState(false);


  return (
    <li key={node.name} className='my-1.5'>
      <span
        className='flex items-center gap-1.5'
      >
        {node.nodes && node.nodes.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)} >
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="flex"
            >
              <ChevronRightIcon className={`size-4 text-grey-500 `} />
            </motion.span>
          </button>
        )}

        {
          node.nodes 
          ? (
            <FolderIcon className={`size-6 text-sky-500 ${node.nodes.length === 0 ? 'ml-[22px]' : ''} `} />
          )
          : (
            <DocumentIcon className='ml-[22px] size-6 text-grey-900' />
          )
        }
        <span
          className="truncate max-w-[1000px] block"
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          title={node.name}
        >
          {node.name}
        </span>
      </span>
      
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="pl-6 overflow-hidden flex flex-col justify-end"
          >
            {node.nodes?.map((folder) => (
              <FileSystemItem node={folder} key={folder.name} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}

export default App;


