import React, { useMemo } from 'react';
import { DailyEntry, MoodHistory } from '../types';
import { FARM_GRID_SIZE, MOOD_OPTIONS } from './constants';

interface FarmGridProps {
  history: MoodHistory;
}

export const FarmGrid: React.FC<FarmGridProps> = ({ history }) => {
  
  const gridSlots = useMemo(() => {
    const entries = (Object.values(history) as DailyEntry[]).sort((a, b) => a.date.localeCompare(b.date));
    
    // For Stardew feel, we fill from top-left, simulating days passing.
    // We show the most recent chunk of time that fits the grid.
    const relevantEntries = entries.slice(-FARM_GRID_SIZE);
    
    const slots: (DailyEntry | null)[] = [...relevantEntries];
    
    while (slots.length < FARM_GRID_SIZE) {
      slots.push(null);
    }

    return slots;
  }, [history]);

  return (
    <div className="grid grid-cols-7 gap-2 p-4 bg-[#b38856] border-t-4 border-l-4 border-[#8a6640] border-b-4 border-r-4 border-[#d6a876] shadow-inner-pixel rounded-sm">
      {gridSlots.map((entry, index) => {
        const moodConfig = entry ? MOOD_OPTIONS[entry.mood] : null;

        return (
          <div 
            key={entry ? entry.date : `empty-${index}`}
            className="aspect-square relative group cursor-default"
          >
            {/* Dirt Tile */}
            <div className={`
              w-full h-full rounded-sm relative flex items-center justify-center overflow-visible transition-colors
              ${entry 
                ? 'bg-farm-dirt-dark shadow-inner-pixel border-farm-wood' // Tilled/Planted soil
                : 'bg-farm-dirt border-[#d6a876]' // Untilled soil
              }
              border-2 
            `}>
               {/* Soil Texture */}
               <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

              {entry && moodConfig ? (
                <div className="relative z-10 transform transition-transform group-hover:scale-110 group-hover:-translate-y-1 text-3xl sm:text-4xl filter drop-shadow-sm">
                  {moodConfig.emoji}
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-[#d6a876] opacity-40"></div>
              )}
            </div>

            {/* Tooltip */}
            {entry && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-farm-paper border-4 border-farm-wood p-3 rounded-sm shadow-pixel text-sm font-pixel text-farm-dark leading-tight relative">
                  <p className="font-bold text-farm-accent border-b-2 border-farm-wood/10 pb-1 mb-1">{entry.date}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{moodConfig?.emoji}</span>
                    <span className="font-bold">{moodConfig?.label}</span>
                  </div>
                  {entry.note && (
                    <p className="text-farm-dark/80 italic mt-2 bg-white/40 p-1 rounded">"{entry.note}"</p>
                  )}
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-farm-wood rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
