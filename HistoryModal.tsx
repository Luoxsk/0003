
import React from 'react';
import { DailyEntry } from '../types';
import { MOOD_OPTIONS, UI_TEXT } from './constants';
import { X } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  entry?: DailyEntry;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, date, entry }) => {
  if (!isOpen || !date) return null;

  // Safe access to mood config
  const moodConfig = (entry && entry.mood && MOOD_OPTIONS[entry.mood]) 
    ? MOOD_OPTIONS[entry.mood] 
    : null;

  // If entry exists but config doesn't, treat as data error (or just hide the details)
  const isValidEntry = entry && moodConfig;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#fff5d7] border-[4px] border-farm-wood rounded-lg shadow-pixel w-full max-w-sm relative flex flex-col transform scale-100 transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-farm-wood text-white px-4 py-3 flex items-center justify-between border-b-[4px] border-farm-wood-dark">
           <h3 className="font-bold text-lg tracking-wide font-pixel flex items-center gap-2">
             <span>📅</span> {date}
           </h3>
           <button 
             onClick={onClose}
             className="hover:bg-white/20 p-1 rounded transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center min-h-[200px]">
           {isValidEntry ? (
             <>
               {/* Mood Icon */}
               <div className="w-24 h-24 bg-farm-wood/10 rounded-full flex items-center justify-center text-6xl border-4 border-farm-wood/20 mb-4 shadow-inner">
                  {moodConfig.emoji}
               </div>
               
               <div className="space-y-1 mb-6">
                 <h4 className="text-xl font-bold text-farm-dark">{moodConfig.label}</h4>
                 <p className="text-sm text-farm-wood font-bold bg-farm-container px-2 py-0.5 rounded inline-block">
                   {UI_TEXT.cropPlanted}: {moodConfig.cropName}
                 </p>
               </div>

               {/* Note */}
               <div className="w-full bg-white/60 border-2 border-dashed border-farm-wood/30 p-4 rounded-md text-left relative">
                  <span className="absolute -top-3 left-3 bg-[#fff5d7] px-1 text-xs font-bold text-farm-wood">
                    {UI_TEXT.fieldNotes}
                  </span>
                  <p className="text-farm-dark/90 italic text-sm leading-relaxed">
                    {entry.note ? `"${entry.note}"` : <span className="opacity-50 text-xs not-italic">(No notes written)</span>}
                  </p>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center py-8 text-farm-wood/60">
                <div className="text-5xl mb-4 grayscale opacity-50">🌱</div>
                <p className="font-bold text-lg">
                  {entry ? 'Unknown Data Record' : '那天还没有播种记录。'}
                </p>
                <p className="text-sm mt-2 opacity-70">
                  {entry ? 'Something looks wrong with this entry.' : '土地在那天静静地休息。'}
                </p>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-[4px] border-[#e6cdab] bg-[#faebd7] rounded-b-md flex justify-center">
           <button 
             onClick={onClose}
             className="bg-farm-accent text-white px-6 py-2 rounded shadow-card hover:bg-[#c96a3a] active:translate-y-1 active:shadow-none font-bold transition-all"
           >
             知道啦
           </button>
        </div>

      </div>
    </div>
  );
};
