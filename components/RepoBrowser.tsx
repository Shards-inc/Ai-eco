
import React, { useState } from 'react';
import { ENTERPRISE_REPO } from '../constants';
import { RepoNode } from '../types';

interface RepoItemProps {
  node: RepoNode;
  depth: number;
  onFileSelect: (node: RepoNode) => void;
}

const RepoItem: React.FC<RepoItemProps> = ({ node, depth, onFileSelect }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-1.5 px-3 hover:bg-zinc-800/80 rounded cursor-pointer transition-colors ${
          depth === 0 ? 'bg-zinc-900/50 font-bold border-b border-zinc-800 mb-2' : ''
        } ${node.type === 'file' ? 'group' : ''}`}
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
      >
        <span className="text-zinc-500 text-sm">
          {node.type === 'folder' ? (isOpen ? '▼' : '▶') : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 group-hover:text-blue-400 transition-colors"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
          )}
        </span>
        <span className={`${node.type === 'folder' ? 'text-blue-400' : 'text-zinc-300'} text-sm mono`}>
          {node.name}
        </span>
        {node.description && (
          <span className="text-[10px] text-zinc-600 italic ml-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
            // {node.description}
          </span>
        )}
        {node.content && (
          <span className="ml-auto text-[9px] bg-blue-500/10 text-blue-400 px-1 rounded border border-blue-500/20 opacity-0 group-hover:opacity-100">
            VIEW CODE
          </span>
        )}
      </div>
      {isOpen && node.children && (
        <div className="border-l border-zinc-800/50 ml-4">
          {node.children.map((child, idx) => (
            <RepoItem key={idx} node={child} depth={depth + 1} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

interface Props {
  onFileSelect: (node: RepoNode) => void;
}

const RepoBrowser: React.FC<Props> = ({ onFileSelect }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
      <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
           <h3 className="text-sm font-bold mono text-zinc-300">enterprise-ai / repository</h3>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        </div>
      </div>
      <div className="overflow-y-auto p-2">
        <RepoItem node={ENTERPRISE_REPO} depth={0} onFileSelect={onFileSelect} />
      </div>
    </div>
  );
};

export default RepoBrowser;
