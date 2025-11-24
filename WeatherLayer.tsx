import React, { useMemo } from 'react';
import { MoodType } from '../types';

interface WeatherLayerProps {
  mood: MoodType | null;
}

type WeatherType = 'sunny' | 'cloudy' | 'light_rain' | 'heavy_rain' | 'snow';

export const WeatherLayer: React.FC<WeatherLayerProps> = ({ mood }) => {
  
  const weather: WeatherType = useMemo(() => {
    switch (mood) {
      case 'happy': return 'sunny';
      case 'calm': return 'cloudy';
      case 'tired': return 'light_rain';
      case 'anxious': return 'heavy_rain';
      case 'sad': return 'snow';
      default: return 'sunny';
    }
  }, [mood]);

  // Generate random particles to avoid hydration mismatches, we'd typically use useEffect
  // but for simple visual bg, stable random numbers based on index are fine.
  const generateParticles = (count: number) => Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 2 + 2}s`, // 2-4s
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 1. Base Grass Layer (Dynamic Shake for Sunny) */}
      <div 
        className={`absolute inset-0 bg-[#63a746] transition-transform duration-[4000ms] ease-in-out ${weather === 'sunny' ? 'animate-wiggle' : ''}`}
        style={{
          backgroundImage: `
            linear-gradient(45deg, #57943e 25%, transparent 25%, transparent 75%, #57943e 75%, #57943e),
            linear-gradient(45deg, #57943e 25%, transparent 25%, transparent 75%, #57943e 75%, #57943e)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          imageRendering: 'pixelated',
        }}
      />

      {/* 2. Color Overlays / Global Atmosphere */}
      <div className={`absolute inset-0 transition-colors duration-1000 
        ${weather === 'sunny' ? 'bg-orange-500/10 mix-blend-overlay' : ''}
        ${weather === 'cloudy' ? 'bg-indigo-200/10' : ''}
        ${weather === 'light_rain' ? 'bg-slate-800/30' : ''}
        ${weather === 'heavy_rain' ? 'bg-slate-900/60' : ''}
        ${weather === 'snow' ? 'bg-white/5' : ''}
      `}></div>

      {/* 3. Weather Specific Effects */}
      
      {/* SUNNY: Particles */}
      {weather === 'sunny' && (
        <div className="absolute inset-0">
          {generateParticles(15).map((p) => (
            <div
              key={p.id}
              className="absolute w-2 h-2 bg-yellow-200 rounded-full blur-[1px]"
              style={{
                left: p.left,
                top: `${Math.random() * 100}%`,
                opacity: p.opacity,
                animation: `sun-pulse ${p.duration} infinite ${p.delay}`,
              }}
            />
          ))}
          {/* Sun flare gradient */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-yellow-400/20 to-transparent opacity-50" />
        </div>
      )}

      {/* CLOUDY: Drifting Clouds */}
      {weather === 'cloudy' && (
        <div className="absolute inset-0">
           {/* Cloud Layer 1 (Slow) */}
           <div className="absolute top-[10%] left-0 w-full h-32 opacity-60" style={{ animation: 'cloud-drift 60s linear infinite' }}>
             <PixelCloud scale={1.5} color="#e0f2fe" />
           </div>
           <div className="absolute top-[20%] left-[50%] w-full h-32 opacity-50" style={{ animation: 'cloud-drift 80s linear infinite' }}>
             <PixelCloud scale={1.2} color="#e0f2fe" />
           </div>
           {/* Cloud Layer 2 (Faster) */}
           <div className="absolute top-[5%] left-[-20%] w-full h-32 opacity-80" style={{ animation: 'cloud-drift 45s linear infinite' }}>
             <PixelCloud scale={0.8} color="#fff" />
           </div>
        </div>
      )}

      {/* RAIN: Falling Drops */}
      {(weather === 'light_rain' || weather === 'heavy_rain') && (
        <div className="absolute inset-0">
          {generateParticles(weather === 'heavy_rain' ? 80 : 30).map((p) => (
            <div
              key={p.id}
              className="absolute w-[2px] bg-blue-200 opacity-60"
              style={{
                left: p.left,
                height: weather === 'heavy_rain' ? '20px' : '12px',
                animation: `rain-fall ${Math.random() * 0.5 + 0.5}s linear infinite ${Math.random() * 2}s`,
                opacity: Math.random() * 0.4 + 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* HEAVY RAIN: Lightning */}
      {weather === 'heavy_rain' && (
        <div 
          className="absolute inset-0 bg-white pointer-events-none mix-blend-hard-light"
          style={{ animation: 'lightning-flash 10s infinite' }}
        ></div>
      )}

      {/* SNOW: Falling Flakes */}
      {weather === 'snow' && (
        <div className="absolute inset-0">
           {generateParticles(40).map((p) => (
             <div
               key={p.id}
               className="absolute w-2 h-2 bg-white opacity-80"
               style={{
                  left: p.left,
                  animation: `snow-fall ${Math.random() * 3 + 4}s linear infinite ${Math.random() * 5}s`,
               }}
             >
               {/* Tiny pixel flake shape */}
               <div className="w-full h-full bg-white shadow-[1px_1px_0_rgba(0,0,0,0.1)]"></div>
             </div>
           ))}
        </div>
      )}

    </div>
  );
};

// Simple CSS/SVG Pixel Cloud Component
const PixelCloud: React.FC<{ scale: number; color: string }> = ({ scale, color }) => (
  <div style={{ transform: `scale(${scale})` }} className="relative inline-block">
    <svg width="100" height="60" viewBox="0 0 100 60" fill={color} xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="20" height="20" />
      <rect x="40" y="10" width="20" height="20" />
      <rect x="60" y="20" width="20" height="20" />
      <rect x="30" y="30" width="40" height="20" />
      <rect x="10" y="30" width="20" height="10" />
      <rect x="70" y="30" width="20" height="10" />
    </svg>
  </div>
);
