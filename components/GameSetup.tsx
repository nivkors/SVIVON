import React, { useState } from 'react';
import { Users, Play, Layers, Smartphone, Box } from 'lucide-react';
import { PLAYER_COLORS } from '../constants';
import { Difficulty, InputMethod } from '../types';

interface GameSetupProps {
  onStart: (names: string[], difficulty: Difficulty, inputMethod: InputMethod) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(['', '', '', '']);
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [inputMethod, setInputMethod] = useState<InputMethod>('DIGITAL');

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleStart = () => {
    const finalNames = Array.from({ length: playerCount }).map((_, i) => 
      names[i].trim() || `שחקן ${i + 1}`
    );
    onStart(finalNames, difficulty, inputMethod);
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur p-6 rounded-2xl shadow-2xl border border-slate-700 max-w-4xl w-full text-center mx-4 flex flex-col md:flex-row gap-8">
      
      {/* Left Column (Inputs) */}
      <div className="flex-1 space-y-6">
        <div>
            <h2 className="text-xl font-bold mb-4 text-white flex items-center justify-center gap-2">
                <Users className="text-blue-400" />
                פרטי שחקנים
            </h2>
            
            <div className="mb-4">
                <div className="flex justify-center gap-3">
                {[2, 3, 4].map((num) => (
                    <button
                    key={num}
                    onClick={() => setPlayerCount(num)}
                    className={`w-10 h-10 rounded-lg text-lg font-bold transition-all duration-200 border-2 ${
                        playerCount === num
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                        : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                    }`}
                    >
                    {num}
                    </button>
                ))}
                </div>
            </div>

            <div className="space-y-2">
                {Array.from({ length: playerCount }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-700/50 p-2 rounded-lg border border-slate-600 focus-within:border-blue-500 transition-colors">
                        <div className={`w-6 h-6 rounded-full ${PLAYER_COLORS[i].tailwind} border border-white/20 flex items-center justify-center text-[10px] text-white font-bold`}>
                            {i + 1}
                        </div>
                        <input
                            type="text"
                            placeholder={`שם לשחקן ${i + 1}`}
                            value={names[i]}
                            onChange={(e) => handleNameChange(i, e.target.value)}
                            className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500 text-sm"
                            maxLength={10}
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-slate-700"></div>

      {/* Right Column (Settings) */}
      <div className="flex-1 flex flex-col justify-between gap-6">
         
         {/* Difficulty */}
         <div>
            <h2 className="text-xl font-bold mb-3 text-white flex items-center justify-center gap-2">
                <Layers className="text-orange-400" />
                רמת קושי
            </h2>
            <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => {
                    const labels = { EASY: 'קל', MEDIUM: 'בינוני', HARD: 'קשה' };
                    const isSelected = difficulty === level;
                    return (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`p-2 rounded-xl border-2 transition-all text-sm font-bold ${
                                isSelected 
                                ? 'bg-orange-600 border-orange-400 text-white shadow-lg' 
                                : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                            }`}
                        >
                            {labels[level]}
                        </button>
                    );
                })}
            </div>
         </div>

         {/* Input Method */}
         <div>
            <h2 className="text-xl font-bold mb-3 text-white flex items-center justify-center gap-2">
                <Box className="text-emerald-400" />
                סוג סביבון
            </h2>
            <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={() => setInputMethod('DIGITAL')}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        inputMethod === 'DIGITAL' 
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' 
                        : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                    }`}
                 >
                    <Smartphone size={20} />
                    <span className="text-sm font-bold">סביבון במשחק</span>
                 </button>
                 <button
                    onClick={() => setInputMethod('PHYSICAL')}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        inputMethod === 'PHYSICAL' 
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' 
                        : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                    }`}
                 >
                    <Box size={20} />
                    <span className="text-sm font-bold">סביבון אמיתי</span>
                 </button>
            </div>
         </div>

         <button
            onClick={handleStart}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-blue-900/50"
        >
            <Play size={24} fill="currentColor" />
            יאללה מתחילים!
        </button>
      </div>
    </div>
  );
};

export default GameSetup;