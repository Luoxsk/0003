
import React, { useMemo } from 'react';
import { MoodHistory, DailyEntry, MoodType } from '../types';
import { MOOD_OPTIONS, UI_TEXT } from '../constants';
import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const useMoodStats = (history: MoodHistory) => {
  return useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(MOOD_OPTIONS).forEach(key => counts[key] = 0);
    
    (Object.values(history) as DailyEntry[]).forEach(entry => {
      if (counts[entry.mood] !== undefined) {
        counts[entry.mood]++;
      }
    });

    const total = Object.values(history).length;
    
    let maxMood = '';
    let maxCount = -1;
    Object.entries(counts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxMood = mood;
      }
    });

    const chartData = Object.entries(counts).map(([key, value]) => {
        const moodKey = key as MoodType;
        return {
            name: MOOD_OPTIONS[moodKey].label,
            count: value,
            color: MOOD_OPTIONS[moodKey].color,
            emoji: MOOD_OPTIONS[moodKey].emoji
        };
    }).filter(item => item.count > 0);

    return { counts, total, maxMood, chartData };
  }, [history]);
};

interface StatsProps {
  history: MoodHistory;
  className?: string;
}

// "Total Harvest" Card style - Matches the brown .total-card in your HTML
export const StatsSummary: React.FC<StatsProps> = ({ history, className }) => {
  const stats = useMoodStats(history);
  const mostFrequentMood = stats.maxMood ? MOOD_OPTIONS[stats.maxMood as MoodType] : null;

  return (
    <div className={`bg-[#b17a3e] border-[4px] border-farm-wood-dark rounded-lg p-5 text-white shadow-card ${className}`}>
      <h4 className="text-base font-bold opacity-90 mb-1">{UI_TEXT.totalHarvest}</h4>
      <div className="text-4xl font-bold mb-2 font-pixel tracking-widest">{stats.total}</div>
      
      <div className="text-sm flex items-center gap-2 pt-2 border-t border-white/20">
        <span className="opacity-80">{UI_TEXT.dominantMood}：</span>
        {mostFrequentMood ? (
          <span className="font-bold bg-black/20 px-2 py-0.5 rounded text-white/90 flex items-center gap-1">
             <span>{mostFrequentMood.emoji}</span>
             <span>{mostFrequentMood.label}</span>
          </span>
        ) : (
          <span className="opacity-60">{UI_TEXT.noData}</span>
        )}
      </div>
    </div>
  );
};

// "Mood Stats" Card style - Matches the .card-bottom style
export const StatsChart: React.FC<StatsProps> = ({ history, className }) => {
  const stats = useMoodStats(history);

  return (
    <div className={`bg-farm-paper border-[6px] border-farm-wood rounded-lg shadow-card p-5 h-full flex flex-col ${className}`}>
       <div className="bg-[#9b6b39] text-white px-3 py-1 rounded-md inline-block self-start mb-4 text-lg shadow-sm">
          {UI_TEXT.yieldReport}
       </div>
       
       <div className="flex-1 w-full min-h-[160px]">
          {stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <YAxis 
                    dataKey="name" 
                    type="category"
                    tick={{ fontSize: 12, fill: '#4a2d1a', fontWeight: 'bold' }} 
                    width={50}
                    axisLine={false}
                    tickLine={false}
                 />
                 <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', border: '2px solid #6c3f1f', padding: '6px' }}
                 />
                 <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#4a2d1a" strokeWidth={1} />
                    ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-farm-wood/40">
              <span className="text-4xl mb-2 opacity-50 grayscale">📊</span>
              <span className="text-sm font-bold">{UI_TEXT.noData}</span>
            </div>
          )}
       </div>
    </div>
  );
};
