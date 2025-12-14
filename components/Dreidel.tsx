import React, { useEffect, useState, useRef } from 'react';
import { DreidelLetter } from '../types';
import { motion } from 'framer-motion';

interface DreidelProps {
  spinning: boolean;
  result: DreidelLetter | null;
}

const Dreidel: React.FC<DreidelProps> = ({ spinning, result }) => {
  const [rotationY, setRotationY] = useState(0);
  const absoluteRotationRef = useRef(0);

  // --- Constants for Geometry ---
  const SIZE = 60; // Reduced width of the cube face
  const HALF = SIZE / 2;
  const PYRAMID_HEIGHT = 45; 
  // Calculate angle for pyramid faces to meet at center
  // tan(angle) = height / radius(HALF)
  // angle from bottom plane = atan(PYRAMID_HEIGHT / HALF)
  // rotationX needed = 90 - angle (roughly 35deg inward tilt)
  // Actually, simpler visual tweak: ~35 deg works for these proportions
  const TILT_ANGLE = 35; 
  const TRIANGLE_HEIGHT = Math.sqrt(Math.pow(HALF, 2) + Math.pow(PYRAMID_HEIGHT, 2));

  // Map letters to rotation angles (Y axis)
  const getTargetRotation = (letter: DreidelLetter) => {
    switch (letter) {
      case 'נ': return 0;   // Front
      case 'ג': return -90; // Right
      case 'ה': return -180;// Back
      case 'פ': return -270;// Left
      default: return 0;
    }
  };

  useEffect(() => {
    let animationFrame: number;

    const animateSpin = () => {
      absoluteRotationRef.current -= 25; 
      setRotationY(absoluteRotationRef.current);
      animationFrame = requestAnimationFrame(animateSpin);
    };

    if (spinning) {
      animateSpin();
    } else if (result) {
      if (animationFrame) cancelAnimationFrame(animationFrame);

      const current = absoluteRotationRef.current;
      const targetRel = getTargetRotation(result);
      
      const remainder = current % 360; 
      let diff = targetRel - remainder;
      if (diff > 0) diff -= 360;
      const extraSpins = -720; // 2 full extra spins for effect

      const finalRotation = current + diff + extraSpins;
      
      absoluteRotationRef.current = finalRotation;
      setRotationY(finalRotation);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [spinning, result]);

  // --- Styles ---

  const cubeFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%)', // Royal Blue Metal
    border: '3px solid #FCD34D', // Gold Frame (slightly thinner)
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'visible', // Solid object
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)', // Inner depth
  };

  const triangleFaceStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${SIZE}px`, // Start right below the cube
    left: 0,
    width: `${SIZE}px`,
    height: `${TRIANGLE_HEIGHT}px`,
    background: 'linear-gradient(to bottom, #1e3a8a, #172554)',
    clipPath: 'polygon(0 0, 100% 0, 50% 100%)', // Create triangle shape
    transformOrigin: 'top center', // Hinge from top
    backfaceVisibility: 'visible',
    borderTop: '3px solid #FCD34D', // Gold line at connection
  };

  const letterStyle: React.CSSProperties = {
    color: '#fbbf24', // Gold
    fontSize: '32px', // Reduced font size
    fontWeight: 'bold',
    fontFamily: 'serif',
    textShadow: '1px 1px 0 #78350f, -1px -1px 0 #fffbeb', // Embossed effect
    transform: 'translateZ(2px)', // Pop out slightly
  };

  return (
    <div className="relative w-40 h-52 flex items-center justify-center" style={{ perspective: '800px' }}>
      <motion.div
        animate={{ 
            rotateY: rotationY,
            rotateX: spinning ? -5 : -10, // Slight tilt forward
            rotateZ: spinning ? [0, 2, -2, 0] : 0, // Wobble
            y: (!spinning && !result) ? [0, -10, 0] : 0 
        }}
        transition={spinning 
            ? { rotateZ: { duration: 0.2, repeat: Infinity } } 
            : (result 
                ? { rotateY: { duration: 2.5, ease: [0.15, 0.85, 0.35, 1] } } 
                : { y: { duration: 3, repeat: Infinity, ease: "easeInOut" } } 
              )
        }
        className="relative transform-style-3d" 
        style={{ width: SIZE, height: SIZE, transformStyle: 'preserve-3d' }}
      >
        {/* --- HANDLE --- */}
        <div className="absolute top-0 left-1/2 w-4 h-16 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 rounded-t-lg"
             style={{ transform: `translateY(-55px) translateX(-50%)`, boxShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>
             {/* Handle Top Ring */}
             <div className="absolute top-2 w-full h-1.5 bg-yellow-700 opacity-50"></div>
        </div>
        
        {/* --- TOP LID --- */}
        <div style={{
            position: 'absolute',
            width: SIZE, height: SIZE,
            background: 'radial-gradient(circle, #FCD34D 20%, #1e3a8a 80%)',
            transform: `rotateX(90deg) translateZ(${HALF}px)`,
            border: '3px solid #FCD34D'
        }}></div>

        {/* --- CUBE SIDES (With Letters) --- */}
        {/* Front (Nun) */}
        <div style={{ ...cubeFaceStyle, transform: `rotateY(0deg) translateZ(${HALF}px)` }}>
          <span style={letterStyle}>נ</span>
          {/* Reflection Glint */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>

        {/* Right (Gimel) */}
        <div style={{ ...cubeFaceStyle, transform: `rotateY(90deg) translateZ(${HALF}px)` }}>
          <span style={letterStyle}>ג</span>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>

        {/* Back (Hay) */}
        <div style={{ ...cubeFaceStyle, transform: `rotateY(180deg) translateZ(${HALF}px)` }}>
          <span style={letterStyle}>ה</span>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>

        {/* Left (Pe) */}
        <div style={{ ...cubeFaceStyle, transform: `rotateY(-90deg) translateZ(${HALF}px)` }}>
          <span style={letterStyle}>פ</span>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>

        {/* --- BOTTOM PYRAMID (Solid Triangles) --- */}
        
        {/* Front Triangle */}
        <div style={{ 
            ...triangleFaceStyle, 
            transform: `rotateY(0deg) translateZ(${HALF}px) rotateX(-${TILT_ANGLE}deg)` 
        }}>
            {/* Fake Gold Edge (Right) */}
            <div className="absolute top-0 right-[25%] h-full w-[1.5px] bg-yellow-400/50 transform skew-x-12 origin-top"></div>
        </div>

        {/* Right Triangle */}
        <div style={{ 
            ...triangleFaceStyle, 
            transform: `rotateY(90deg) translateZ(${HALF}px) rotateX(-${TILT_ANGLE}deg)` 
        }}></div>

        {/* Back Triangle */}
        <div style={{ 
            ...triangleFaceStyle, 
            transform: `rotateY(180deg) translateZ(${HALF}px) rotateX(-${TILT_ANGLE}deg)` 
        }}></div>

        {/* Left Triangle */}
        <div style={{ 
            ...triangleFaceStyle, 
            transform: `rotateY(-90deg) translateZ(${HALF}px) rotateX(-${TILT_ANGLE}deg)` 
        }}></div>

        {/* Tip (Cover the point) */}
        <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full blur-[1px]"
             style={{ 
                 top: SIZE + PYRAMID_HEIGHT - 2, 
                 left: HALF - 0.75, 
                 transform: 'translateZ(0)' 
             }}></div>

      </motion.div>

      {/* Shadow */}
      <div className={`absolute -bottom-8 w-20 h-5 bg-black/40 rounded-[100%] blur-md transition-all duration-300 ${spinning ? 'scale-125 opacity-40' : 'scale-100 opacity-60'}`} 
           style={{ transform: 'rotateX(60deg)' }}></div>
    </div>
  );
};

export default Dreidel;