import React from 'react';
import { Player } from '../types';
import { Flame, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface WinScreenProps {
  winner: Player;
  onReset: () => void;
}

const WinScreen: React.FC<WinScreenProps> = ({ winner, onReset }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-slate-800 border-2 border-yellow-500 rounded-2xl p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.3)]"
      >
        <div className="flex flex-col items-center justify-center mb-6 h-48">
            {/* Menorah Illustration */}
            <div className="relative">
                <div className="flex items-end justify-center gap-2">
                    {[...Array(9)].map((_, i) => {
                        const isShamash = i === 4;
                        const targetHeight = isShamash ? 64 : 40; // Pixels equivalent to h-16 and h-10
                        // Animation delay: Center moves first, then outward
                        const delay = Math.abs(i - 4) * 0.1 + 0.3;

                        return (
                            <div key={i} className="flex flex-col items-center justify-end">
                                {/* Flame - Pops in after candle grows */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: delay + 0.4, type: "spring" }}
                                    className="mb-1"
                                >
                                    <motion.div
                                        animate={{ 
                                            opacity: [0.7, 1, 0.7], 
                                            scale: [1, 1.15, 1],
                                            filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                                        }}
                                        transition={{ 
                                            duration: 1.5 + Math.random(), 
                                            repeat: Infinity, 
                                            delay: Math.random() // Randomize flicker start
                                        }}
                                    >
                                        <Flame 
                                            className={`w-6 h-6 ${isShamash ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]' : 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]'}`} 
                                            fill="currentColor" 
                                        />
                                    </motion.div>
                                </motion.div>
                                
                                {/* Candle Stem - Grows up */}
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: targetHeight }}
                                    transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
                                    className={`w-3 ${isShamash ? 'bg-yellow-600' : 'bg-yellow-700'} rounded-t-sm rounded-b-none shadow-inner`}
                                ></motion.div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Base Animation */}
                <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <div className="h-4 bg-yellow-800 rounded mt-0 w-full shadow-lg"></div>
                    <div className="w-8 h-8 bg-yellow-800 shadow-lg"></div>
                    <div className="w-32 h-3 bg-yellow-800 rounded-full shadow-xl"></div>
                </motion.div>
            </div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
        >
            <h2 className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-md">כל הכבוד!</h2>
            <p className="text-xl text-white mb-8">
                <span className={`font-bold ${winner.avatarColor}`}>{winner.name}</span> הגיע לחנוכייה ראשון!
            </p>

            <button
                onClick={onReset}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 mx-auto transition-all active:scale-95 shadow-lg shadow-blue-900/50"
            >
                <RotateCcw size={20} />
                משחק חדש
            </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WinScreen;