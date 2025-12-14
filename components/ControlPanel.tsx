import React from 'react';
import { GameState, DreidelLetter, DREIDEL_LETTERS } from '../types';
import Dreidel from './Dreidel';
import { RotateCw, Compass, AlertCircle } from 'lucide-react';

interface ControlPanelProps {
  gameState: GameState;
  onSpin: () => void;
  onManualInput: (letter: DreidelLetter) => void;
  isMobile?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ gameState, onSpin, onManualInput, isMobile = false }) => {
  const { isSpinning, lastSpinResult, validNextNodes, turnMessage, inputMethod, maze, currentPlayerIndex, players } = gameState;
  
  const canSpin = !isSpinning && !lastSpinResult;
  const isWaitingForMove = !isSpinning && lastSpinResult !== null;

  // Check if player is near end
  const currentPlayer = players[currentPlayerIndex];
  const currentNode = maze.find(n => n.id === currentPlayer?.currentNodeId);
  const isNearEnd = currentNode?.connections.some(id => maze.find(n => n.id === id)?.letter === 'END');

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4 px-1 w-full">
      
      {/* Mobile Top Row: Message */}
      <div className="w-full md:w-auto md:flex-1 text-center md:text-right order-1 min-w-[150px] mb-1 md:mb-0">
        <h3 className="text-sm md:text-lg font-bold text-white leading-tight">{turnMessage}</h3>
        
        {/* Win Hint Badge */}
        {isNearEnd && !isSpinning && !lastSpinResult && (
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold animate-pulse mt-0.5">
                <AlertCircle size={10} className="md:w-3 md:h-3" />
                <span>יש להשיג ה' או פ' לניצחון!</span>
            </div>
        )}

        {isWaitingForMove && (
            <div className="text-slate-300 text-xs md:text-sm animate-pulse flex items-center gap-1 justify-center md:justify-start">
                <Compass size={12} className="md:w-3.5 md:h-3.5" />
                {validNextNodes.length > 0 
                  ? "לחץ על עיגול מהבהב" 
                  : "אין מהלכים"}
            </div>
        )}
      </div>

      {/* Center: Dreidel & Action Buttons row on mobile */}
      <div className="order-2 w-full flex flex-row md:flex-col items-center justify-center gap-3 md:gap-0">
         
         {/* The Dreidel */}
         <div className="flex justify-center items-center h-20 md:h-auto overflow-visible md:order-1">
             {inputMethod === 'DIGITAL' ? (
                // Scale down significantly on mobile
                <div className="scale-[0.55] md:scale-100 origin-center">
                    <Dreidel spinning={isSpinning} result={lastSpinResult} />
                </div>
             ) : (
                 <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    {lastSpinResult ? (
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#e3cca8] to-[#c19a6b] rounded-xl flex items-center justify-center shadow-lg border-2 border-[#8b5e3c]">
                            <span className="text-2xl md:text-3xl font-serif font-bold text-[#5c3a21]">{lastSpinResult}</span>
                        </div>
                    ) : (
                        <div className="text-slate-500 text-[10px] md:text-xs text-center leading-tight">
                            סובב סביבון<br/>אמיתי
                        </div>
                    )}
                 </div>
             )}
         </div>

         {/* Action Buttons (On mobile, sits next to dreidel) */}
         <div className="md:flex-1 flex justify-center md:justify-end md:order-2">
            {canSpin ? (
                inputMethod === 'DIGITAL' ? (
                    // Digital Spin Button
                    <button
                        onClick={onSpin}
                        className="group relative px-6 py-3 md:px-6 md:py-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg shadow-orange-900/30 transform transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="flex items-center gap-2 text-orange-950 font-bold text-base md:text-lg">
                            <RotateCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            {isMobile ? "סובב" : "סובב סביבון"}
                        </div>
                    </button>
                ) : (
                    // Physical Input Buttons
                    <div className="grid grid-cols-4 sm:grid-cols-2 gap-1.5 md:gap-2">
                        {DREIDEL_LETTERS.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => onManualInput(letter)}
                                className="w-10 h-10 md:w-14 md:h-12 bg-[#e3cca8] hover:bg-[#d4b483] border-b-2 sm:border-b-4 border-[#8b5e3c] active:border-b-0 active:mt-1 rounded-md text-lg md:text-xl font-bold font-serif text-[#5c3a21] shadow-sm transition-all"
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                )
            ) : (
                 <div className="h-10 flex items-center text-slate-500 italic text-xs md:text-sm">
                    {isSpinning ? "" : "בחר צעד..."} 
                 </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ControlPanel;