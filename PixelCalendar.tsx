
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MoodHistory, MoodType } from '../types';
import { MOOD_OPTIONS } from '../constants';

interface PixelCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (dateStr: string) => void;
  history: MoodHistory;
  currentDateKey: string; // Today's date to highlight
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const PixelCalendar: React.FC<PixelCalendarProps> = ({ 
  isOpen, 
  onClose, 
  onSelectDate, 
  history,
  currentDateKey 
}) => {
  // Initialize calendar to current date or today
  const [viewDate, setViewDate] = useState(new Date());

  const { days, monthLabel, yearLabel } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }
    
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(year, month, i));
    }

    return {
      days: daysArray,
      monthLabel: viewDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      yearLabel: year
    };
  }, [viewDate]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDayClick = (date: Date) => {
    // Format to YYYY-MM-DD using local time to avoid timezone shifts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    onSelectDate(dateStr);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-[#fff5d7] border-[6px] border-farm-wood rounded-lg shadow-pixel w-full max-w-xs relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Screws */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-farm-wood/40 rounded-full"></div>
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-farm-wood/40 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-farm-wood/40 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-farm-wood/40 rounded-full"></div>

        {/* Header */}
        <div className="bg-farm-wood p-2 flex items-center justify-between border-b-4 border-farm-wood-dark">
           <button onClick={handlePrevMonth} className="text-white hover:bg-white/20 p-1 rounded transition-colors">
             <ChevronLeft size={20} />
           </button>
           
           <div className="font-pixel text-2xl text-white tracking-widest pt-1">
             {monthLabel} {yearLabel}
           </div>

           <button onClick={handleNextMonth} className="text-white hover:bg-white/20 p-1 rounded transition-colors">
             <ChevronRight size={20} />
           </button>
        </div>

        {/* Grid */}
        <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map(d => (
                    <div key={d} className="text-center font-pixel text-farm-wood/60 text-lg font-bold">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;

                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateKey = `${year}-${month}-${day}`;

                    const entry = history[dateKey];
                    const isToday = dateKey === currentDateKey;
                    const moodConfig = entry ? MOOD_OPTIONS[entry.mood] : null;

                    return (
                        <button
                            key={dateKey}
                            onClick={() => handleDayClick(date)}
                            className={`
                                aspect-square rounded-sm relative flex items-center justify-center text-lg font-pixel
                                border-2 transition-all hover:z-10 hover:scale-110
                                ${isToday 
                                    ? 'bg-farm-wood text-white border-farm-wood-dark shadow-sm' 
                                    : 'bg-[#f7e9cc] text-farm-wood border-[#e6cdab] hover:bg-white hover:border-farm-accent'
                                }
                            `}
                        >
                            {/* Date Number */}
                            <span className="relative z-10">{date.getDate()}</span>

                            {/* Crop Marker (if history exists) */}
                            {moodConfig && !isToday && (
                                <div className="absolute bottom-0.5 right-0.5 text-[10px] opacity-80">
                                    {moodConfig.emoji}
                                </div>
                            )}
                            {/* Today Marker Highlight */}
                            {isToday && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-farm-accent rounded-full animate-pulse"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Footer Legend */}
        <div className="px-4 pb-4 pt-2 text-center">
            <p className="text-xs text-farm-wood/60 font-hand">
                点击日期查看当时的日记
            </p>
        </div>
      </div>
    </div>
  );
};
