import { GameNode, DreidelLetter, Difficulty } from './types';

export const PLAYER_COLORS = [
  { name: 'כחול', tailwind: 'bg-blue-600', border: 'border-blue-700', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(37,99,235,0.6)]' },
  { name: 'אדום', tailwind: 'bg-red-600', border: 'border-red-700', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(220,38,38,0.6)]' },
  { name: 'ירוק', tailwind: 'bg-emerald-600', border: 'border-emerald-700', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(5,150,105,0.6)]' },
  { name: 'צהוב', tailwind: 'bg-yellow-500', border: 'border-yellow-600', text: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]' },
];

const LETTERS: DreidelLetter[] = ['נ', 'ג', 'ה', 'פ'];

const getRandomLetter = (): DreidelLetter => LETTERS[Math.floor(Math.random() * LETTERS.length)];

// Helper to create bidirectional connection
const connect = (nodes: GameNode[], id1: number, id2: number) => {
  const n1 = nodes.find(n => n.id === id1);
  const n2 = nodes.find(n => n.id === id2);
  if (n1 && n2) {
    if (!n1.connections.includes(id2)) n1.connections.push(id2);
    if (!n2.connections.includes(id1)) n2.connections.push(id1);
  }
};

export const generateMaze = (difficulty: Difficulty): GameNode[] => {
  const variant = Math.random() > 0.5 ? 1 : 2; 
  let nodes: GameNode[] = [];
  let id = 0;

  if (difficulty === 'EASY') {
      // EASY: Lots of forward options, hard to get stuck.
      // 3 Columns of play
      nodes = [
          { id: id++, x: 5, y: 50, letter: 'START', connections: [] },
          
          // Column 1
          { id: id++, x: 25, y: 20, letter: getRandomLetter(), connections: [] },
          { id: id++, x: 25, y: 50, letter: getRandomLetter(), connections: [] },
          { id: id++, x: 25, y: 80, letter: getRandomLetter(), connections: [] },

          // Column 2
          { id: id++, x: 50, y: 20, letter: getRandomLetter(), connections: [] },
          { id: id++, x: 50, y: 50, letter: getRandomLetter(), connections: [] },
          { id: id++, x: 50, y: 80, letter: getRandomLetter(), connections: [] },

          // Column 3
          { id: id++, x: 75, y: 35, letter: getRandomLetter(), connections: [] },
          { id: id++, x: 75, y: 65, letter: getRandomLetter(), connections: [] },

          { id: id++, x: 95, y: 50, letter: 'END', connections: [] },
      ];

      // Highly connected mesh
      connect(nodes, 0, 1); connect(nodes, 0, 2); connect(nodes, 0, 3);
      
      // Vertical connectors (easy to switch lanes)
      connect(nodes, 1, 2); connect(nodes, 2, 3);
      connect(nodes, 4, 5); connect(nodes, 5, 6);

      // Forward connectors (Cross linking)
      connect(nodes, 1, 4); connect(nodes, 1, 5);
      connect(nodes, 2, 4); connect(nodes, 2, 5); connect(nodes, 2, 6);
      connect(nodes, 3, 5); connect(nodes, 3, 6);

      connect(nodes, 4, 7); connect(nodes, 5, 7); connect(nodes, 5, 8); connect(nodes, 6, 8);
      
      connect(nodes, 7, 9); connect(nodes, 8, 9);

  } else if (difficulty === 'MEDIUM') {
      // MEDIUM: Zig zags and diamonds.
      nodes = [
        { id: id++, x: 5, y: 50, letter: 'START', connections: [] },
        
        // Ring 1
        { id: id++, x: 20, y: 25, letter: getRandomLetter(), connections: [] },
        { id: id++, x: 20, y: 75, letter: getRandomLetter(), connections: [] },
        
        // Hub 1
        { id: id++, x: 35, y: 50, letter: getRandomLetter(), connections: [] },

        // Ring 2 (Wider)
        { id: id++, x: 50, y: 15, letter: getRandomLetter(), connections: [] },
        { id: id++, x: 50, y: 85, letter: getRandomLetter(), connections: [] },
        
        // Hub 2
        { id: id++, x: 65, y: 50, letter: getRandomLetter(), connections: [] },

        // Final Approach
        { id: id++, x: 80, y: 30, letter: getRandomLetter(), connections: [] },
        { id: id++, x: 80, y: 70, letter: getRandomLetter(), connections: [] },

        { id: id++, x: 95, y: 50, letter: 'END', connections: [] },
      ];

      connect(nodes, 0, 1); connect(nodes, 0, 2);
      
      // Ring 1 to Hub 1
      connect(nodes, 1, 3); connect(nodes, 2, 3);
      // But also cross connect vertical
      connect(nodes, 1, 2);

      // Hub 1 to Ring 2
      connect(nodes, 3, 4); connect(nodes, 3, 5);

      // Ring 2 to Hub 2
      connect(nodes, 4, 6); connect(nodes, 5, 6);
      // Outer ring direct path (skip hub)
      connect(nodes, 4, 7); connect(nodes, 5, 8);

      // Hub 2 to Final
      connect(nodes, 6, 7); connect(nodes, 6, 8);

      // Final to End
      connect(nodes, 7, 9); connect(nodes, 8, 9);

  } else {
    // HARD: Dense web, basically a grid with diagonals.
    // 4x3 Grid roughly
    nodes = [
        { id: id++, x: 5, y: 50, letter: 'START', connections: [] },
    ];

    // Create 3 columns of 4 nodes
    const cols = 3;
    const rows = 4;
    const gridStartId = 1;

    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            nodes.push({
                id: id++,
                x: 20 + (c * 20),
                y: 15 + (r * 23), // Spread vertically
                letter: getRandomLetter(),
                connections: []
            });
        }
    }
    
    nodes.push({ id: id++, x: 95, y: 50, letter: 'END', connections: [] });
    const endId = id - 1;

    // Connect Start to Col 0
    for(let r=0; r<rows; r++) connect(nodes, 0, gridStartId + r);

    // Connect Grid Internals
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const currentId = gridStartId + (c * rows) + r;

            // Connect Down (Vertical)
            if (r < rows - 1) {
                connect(nodes, currentId, currentId + 1);
            }

            // Connect Right (Horizontal & Diagonal)
            if (c < cols - 1) {
                const rightId = gridStartId + ((c + 1) * rows) + r;
                connect(nodes, currentId, rightId);
                
                // Diagonals for max movement options
                if (r > 0) connect(nodes, currentId, rightId - 1); // Diagonal Up-Right
                if (r < rows - 1) connect(nodes, currentId, rightId + 1); // Diagonal Down-Right
            }
        }
    }

    // Connect Last Col to End
    const lastColStart = gridStartId + ((cols - 1) * rows);
    for(let r=0; r<rows; r++) connect(nodes, lastColStart + r, endId);
  }

  return nodes;
};