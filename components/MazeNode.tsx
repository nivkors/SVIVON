import React from 'react';
import { GameNode, Player } from '../types';
import { motion } from 'framer-motion';

interface MazeNodeProps {
  node: GameNode;
  playersHere: Player[];
  isTarget: boolean;
  onClick: () => void;
}

const MazeNode: React.FC<MazeNodeProps> = ({ node, playersHere, isTarget, onClick }) => {
  const isStart = node.letter === 'START';
  const isEnd = node.letter === 'END';

  let baseClasses = "relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-[4px] sm:border-[5px] transition-all duration-300 shadow-xl cursor-default ";
  let content;

  if (isStart) {
    baseClasses += " bg-slate-800 border-emerald-500 shadow-emerald-900/50";
    content = <span className="text-xs sm:text-sm font-bold text-emerald-400">התחלה</span>;
  } else if (isEnd) {
    baseClasses += " bg-slate-800 border-yellow-500 shadow-yellow-900/50";
    // Menorah SVG Icon - 9 Branches (Hanukkiah)
    content = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
        {/* Base */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8M12 21v-5" />
        
        {/* Branches - U shapes */}
        <path d="M4 8v5a8 8 0 0 0 16 0V8" strokeWidth={1.5} />
        <path d="M6 9v4a6 6 0 0 0 12 0V9" strokeWidth={1.5} />
        <path d="M8 10v3a4 4 0 0 0 8 0v-3" strokeWidth={1.5} />
        <path d="M10 11v2a2 2 0 0 0 4 0v-2" strokeWidth={1.5} />

        {/* Central Stem (Shamash) */}
        <path d="M12 16V6" strokeWidth={1.5} />

        {/* Flames */}
        <g className="animate-pulse">
            <path d="M12 2l-1.5 3h3z" fill="#FACC15" stroke="none" />
            <path d="M4 4l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.1s'}} />
            <path d="M6 5l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.2s'}} />
            <path d="M8 6l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.3s'}} />
            <path d="M10 7l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.4s'}} />
            <path d="M14 7l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.5s'}} />
            <path d="M16 6l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.6s'}} />
            <path d="M18 5l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.7s'}} />
            <path d="M20 4l-1.5 3h3z" fill="#FACC15" stroke="none" style={{animationDelay: '0.8s'}} />
        </g>
      </svg>
    );
  } else {
    baseClasses += " bg-slate-800 border-slate-600";
    content = <span className="text-2xl sm:text-3xl font-bold text-slate-300 group-hover:text-white">{node.letter}</span>;
  }

  // Interactive State
  if (isTarget) {
    baseClasses += " ring-4 ring-white ring-opacity-60 cursor-pointer animate-pulse scale-110 border-white bg-slate-700 z-20";
    if (!isStart && !isEnd) {
        content = <span className="text-3xl sm:text-4xl font-bold text-white">{node.letter}</span>;
    }
  }

  return (
    <div className="relative group" onClick={onClick}>
      <div className={baseClasses}>
        {content}
      </div>

      {/* Players */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-30">
        <div className="flex flex-wrap items-center justify-center -space-x-2 rtl:space-x-reverse -mt-6"> 
            {playersHere.map((player) => (
            <motion.div
                layoutId={`player-${player.id}`} 
                key={player.id}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-lg transform ${player.color} flex items-center justify-center`}
                title={player.name}
                initial={false}
                animate={{ scale: [1, 1.2, 1] }} // Subtle bounce on arrival
                transition={{ 
                    type: "spring", 
                    stiffness: 250, 
                    damping: 25,
                    mass: 0.8
                }}
                style={{ zIndex: 50 }}
            >
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase">{player.name.charAt(0)}</span>
            </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MazeNode;