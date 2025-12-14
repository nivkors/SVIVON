import React from 'react';
import { GameNode, Player } from '../types';
import MazeNode from './MazeNode';
import { LayoutGroup } from 'framer-motion';

interface GameBoardProps {
  maze: GameNode[];
  players: Player[];
  validNextNodes: number[];
  onNodeClick: (nodeId: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ maze, players, validNextNodes, onNodeClick }) => {
  return (
    // Changed from fixed height to h-full w-full with max constraints to keep aspect ratio somewhat sane
    <div className="relative w-full h-full max-w-5xl max-h-[800px] bg-slate-900/30 rounded-3xl border border-slate-700/50 shadow-inner overflow-hidden">
        {/* SVG Layer for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {maze.map(node => 
                node.connections.map(targetId => {
                    const target = maze.find(n => n.id === targetId);
                    if (!target || target.id <= node.id) return null; // Draw once

                    // Coordinates are in %, we use standard SVG x1,y1 with percentages
                    return (
                        <line 
                            key={`line-${node.id}-${target.id}`}
                            x1={`${node.x}%`} y1={`${node.y}%`} 
                            x2={`${target.x}%`} y2={`${target.y}%`} 
                            stroke="#334155" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            opacity="0.6"
                        />
                    );
                })
            )}
        </svg>

        {/* Nodes Layer */}
        <LayoutGroup>
            {maze.map((node) => {
                const playersOnNode = players.filter(p => p.currentNodeId === node.id);
                const isValidMove = validNextNodes.includes(node.id);

                return (
                    <div 
                        key={node.id} 
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                         <MazeNode 
                            node={node} 
                            playersHere={playersOnNode} 
                            isTarget={isValidMove}
                            onClick={() => isValidMove && onNodeClick(node.id)}
                        />
                    </div>
                );
            })}
        </LayoutGroup>
    </div>
  );
};

export default GameBoard;