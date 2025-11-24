
import React, { useState } from 'react';
import { MoodHistory, DailyEntry, MoodType } from './types';
import { UI_TEXT, INGREDIENTS, DISH_RECIPES, DishRecipe } from './constants';
import { ChefHat, Utensils } from 'lucide-react';

interface MoodKitchenProps {
  history: MoodHistory;
}

type TimeRange = 7 | 14 | 30;

export const MoodKitchen: React.FC<MoodKitchenProps> = ({ history }) => {
  const [range, setRange] = useState<TimeRange>(7);
  const [isCooking, setIsCooking] = useState(false);
  const [result, setResult] = useState<{
    dish: DishRecipe;
    counts: Record<string, number>;
    totalIngredients: number;
  } | null>(null);

  // Animation state: list of ingredients to "drop"
  const [droppingIngredients, setDroppingIngredients] = useState<{ emoji: string; id: number; delay: string }[]>([]);

  const handleCook = () => {
    // 1. Filter Data
    const now = new Date();
    const entries = Object.values(history) as DailyEntry[];
    
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const diffTime = Math.abs(now.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= range;
    });

    if (filtered.length === 0) {
        setResult({
            dish: DISH_RECIPES.empty,
            counts: {},
            totalIngredients: 0
        });
        return;
    }

    // 2. Start Cooking Animation
    setIsCooking(true);
    setResult(null);

    // Prepare falling ingredients animation
    const limit = 10; // Visual limit
    const visualIngredients = filtered.slice(0, limit).map((entry, i) => ({
        emoji: INGREDIENTS[entry.mood].emoji,
        id: i,
        delay: `${i * 0.2}s`
    }));
    setDroppingIngredients(visualIngredients);

    // 3. Calculate Result (Simulate cooking time)
    setTimeout(() => {
        const counts: Record<string, number> = {};
        let maxMood: MoodType | null = null;
        let maxCount = 0;

        filtered.forEach(entry => {
            counts[entry.mood] = (counts[entry.mood] || 0) + 1;
            if (counts[entry.mood] > maxCount) {
                maxCount = counts[entry.mood];
                maxMood = entry.mood;
            }
        });

        // Determine Recipe
        let dish = DISH_RECIPES.mixed;
        if (maxMood) {
             dish = DISH_RECIPES[maxMood];
        }

        setResult({
            dish,
            counts,
            totalIngredients: filtered.length
        });
        setIsCooking(false);
    }, 2500); // 2.5s cooking time
  };

  const handleReset = () => {
    setResult(null);
    setIsCooking(false);
    setDroppingIngredients([]);
  };

  // Header Style matching DailyCheckIn
  const titleClasses = "bg-[#9b6b39] text-white px-3 py-1 rounded-md inline-flex items-center gap-2 mb-4 text-lg shadow-sm self-start shrink-0 relative z-20";

  return (
    <div className="bg-farm-paper border-[6px] border-farm-wood rounded-lg shadow-card p-5 flex flex-col h-full">
        
        {/* Header - Fixed, Outside overflow hidden area to prevent clipping */}
        <div className={titleClasses}>
           <ChefHat size={18} />
           <span>{UI_TEXT.kitchen.title}</span>
        </div>

        {/* Content Container - Handles overflow for animations internally */}
        <div className="relative flex-1 w-full flex flex-col overflow-hidden rounded-sm">
            
            {/* Background Decoration (Inside internal container) */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#6c3f1f 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* VIEW: COOKING ANIMATION */}
            {isCooking && (
                <div className="flex-1 flex flex-col items-center justify-center z-10 min-h-[250px]">
                    <div className="relative w-32 h-32 mt-4">
                        {/* Dropping Ingredients */}
                        {droppingIngredients.map((ing) => (
                            <div 
                                key={ing.id}
                                className="absolute left-1/2 text-3xl"
                                style={{ 
                                    animation: `ingredient-drop 0.6s ease-in forwards`,
                                    animationDelay: ing.delay,
                                    marginLeft: `${(Math.random() - 0.5) * 40}px`,
                                    opacity: 0
                                }}
                            >
                                {ing.emoji}
                            </div>
                        ))}
                        
                        {/* The Pot */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[80px] filter drop-shadow-lg animate-pot-boil origin-bottom">
                            🥘
                        </div>
                        
                        {/* Steam */}
                        <div className="absolute -top-4 left-1/4 text-2xl animate-[steam-rise_2s_infinite]">♨️</div>
                        <div className="absolute -top-8 left-1/2 text-2xl animate-[steam-rise_2s_infinite_0.5s]">♨️</div>
                    </div>
                    <p className="mt-6 text-farm-wood font-bold animate-pulse">{UI_TEXT.kitchen.cooking}</p>
                </div>
            )}

            {/* VIEW: RESULT CARD */}
            {!isCooking && result && (
                <div className="flex-1 flex flex-col items-center z-10 animate-[pop-in_0.5s_ease-out] overflow-y-auto">
                    <div className="text-center w-full flex-1 flex flex-col">
                        <div className="text-6xl mb-2 filter drop-shadow-md animate-bounce-slow mx-auto">{result.dish.emoji}</div>
                        <h3 className="text-xl font-bold text-farm-dark mb-2">{result.dish.name}</h3>
                        
                        {/* Ingredients Breakdown */}
                        {result.totalIngredients > 0 && (
                            <div className="bg-[#fff9e6] border border-farm-wood/30 rounded p-2 mb-3 text-xs text-farm-wood-dark flex flex-wrap justify-center gap-2 shadow-inner-pixel">
                                 {Object.entries(result.counts)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([mood, count]) => (
                                        <span key={mood} className="bg-white/50 px-1.5 py-0.5 rounded border border-farm-wood/10">
                                            {count}份{INGREDIENTS[mood as MoodType].name}
                                        </span>
                                    ))
                                }
                                <span>熬成</span>
                            </div>
                        )}

                        <div className="bg-white/50 p-3 rounded-md border-2 border-farm-wood/20 mb-2 text-sm text-farm-wood-dark/90 italic leading-relaxed text-left">
                            "{result.dish.desc}"
                        </div>
                        
                         <p className="text-xs text-farm-accent/80 font-bold mb-4">
                            {result.dish.summary}
                        </p>

                        <div className="mt-auto pb-1">
                            <button 
                                onClick={handleReset}
                                className="text-farm-accent underline font-bold text-sm hover:text-[#c96a3a]"
                            >
                                {UI_TEXT.kitchen.reCook}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: SETUP (DEFAULT) */}
            {!isCooking && !result && (
                <div className="flex-1 flex flex-col justify-between pt-2 z-10 h-full">
                    <div className="text-center">
                        <p className="text-farm-wood text-sm font-bold mb-6 px-4 opacity-90">{UI_TEXT.kitchen.subtitle}</p>
                        
                        <div className="flex justify-center items-center gap-4 text-6xl opacity-20 grayscale mb-2">
                            <span>🎃</span><span>🌶️</span><span>🥚</span>
                        </div>
                    </div>

                    <div className="space-y-4 mt-auto pb-2">
                        {/* Time Range Selector */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-farm-wood uppercase tracking-wider opacity-70">{UI_TEXT.kitchen.timeRange}</span>
                            <div className="flex bg-farm-wood/10 p-1 rounded-md gap-1">
                                {[7, 14, 30].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => setRange(days as TimeRange)}
                                        className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                                            range === days 
                                            ? 'bg-farm-accent text-white shadow-sm' 
                                            : 'text-farm-wood hover:bg-white/50'
                                        }`}
                                    >
                                        {days}天
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleCook}
                            className="w-full bg-[#d87c4a] hover:bg-[#c96a3a] text-white font-bold py-3 rounded shadow-card active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            <Utensils size={20} />
                            {UI_TEXT.kitchen.cookBtn}
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
