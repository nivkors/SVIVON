import React from 'react';
import { GameState, DreidelLetter, DREIDEL_LETTERS } from '../types';
import Dreidel from './Dreidel';
import { RotateCw, Compass, AlertCircle } from 'lucide-react';

interface ControlPanelProps {
  gameState: GameState;
  onSpin: () => void;
  onManualInput: (letter: DreidelLetter) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ gameState, onSpin, onManualInput }) => {
  const { isSpinning, lastSpinResult, validNextNodes, turnMessage, inputMethod, players, currentPlayerIndex, maze } = gameState;
  
  const canSpin = !isSpinning && !lastSpinResult;
  const isWaitingForMove = !isSpinning && lastSpinResult !== null;

  // Check if player is near end
  const currentPlayer = players[currentPlayerIndex];
  const currentNode = maze.find(n => n.id === currentPlayer?.currentNodeId);
  const isNearEnd = currentNode?.connections.some(id => maze.find(n => n.id === id)?.letter === 'END');

  return (
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-1">
      
      {/* Message Area */}
      <div className="flex-1 text-center sm:text-right order-2 sm:order-1 min-w-[150px]">
        <h3 className="text-base sm:text-lg font-bold text-white mb-1 leading-tight">{turnMessage}</h3>
        
        {/* Win Hint Badge */}
        {isNearEnd && !isSpinning && !lastSpinResult && (
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse mb-1">
                <AlertCircle size={12} />
                <span>יש להשיג ה' או פ' לניצחון!</span>
            </div>
        )}

        {isWaitingForMove && (
            <div className="text-slate-300 text-xs sm:text-sm animate-pulse flex items-center gap-1 justify-center sm:justify-start">
                <Compass size={14} />
                {validNextNodes.length > 0 
                  ? "לחץ על עיגול מהבהב כדי לזוז" 
                  : "אין מהלכים, ממתין..."}
            </div>
        )}
      </div>

      {/* Center Display: 3D Dreidel (Digital) OR Instructions (Physical) */}
      <div className="order-1 sm:order-2 flex justify-center items-center h-28 sm:h-auto overflow-visible">
         {inputMethod === 'DIGITAL' ? (
            // Scale down the Dreidel visually to fit in compact footer
            <div className="scale-75 origin-center sm:scale-100">
                <Dreidel spinning={isSpinning} result={lastSpinResult} />
            </div>
         ) : (
             <div className="w-20 h-20 flex items-center justify-center">
                {/* Physical mode placeholder */}
                {lastSpinResult ? (
                    <div className="w-16 h-16 bg-gradient-to-br from-[#e3cca8] to-[#c19a6b] rounded-xl flex items-center justify-center shadow-lg border-2 border-[#8b5e3c]">
                        <span className="text-3xl font-serif font-bold text-[#5c3a21]">{lastSpinResult}</span>
                    </div>
                ) : (
                    <div className="text-slate-500 text-xs text-center leading-tight">
                        סובב סביבון<br/>אמיתי
                    </div>
                )}
             </div>
         )}
      </div>

      {/* Action Button Area */}
      <div className="flex-1 flex justify-center sm:justify-end order-3">
        {canSpin ? (
            inputMethod === 'DIGITAL' ? (
                // Digital Spin Button
                <button
                    onClick={onSpin}
                    className="group relative px-6 py-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg shadow-orange-900/30 transform transition-all hover:scale-105 active:scale-95"
                >
                    <div className="flex items-center gap-2 text-orange-950 font-bold text-lg">
                        <RotateCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        סובב
                    </div>
                </button>
            ) : (
                // Physical Input Buttons
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-2">
                    {DREIDEL_LETTERS.map((letter) => (
                        <button
                            key={letter}
                            onClick={() => onManualInput(letter)}
                            className="w-12 h-10 sm:w-14 sm:h-12 bg-[#e3cca8] hover:bg-[#d4b483] border-b-2 sm:border-b-4 border-[#8b5e3c] active:border-b-0 active:mt-1 rounded-md text-xl font-bold font-serif text-[#5c3a21] shadow-sm transition-all"
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            )
        ) : (
             <div className="h-10 flex items-center text-slate-500 italic text-sm">
                {isSpinning ? "בהצלחה..." : "בחר צעד..."}
             </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;