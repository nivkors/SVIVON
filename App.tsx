import React, { useState, useCallback } from 'react';
import { GameState, GameStatus, Player, DREIDEL_LETTERS, DreidelLetter, Difficulty, InputMethod, GameNode } from './types';
import { generateMaze, PLAYER_COLORS } from './constants';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import ControlPanel from './components/ControlPanel';
import WinScreen from './components/WinScreen';
import { Home } from 'lucide-react';

// Custom Menorah Logo Component - 9 Branches (Hanukkiah)
const MenorahLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-yellow-400 filter drop-shadow-[0_0_3px_rgba(250,204,21,0.8)]">
    {/* Base */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 21h12M12 21v-6" />
    
    {/* Shamash (Center) */}
    <path d="M12 15V7" strokeWidth={1.5} />
    <path d="M12 5v2" strokeWidth={1.5} stroke="#FBBF24" /> {/* Flame hint */}

    {/* Branches Left */}
    <path d="M4 9v4c0 2 2 4 8 4" strokeWidth={1.5} />
    <path d="M6 10v3c0 1.5 1.5 3 6 3" strokeWidth={1.5} />
    <path d="M8 11v2c0 1 1 2 4 2" strokeWidth={1.5} />
    <path d="M10 12v1c0 0.5 0.5 1 2 1" strokeWidth={1.5} />

    {/* Branches Right */}
    <path d="M20 9v4c0 2-2 4-8 4" strokeWidth={1.5} />
    <path d="M18 10v3c0 1.5-1.5 3-6 3" strokeWidth={1.5} />
    <path d="M16 11v2c0 1-1 2-4 2" strokeWidth={1.5} />
    <path d="M14 12v1c0 0.5-0.5 1-2 1" strokeWidth={1.5} />
    
    {/* Candle Tops / Flames Row */}
    <path d="M4 7v2 M6 8v2 M8 9v2 M10 10v2 M14 10v2 M16 9v2 M18 8v2 M20 7v2" strokeWidth={1.5} strokeLinecap="round" opacity="0.8" />
  </svg>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'SETUP',
    difficulty: 'EASY',
    inputMethod: 'DIGITAL',
    players: [],
    currentPlayerIndex: 0,
    maze: [],
    lastSpinResult: null,
    isSpinning: false,
    winner: null,
    turnMessage: '',
    validNextNodes: [],
  });

  const getTurnMessage = (player: Player | undefined, maze: GameNode[]) => {
      if (!player) return '';
      const node = maze.find(n => n.id === player.currentNodeId);
      const nearEnd = node?.connections.some(id => maze.find(n => n.id === id)?.letter === 'END');
      if (nearEnd) {
          return `תור של ${player.name} - נדרש ה' או פ' לניצחון!`;
      }
      return `תור של ${player.name}`;
  };

  const startGame = (playerNames: string[], difficulty: Difficulty, inputMethod: InputMethod) => {
    const newMaze = generateMaze(difficulty);
    const newPlayers: Player[] = playerNames.map((name, i) => ({
      id: i,
      name: name,
      color: PLAYER_COLORS[i].tailwind,
      avatarColor: PLAYER_COLORS[i].text,
      currentNodeId: 0,
    }));

    setGameState({
      status: 'PLAYING',
      difficulty,
      inputMethod,
      players: newPlayers,
      currentPlayerIndex: 0,
      maze: newMaze,
      lastSpinResult: null,
      isSpinning: false,
      winner: null,
      turnMessage: getTurnMessage(newPlayers[0], newMaze),
      validNextNodes: [],
    });
  };

  // Logic to process the result (shared between digital and physical)
  const processTurnResult = (result: DreidelLetter, prevState: GameState): Partial<GameState> => {
      if (!prevState.players.length) return {};
      const currentPlayer = prevState.players[prevState.currentPlayerIndex];
      if (!currentPlayer) return {};

      const currentNode = prevState.maze.find(n => n.id === currentPlayer.currentNodeId)!;
      
      const possibleMoves = currentNode.connections.filter(neighborId => {
          const neighbor = prevState.maze.find(n => n.id === neighborId)!;
          if (neighbor.letter === 'END') {
              return result === 'ה' || result === 'פ';
          }
          return neighbor.letter === result;
      });

      let msg = `יצא: ${result}. `;
      const isNearEnd = currentNode.connections.some(id => prevState.maze.find(n => n.id === id)?.letter === 'END');

      if (possibleMoves.length === 0) {
          if (isNearEnd && (result === 'נ' || result === 'ג')) {
              msg += "אוף! כדי להיכנס לחנוכייה צריך ה' או פ'!";
          } else {
              msg += "אין לאן לזוז (נסה שוב בתור הבא).";
          }
      } else {
          if (possibleMoves.some(id => prevState.maze.find(n => n.id === id)?.letter === 'END')) {
              msg += "יש ניצחון! כנס לחנוכייה!";
          } else {
              msg += "בחר לאן להתקדם.";
          }
      }

      return {
          lastSpinResult: result,
          validNextNodes: possibleMoves,
          turnMessage: msg,
      };
  };

  const spinDreidel = useCallback(() => {
    if (gameState.isSpinning || gameState.validNextNodes.length > 0) return;

    // Step 1: Start Spinning visuals
    setGameState((prev) => ({ ...prev, isSpinning: true, turnMessage: 'הסביבון מסתובב...' }));

    const resultIndex = Math.floor(Math.random() * DREIDEL_LETTERS.length);
    const result = DREIDEL_LETTERS[resultIndex];

    // Step 2: Stop spinning physics after 2 seconds
    setTimeout(() => {
        setGameState((prev) => {
             // Guard: If reset occurred, do nothing
             if (prev.status !== 'PLAYING') return prev;

             return { 
                ...prev, 
                isSpinning: false, 
                lastSpinResult: result,
                turnMessage: 'הסביבון עוצר...' 
            };
        });

        // Step 3: Wait for visual settle
        setTimeout(() => {
            setGameState((prev) => {
                if (prev.status !== 'PLAYING' || prev.players.length === 0) return prev;

                const updates = processTurnResult(result, prev);
                
                // Handle auto-advance if no moves
                if (updates.validNextNodes && updates.validNextNodes.length === 0) {
                    setTimeout(() => advanceTurn(prev), 3000);
                }

                return { ...prev, ...updates };
            });
        }, 1800); 
    }, 2000); 
  }, [gameState.isSpinning, gameState.players, gameState.currentPlayerIndex, gameState.maze, gameState.validNextNodes]);

  const handleManualSpin = useCallback((result: DreidelLetter) => {
      if (gameState.validNextNodes.length > 0 || gameState.lastSpinResult) return;
      
      setGameState(prev => {
          if (prev.status !== 'PLAYING' || prev.players.length === 0) return prev;

          const updates = processTurnResult(result, prev);
           // Handle auto-advance if no moves
           if (updates.validNextNodes && updates.validNextNodes.length === 0) {
              setTimeout(() => advanceTurn(prev), 2500);
          }
          return { ...prev, ...updates };
      });

  }, [gameState.validNextNodes, gameState.lastSpinResult]);

  const advanceTurn = (currentState: GameState) => {
    setGameState((prev) => {
       if (prev.status !== 'PLAYING' || prev.players.length === 0) return prev;

       const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
       const nextPlayer = prev.players[nextIndex];
       
       if (!nextPlayer) return prev;

       return {
        ...prev,
        currentPlayerIndex: nextIndex,
        lastSpinResult: null,
        validNextNodes: [],
        turnMessage: getTurnMessage(nextPlayer, prev.maze),
       };
    });
  };

  const movePlayerToNode = (targetNodeId: number) => {
    setGameState((prev) => {
      const currentPlayer = prev.players[prev.currentPlayerIndex];
      if (!currentPlayer) return prev; // Guard

      const targetNode = prev.maze.find(n => n.id === targetNodeId)!;

      // Update Player position
      const updatedPlayers = prev.players.map(p => 
        p.id === currentPlayer.id ? { ...p, currentNodeId: targetNodeId } : p
      );

      // Check Win
      let newStatus: GameStatus = prev.status;
      let winner: Player | null = prev.winner;
      
      if (targetNode.letter === 'END') {
        newStatus = 'FINISHED';
        winner = currentPlayer;
      }

      // Turn change delay
      if (newStatus !== 'FINISHED') {
         setTimeout(() => {
             setGameState(s => {
                 if (s.status !== 'PLAYING' || s.players.length === 0) return s;

                 const nextIndex = (s.currentPlayerIndex + 1) % s.players.length;
                 const nextPlayer = s.players[nextIndex];

                 if (!nextPlayer) return s;

                 return {
                    ...s,
                    currentPlayerIndex: nextIndex,
                    lastSpinResult: null,
                    validNextNodes: [],
                    turnMessage: getTurnMessage(nextPlayer, s.maze),
                 };
             });
         }, 1000);
      }

      return {
        ...prev,
        players: updatedPlayers,
        status: newStatus,
        winner: winner,
        validNextNodes: [], 
      };
    });
  };

  const resetGame = () => {
      setGameState({
        status: 'SETUP',
        difficulty: 'EASY',
        inputMethod: 'DIGITAL',
        players: [],
        currentPlayerIndex: 0,
        maze: [],
        lastSpinResult: null,
        isSpinning: false,
        winner: null,
        turnMessage: '',
        validNextNodes: [],
      });
  };

  const currentPlayer = gameState.status === 'PLAYING' ? gameState.players[gameState.currentPlayerIndex] : null;

  return (
    <div className={`h-screen bg-slate-900 flex flex-col items-center relative overflow-hidden transition-colors duration-1000`}>
        
        {/* Background Atmosphere */}
        {currentPlayer && (
            <div className={`absolute inset-0 opacity-10 pointer-events-none transition-colors duration-1000 ${currentPlayer.color.replace('bg-', 'bg-gradient-to-br from-transparent to-')}`}></div>
        )}

        {/* SETUP HEADER (Only shown during Setup) */}
        {gameState.status === 'SETUP' && (
             <header className="w-full h-20 p-4 bg-slate-950 border-b-4 border-yellow-600/50 shadow-2xl flex justify-center items-center z-20 shrink-0 gap-3">
                <div className="bg-slate-800 p-2 rounded-xl shadow-inner border border-slate-700">
                    <MenorahLogo />
                </div>
                <h1 className="text-2xl font-bold text-yellow-100 tracking-wide drop-shadow-md">מבוך הסביבונים</h1>
            </header>
        )}

        {/* GAME HUD (Heads Up Display - Only shown during Playing) */}
        {gameState.status === 'PLAYING' && currentPlayer && (
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-30 pointer-events-none">
                 {/* Right Side (RTL Start): Current Player Indicator */}
                 <div className="pointer-events-auto flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-600 shadow-xl transform transition-all duration-500">
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-slate-400 font-medium">תור של</span>
                        <span className={`text-base sm:text-lg font-bold ${PLAYER_COLORS[gameState.currentPlayerIndex].text} drop-shadow-sm`}>
                            {currentPlayer.name}
                        </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${currentPlayer.color} border-2 border-white/20`}></div>
                </div>

                {/* Left Side (RTL End): Home Button */}
                <button 
                    onClick={resetGame}
                    className="pointer-events-auto p-3 rounded-full bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-600 shadow-lg transition-all active:scale-95"
                    title="חזרה למסך ראשי"
                >
                    <Home size={20} />
                </button>
            </div>
        )}

      {/* Main Content Area - Full flexibility for the board */}
      <main className="w-full flex-1 relative z-10 overflow-hidden flex items-center justify-center p-2">
        {gameState.status === 'SETUP' && <GameSetup onStart={startGame} />}
        
        {gameState.status === 'PLAYING' && (
          <div className="w-full h-full flex items-center justify-center pt-8 pb-2">
             <GameBoard 
                maze={gameState.maze} 
                players={gameState.players} 
                validNextNodes={gameState.validNextNodes}
                onNodeClick={movePlayerToNode}
             />
          </div>
        )}

        {gameState.status === 'FINISHED' && gameState.winner && (
          <WinScreen winner={gameState.winner} onReset={resetGame} />
        )}
      </main>

      {/* Footer / Control Bar */}
      {gameState.status === 'PLAYING' && (
        <div className="w-full bg-slate-950 border-t-4 border-yellow-600/50 py-2 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-20 shrink-0">
           <ControlPanel 
              gameState={gameState} 
              onSpin={spinDreidel}
              onManualInput={handleManualSpin}
            />
        </div>
      )}
    </div>
  );
};

export default App;