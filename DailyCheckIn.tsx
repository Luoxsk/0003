
import React, { useState, useEffect } from 'react';
import { MoodType, DailyEntry, MoodConfig } from './types';
import { MOOD_OPTIONS, UI_TEXT } from './constants';
import { Axe } from 'lucide-react';

interface DailyCheckInProps {
  today: string;
  existingEntry?: DailyEntry;
  onSave: (entry: DailyEntry) => void;
  onMoodChange?: (mood: MoodType | null) => void;
  onRemove?: (date: string) => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ today, existingEntry, onSave, onMoodChange, onRemove }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (onMoodChange) onMoodChange(selectedMood);
  }, [selectedMood, onMoodChange]);

  useEffect(() => {
    if (existingEntry && onMoodChange) onMoodChange(existingEntry.mood);
  }, [existingEntry, onMoodChange]);

  const handleSubmit = () => {
    if (!selectedMood) return;
    const newEntry: DailyEntry = {
      date: today,
      mood: selectedMood,
      note: note.trim(),
      timestamp: Date.now()
    };
    onSave(newEntry);
  };

  // --- Card Container Style ---
  const cardClasses = "bg-farm-paper border-[6px] border-farm-wood rounded-lg shadow-card p-5 h-full flex flex-col";
  const titleClasses = "bg-[#9b6b39] text-white px-3 py-1 rounded-md inline-block mb-4 text-lg shadow-sm self-start";

  // --- VIEW: Already Planted ---
  if (existingEntry) {
    const moodConfig = MOOD_OPTIONS[existingEntry.mood];
    
    // Safety check: If local storage has a mood that doesn't exist in config, don't crash
    if (!moodConfig) {
        return (
            <div className={cardClasses}>
                <div className={titleClasses}>{UI_TEXT.harvestLog}</div>
                <div className="flex-1 flex flex-col items-center justify-center text-farm-wood/60">
                    <p>Unknown Crop Data</p>
                    {onRemove && (
                        <button onClick={() => onRemove(today)} className="mt-2 underline text-farm-accent">
                            {UI_TEXT.removePlant}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
      <div className={cardClasses}>
        <div className={titleClasses}>{UI_TEXT.harvestLog}</div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-farm-wood/10 rounded-full flex items-center justify-center text-5xl animate-bounce-slow border-2 border-farm-wood/20">
              {moodConfig.emoji}
          </div>
          
          <div>
            <p className="text-lg font-bold text-farm-dark">
              {UI_TEXT.cropPlanted}: <span className="text-farm-accent">{moodConfig.cropName}</span>
            </p>
            <div className="text-xs bg-farm-wood text-white px-2 py-0.5 rounded-full inline-block mt-1 opacity-80">
              {moodConfig.label}
            </div>
          </div>

          {existingEntry.note && (
            <div className="bg-white/60 p-3 border-2 border-dashed border-farm-wood/30 w-full text-left rounded-sm text-sm italic text-farm-dark/80 relative mt-2">
               <span className="absolute -top-2.5 left-2 bg-farm-paper px-1 text-xs font-bold text-farm-wood">Note</span>
               "{existingEntry.note}"
            </div>
          )}

          {onRemove && (
              <button 
                onClick={() => onRemove(today)}
                className="mt-4 text-xs flex items-center gap-1 text-farm-accent/70 hover:text-farm-accent hover:underline"
              >
                <Axe size={12} /> {UI_TEXT.removePlant}
              </button>
            )}
        </div>
      </div>
    );
  }

  // --- VIEW: Planting Form ---
  return (
    <div className={cardClasses}>
      <div className={titleClasses}>{UI_TEXT.dailyPlanting}</div>

      <div className="space-y-4">
        
        {/* Seed Selection - Horizontal Row */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-farm-dark/80 block">{UI_TEXT.selectSeed}</label>
          <div className="flex justify-between gap-2">
            {Object.values(MOOD_OPTIONS).map((option: MoodConfig) => (
              <button
                key={option.id}
                onClick={() => setSelectedMood(option.id)}
                className={`
                  flex flex-col items-center justify-center p-1.5 rounded-md transition-all w-14 h-20 border-2
                  ${selectedMood === option.id 
                    ? 'bg-[#ffe4bc] border-farm-accent shadow-[0_0_0_2px_#d87c4a] -translate-y-1' 
                    : 'bg-farm-container border-[#b8925b] hover:bg-white hover:-translate-y-0.5'}
                `}
                title={option.description}
              >
                <span className="text-2xl mb-1 filter drop-shadow-sm">{option.emoji}</span>
                <span className={`text-[10px] font-bold ${selectedMood === option.id ? 'text-farm-accent' : 'text-farm-wood'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Note Area */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-farm-dark/80 block">{UI_TEXT.fieldNotes}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={UI_TEXT.journalPlaceholder}
            className="w-full h-20 p-3 bg-white border-2 border-farm-cell rounded-md focus:border-farm-accent outline-none text-sm text-farm-dark placeholder:text-farm-wood/30 resize-none block shadow-inner"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedMood}
          className={`
            w-full py-2.5 rounded-md text-lg font-bold text-white shadow-card transition-all mt-2
            ${selectedMood 
              ? 'bg-farm-accent hover:bg-[#c96a3a] active:translate-y-1 active:shadow-none' 
              : 'bg-gray-400 cursor-not-allowed opacity-70'}
          `}
        >
          {UI_TEXT.plantSeed}
        </button>
      </div>
    </div>
  );
};
