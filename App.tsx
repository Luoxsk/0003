
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MoodHistory, DailyEntry, MoodType, PetType } from './types';
import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_PET_NAME, LOCAL_STORAGE_PET_TYPE, UI_TEXT } from './constants';
import FarmGrid from "./FarmGrid";
import FarmSpirit from "./FarmSpirit";
import HistoryModal from "./HistoryModal";
import MoodKitchen from "./MoodKitchen";
import NameModal from "./NameModal";
import DailyCheckIn from "./DailyCheckIn";
import ChatInterface from "./ChatInterface";
import PixelCalendar from "./PixelCalendar";
import StatsPanel from "./StatsPanel";
import WeatherLayer from "./WeatherLayer";
 // Import NameModal
import { Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [history, setHistory] = useState<MoodHistory>({});
  const [todayKey, setTodayKey] = useState<string>('');
  const [weatherMood, setWeatherMood] = useState<MoodType | null>('happy');
  
  // Pet State
  const [petName, setPetName] = useState<string>(UI_TEXT.naming.defaultName);
  const [petType, setPetType] = useState<PetType>('cat');
  const [isNamingOpen, setIsNamingOpen] = useState(false);
  
  // Calendar / History Modal State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Initialize Data
  useEffect(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-CA'); 
    setTodayKey(dateStr);

    // Load History
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    let parsedHistory: MoodHistory = {};
    if (savedData) {
      try {
        parsedHistory = JSON.parse(savedData);
        setHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse saved mood data", e);
      }
    }

    if (parsedHistory[dateStr]) {
      setWeatherMood(parsedHistory[dateStr].mood);
    } else {
      const entries = Object.values(parsedHistory).sort((a: DailyEntry, b: DailyEntry) => b.date.localeCompare(a.date));
      if (entries.length > 0) {
        setWeatherMood(entries[0].mood);
      } else {
        setWeatherMood('happy');
      }
    }

    // Load Pet Info
    const savedName = localStorage.getItem(LOCAL_STORAGE_PET_NAME);
    const savedType = localStorage.getItem(LOCAL_STORAGE_PET_TYPE);
    
    if (savedName) setPetName(savedName);
    if (savedType) setPetType(savedType as PetType);

    if (!savedName) {
      // Trigger modal if no name found (first visit)
      setTimeout(() => setIsNamingOpen(true), 500);
    }
  }, []);

  const handleSaveEntry = useCallback((entry: DailyEntry) => {
    setHistory(prev => {
      const newData = { ...prev, [entry.date]: entry };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
    setWeatherMood(entry.mood);
  }, []);

  const handleRemoveEntry = useCallback((date: string) => {
    setHistory(prev => {
      const newData = { ...prev };
      delete newData[date];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
    setWeatherMood('happy'); 
  }, []);

  const handleMoodPreview = useCallback((mood: MoodType | null) => {
    if (mood) {
      setWeatherMood(mood);
    }
  }, []);

  // Handle saving the name/type from the modal
  const handleSavePetInfo = (newName: string, newType: PetType) => {
    setPetName(newName);
    setPetType(newType);
    localStorage.setItem(LOCAL_STORAGE_PET_NAME, newName);
    localStorage.setItem(LOCAL_STORAGE_PET_TYPE, newType);
    setIsNamingOpen(false);
  };
  
  const weatherType = useMemo(() => {
    switch (weatherMood) {
      case 'happy': return 'sunny';
      case 'calm': return 'cloudy';
      case 'tired': return 'light_rain';
      case 'anxious': return 'heavy_rain';
      case 'sad': return 'snow';
      default: return 'sunny';
    }
  }, [weatherMood]);

  const currentStreak = useMemo(() => {
    if (!todayKey) return 0;
    let streak = 0;
    let checkDate = new Date(todayKey);
    if (history[todayKey]) streak++;
    while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const dateStr = checkDate.toLocaleDateString('en-CA');
        if (history[dateStr]) streak++;
        else break;
    }
    return streak;
  }, [history, todayKey]);

  return (
    <div className="min-h-screen font-hand text-farm-dark pb-12 flex flex-col items-center overflow-x-hidden relative selection:bg-farm-accent selection:text-white">
      
      {/* Background with Weather */}
      <WeatherLayer mood={weatherMood} />

      {/* Header */}
      <header className="w-full max-w-[900px] px-4 pt-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        {/* Logo */}
        <div className="bg-farm-wood px-6 py-2 rounded-md shadow-card text-white flex items-center gap-2">
           <Sprout size={24} />
           <h1 className="text-xl font-bold tracking-widest">{UI_TEXT.title}</h1>
        </div>

        {/* Date Picker Trigger */}
        <button 
            onClick={() => setIsCalendarOpen(true)}
            className="bg-farm-paper px-4 py-2 rounded-md border-[3px] border-farm-wood shadow-card flex items-center gap-2 text-sm font-bold hover:-translate-y-0.5 transition-transform cursor-pointer group"
            title="点击打开日历"
        >
            <span className="text-lg group-hover:scale-110 transition-transform">📅</span>
            <span className="font-mono text-base">{todayKey}</span>
        </button>
      </header>

      {/* Main Layout */}
      <main className="page w-full max-w-[900px] mx-auto px-4 flex flex-col gap-8 z-10">
        
        {/* ROW 1: Grid 3fr 1.3fr */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.3fr] gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: Farm Container */}
          <div className="bg-farm-container p-6 border-[6px] border-farm-wood rounded-lg shadow-card relative flex flex-col min-h-[500px]">
             <div className="bg-farm-wood-dark text-white px-4 py-1 rounded-md inline-block self-start mb-4 text-lg shadow-sm">
                {UI_TEXT.currentSeason}
             </div>
             
             {/* Farm Grid Area */}
             <div className="flex-1 flex items-center justify-center">
                 <div className="bg-farm-grid p-3 border-[6px] border-farm-wood-dark rounded-md w-full max-w-[560px]">
                    <FarmGrid history={history} />
                 </div>
             </div>
          </div>

          {/* RIGHT: NPC + Summary */}
          <div className="flex flex-col h-full relative">
              {/* NPC Section - Absolute Positioning applied */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[170px] z-20 pointer-events-none">
                 <div className="pointer-events-auto">
                    <FarmSpirit 
                        mood={weatherMood} 
                        streak={currentStreak}
                        weather={weatherType}
                        petName={petName}
                        petType={petType}
                        onRename={() => setIsNamingOpen(true)}
                    />
                 </div>
              </div>
              
              {/* Stats Summary - Pushed to bottom */}
              <div className="mt-auto w-full z-10">
                  <StatsSummary history={history} />
              </div>
          </div>

        </div>

        {/* ROW 2: Three Columns (Check-in, Stats, Kitchen) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Check-in Card */}
            <div className="w-full h-full">
              <DailyCheckIn 
                today={todayKey} 
                existingEntry={history[todayKey]} 
                onSave={handleSaveEntry}
                onMoodChange={handleMoodPreview}
                onRemove={handleRemoveEntry}
              />
            </div>

            {/* Mood Stats Card */}
            <div className="w-full h-full">
              <StatsChart history={history} className="h-full" />
            </div>

            {/* Mood Kitchen Card */}
            <div className="w-full h-full">
              <MoodKitchen history={history} />
            </div>
        </div>

      </main>

      <footer className="mt-12 text-farm-dark/60 font-hand text-sm z-10 text-center mb-4">
        {UI_TEXT.footer}
      </footer>

      {/* Modals */}
      <PixelCalendar 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={(date) => setSelectedDate(date)}
        history={history}
        currentDateKey={todayKey}
      />

      <HistoryModal 
        isOpen={!!selectedDate} 
        date={selectedDate} 
        entry={selectedDate ? history[selectedDate] : undefined}
        onClose={() => setSelectedDate(null)}
      />

      <NameModal
        isOpen={isNamingOpen}
        onSave={handleSavePetInfo}
        initialName={petName}
        initialType={petType}
        isRenaming={!!localStorage.getItem(LOCAL_STORAGE_PET_NAME)} 
        onClose={() => setIsNamingOpen(false)}
      />

    </div>
  );
};

export default App;
