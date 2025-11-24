
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MoodType, PetType } from '../types';
import { CAT_DIALOGUES } from '../constants';
import { ChatInterface } from './ChatInterface';
import { MessageCircle, Pencil } from 'lucide-react';

interface FarmSpiritProps {
  mood: MoodType | null;
  streak: number;
  weather: 'sunny' | 'cloudy' | 'light_rain' | 'heavy_rain' | 'snow';
  petName: string;
  petType: PetType;
  onRename: () => void;
}

type PetAction = 'idle' | 'jump' | 'sit' | 'roll';

export const FarmSpirit: React.FC<FarmSpiritProps> = ({ mood, petName, petType, onRename }) => {
  const [dialogue, setDialogue] = useState('喵？(轻轻晃动尾巴)');
  const [showHeart, setShowHeart] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Animation State
  const [action, setAction] = useState<PetAction>('idle');
  
  // Refs for logic
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const rollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Logic 1: Activity Monitor (Auto-Sit) ---
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    // If not currently rolling or jumping, ensure we go back to idle first
    if (action === 'sit') {
        setAction('idle');
    }

    // Set timer to Sit after 10 seconds of inactivity
    idleTimerRef.current = setTimeout(() => {
        setAction('sit');
    }, 10000);
  }, [action]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    };
  }, []); // Run once on mount, logic handled inside resetIdleTimer

  // --- Logic 2: Dialogue Updates ---
  useEffect(() => {
    // If mood is null (no planting yet), use default
    const currentMood = mood || 'default';
    const options = CAT_DIALOGUES[currentMood] || CAT_DIALOGUES.default;
    const randomLine = options[Math.floor(Math.random() * options.length)];
    setDialogue(randomLine);
  }, [mood]);

  // --- Logic 3: Interaction Handler ---
  const handlePet = () => {
    if (showChat) return; 

    const now = Date.now();
    
    // Check for "Roll" Combo (Easter Egg): 6 clicks within 2 seconds
    if (now - lastClickTimeRef.current < 400) {
        clickCountRef.current += 1;
    } else {
        clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;

    // Visual Feedback Logic
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);

    // Reset Inactivity
    resetIdleTimer();

    // Trigger Roll if Combo met
    if (clickCountRef.current >= 6) {
        setAction('roll');
        setDialogue("哇！天旋地转！(兴奋地打滚)");
        clickCountRef.current = 0; // Reset combo
        
        // Return to idle after roll animation (approx 1s)
        if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
        rollTimeoutRef.current = setTimeout(() => {
            setAction('idle');
            resetIdleTimer(); // Restart sit timer
        }, 1000);
        return;
    }

    // Standard Jump interaction
    if (action !== 'roll') {
        setAction('jump');
        
        // Random Dialogue
        const currentMood = mood || 'default';
        const options = CAT_DIALOGUES[currentMood] || CAT_DIALOGUES.default;
        const randomLine = options[Math.floor(Math.random() * options.length)];
        setDialogue(randomLine);

        // Return to idle after jump (approx 400ms)
        setTimeout(() => {
             // Only go back to idle if we haven't started rolling or sitting in the meantime
             setAction(prev => prev === 'jump' ? 'idle' : prev);
        }, 400);
    }
  };

  const getAnimationClass = () => {
      switch (action) {
          case 'jump': return 'pet-anim-jump';
          case 'roll': return 'pet-anim-roll';
          case 'sit': return 'pet-anim-sit';
          case 'idle': 
          default: return 'pet-anim-idle';
      }
  };

  const renderPetSvg = () => {
      switch (petType) {
        case 'dog':
            return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="6" y="28" width="20" height="2" fill="#000000" fillOpacity="0.2"/> {/* Shadow */}
                    <path d="M22 22H26V24H22V22Z" fill="#8d6e63" className="animate-wiggle"/> {/* Tail */}
                    <rect x="8" y="19" width="14" height="9" fill="#a1887f"/> {/* Body */}
                    <rect x="6" y="10" width="16" height="10" fill="#a1887f"/> {/* Head */}
                    <rect x="5" y="11" width="2" height="6" fill="#5d4037"/> {/* Ear L */}
                    <rect x="21" y="11" width="2" height="6" fill="#5d4037"/> {/* Ear R */}
                    <rect x="9" y="13" width="2" height="2" fill="#2d3436"/> {/* Eye L */}
                    <rect x="17" y="13" width="2" height="2" fill="#2d3436"/> {/* Eye R */}
                    <rect x="12" y="16" width="4" height="3" fill="#ffecb3"/> {/* Snout */}
                    <rect x="13" y="16" width="2" height="1" fill="#2d3436"/> {/* Nose */}
                </svg>
            );
        case 'rabbit':
            return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="8" y="28" width="16" height="2" fill="#000000" fillOpacity="0.2"/>
                    <rect x="22" y="23" width="4" height="4" fill="#ffffff"/> {/* Tail */}
                    <rect x="10" y="20" width="12" height="8" fill="#f5f5f5"/> {/* Body */}
                    <rect x="8" y="12" width="14" height="9" fill="#ffffff"/> {/* Head */}
                    <rect x="9" y="5" width="3" height="8" fill="#ffffff"/> {/* Ear L */}
                    <rect x="18" y="5" width="3" height="8" fill="#ffffff"/> {/* Ear R */}
                    <rect x="10" y="7" width="1" height="4" fill="#ffcdd2"/> {/* Inner Ear L */}
                    <rect x="19" y="7" width="1" height="4" fill="#ffcdd2"/> {/* Inner Ear R */}
                    <rect x="10" y="15" width="2" height="2" fill="#2d3436"/> 
                    <rect x="18" y="15" width="2" height="2" fill="#2d3436"/>
                    <rect x="14" y="17" width="2" height="1" fill="#ffcdd2"/>
                </svg>
            );
        case 'hamster':
             return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="8" y="28" width="16" height="2" fill="#000000" fillOpacity="0.2"/>
                    <rect x="9" y="18" width="14" height="10" fill="#ffcc80"/> {/* Body */}
                    <rect x="13" y="20" width="6" height="6" fill="#ffffff"/> {/* Belly */}
                    <rect x="7" y="18" width="3" height="3" fill="#ffcc80"/> {/* Ear L */}
                    <rect x="22" y="18" width="3" height="3" fill="#ffcc80"/> {/* Ear R */}
                    <rect x="11" y="21" width="2" height="2" fill="#2d3436"/> 
                    <rect x="19" y="21" width="2" height="2" fill="#2d3436"/>
                    <rect x="15" y="23" width="2" height="1" fill="#ffab91"/>
                </svg>
             );
        case 'fox':
             return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="6" y="28" width="20" height="2" fill="#000000" fillOpacity="0.2"/>
                    <rect x="21" y="20" width="6" height="8" fill="#e64a19"/> {/* Tail Base */}
                    <rect x="23" y="18" width="4" height="4" fill="#ffffff"/> {/* Tail Tip */}
                    <rect x="8" y="19" width="13" height="9" fill="#ff7043"/> {/* Body */}
                    <rect x="10" y="22" width="6" height="6" fill="#ffffff"/> {/* Chest */}
                    <rect x="7" y="10" width="14" height="10" fill="#ff7043"/> {/* Head */}
                    <path d="M7 6H10V10H7V6Z" fill="#ff7043"/> {/* Ear L */}
                    <path d="M18 6H21V10H18V6Z" fill="#ff7043"/> {/* Ear R */}
                    <rect x="9" y="14" width="2" height="2" fill="#2d3436"/> 
                    <rect x="17" y="14" width="2" height="2" fill="#2d3436"/>
                    <rect x="13" y="17" width="2" height="1" fill="#2d3436"/>
                </svg>
             );
        case 'chick':
             return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="10" y="28" width="12" height="2" fill="#000000" fillOpacity="0.2"/>
                    <rect x="11" y="16" width="10" height="11" fill="#ffee58"/> {/* Body */}
                    <rect x="9" y="19" width="2" height="4" fill="#fdd835"/> {/* Wing L */}
                    <rect x="21" y="19" width="2" height="4" fill="#fdd835"/> {/* Wing R */}
                    <rect x="13" y="19" width="2" height="2" fill="#2d3436"/> 
                    <rect x="17" y="19" width="2" height="2" fill="#2d3436"/>
                    <rect x="15" y="21" width="2" height="2" fill="#ff9800"/> {/* Beak */}
                    <rect x="12" y="27" width="2" height="1" fill="#ff9800"/> {/* Foot L */}
                    <rect x="18" y="27" width="2" height="1" fill="#ff9800"/> {/* Foot R */}
                    <rect x="14" y="14" width="4" height="2" fill="#ffee58"/> {/* Tuft */}
                </svg>
             );
        case 'turtle':
             return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="6" y="28" width="20" height="2" fill="#000000" fillOpacity="0.2"/>
                    <rect x="7" y="20" width="18" height="7" fill="#66bb6a"/> {/* Shell Base */}
                    <rect x="9" y="17" width="14" height="3" fill="#66bb6a"/> {/* Shell Top */}
                    <rect x="10" y="19" width="12" height="6" fill="#4caf50"/> {/* Shell Pattern */}
                    <rect x="25" y="22" width="4" height="4" fill="#a5d6a7"/> {/* Head */}
                    <rect x="27" y="23" width="1" height="1" fill="#2d3436"/> {/* Eye */}
                    <rect x="5" y="25" width="3" height="2" fill="#a5d6a7"/> {/* Tail */}
                    <rect x="9" y="27" width="2" height="2" fill="#a5d6a7"/> {/* Leg L */}
                    <rect x="21" y="27" width="2" height="2" fill="#a5d6a7"/> {/* Leg R */}
                </svg>
             );
        case 'panda':
             return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="8" y="28" width="16" height="2" fill="#000000" fillOpacity="0.2"/>
                    <rect x="9" y="19" width="14" height="9" fill="#ffffff"/> {/* Body */}
                    <rect x="8" y="20" width="3" height="4" fill="#2d3436"/> {/* Arm L */}
                    <rect x="21" y="20" width="3" height="4" fill="#2d3436"/> {/* Arm R */}
                    <rect x="7" y="10" width="18" height="10" fill="#ffffff"/> {/* Head */}
                    <rect x="6" y="8" width="4" height="4" fill="#2d3436"/> {/* Ear L */}
                    <rect x="22" y="8" width="4" height="4" fill="#2d3436"/> {/* Ear R */}
                    <rect x="9" y="13" width="4" height="3" fill="#2d3436"/> {/* Eye Patch L */}
                    <rect x="19" y="13" width="4" height="3" fill="#2d3436"/> {/* Eye Patch R */}
                    <rect x="10" y="14" width="1" height="1" fill="#ffffff"/> {/* Eye Dot */}
                    <rect x="20" y="14" width="1" height="1" fill="#ffffff"/>
                    <rect x="15" y="16" width="2" height="1" fill="#2d3436"/> {/* Nose */}
                </svg>
             );
        case 'cat':
        default:
            return (
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                    <rect x="6" y="28" width="20" height="2" fill="#000000" fillOpacity="0.2"/>
                    <path d="M22 23H24V21H26V25H24V27H20V25H22V23Z" fill="#cd853f"/> {/* Tail */}
                    <rect x="8" y="19" width="14" height="9" fill="#f4a460"/> {/* Body */}
                    <rect x="10" y="22" width="10" height="4" fill="#ffdead"/> {/* Belly */}
                    <rect x="6" y="9" width="18" height="11" fill="#f4a460"/> {/* Head */}
                    <path d="M6 6H10V9H6V6Z" fill="#f4a460"/> {/* Ears */}
                    <path d="M20 6H24V9H20V6Z" fill="#f4a460"/>
                    <rect x="7" y="7" width="2" height="2" fill="#ffdead"/>
                    <rect x="21" y="7" width="2" height="2" fill="#ffdead"/>
                    <rect x="9" y="13" width="2" height="2" fill="#2d3436"/> {/* Eyes */}
                    <rect x="19" y="13" width="2" height="2" fill="#2d3436"/>
                    <rect x="14" y="15" width="2" height="1" fill="#e17055"/> {/* Nose */}
                    <rect x="15" y="16" width="1" height="1" fill="#2d3436"/> {/* Mouth */}
                    <rect x="7" y="14" width="2" height="1" fill="#ffb6c1" fillOpacity="0.6"/> {/* Blush */}
                    <rect x="21" y="14" width="2" height="1" fill="#ffb6c1" fillOpacity="0.6"/>
                </svg>
            );
      }
  };

  return (
    <div className="relative flex flex-col items-center w-[300px]">
      
      {/* 
          CONDITIONAL RENDER: 
          If chat is open, show ChatInterface.
          If chat is closed, show standard Dialog Box.
      */}
      {showChat ? (
        <ChatInterface mood={mood} onClose={() => setShowChat(false)} petName={petName} />
      ) : (
        <div className="mb-2 relative animate-bounce-slow group cursor-pointer z-30" onClick={() => setShowChat(true)} style={{ animationDuration: '3s' }}>
          <div className="bg-[#fff9e6] border-4 border-[#8b5a2b] px-4 py-3 rounded-sm shadow-pixel max-w-[200px] text-center relative hover:bg-white transition-colors">
             {/* Pixel Corners */}
             <div className="absolute top-0 left-0 w-1 h-1 bg-[#b08555]"></div>
             <div className="absolute top-0 right-0 w-1 h-1 bg-[#b08555]"></div>
             <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#b08555]"></div>
             <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#b08555]"></div>
             
             <p className="font-pixel text-[#42210b] text-lg leading-tight">{dialogue}</p>

             {/* Hover Hint */}
             <div className="absolute -top-3 -right-3 bg-farm-accent text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-75 border-2 border-farm-wood">
                <MessageCircle size={14} />
             </div>
             
             {/* Dialog Arrow */}
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#8b5a2b]"></div>
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-[#fff9e6]"></div>
          </div>
        </div>
      )}

      {/* Interactive Pixel Pet NPC */}
      <div className="relative mt-0 flex flex-col items-center">
        <div 
            onClick={handlePet}
            className={`pet-wrapper ${getAnimationClass()} ${showHeart ? 'show-heart' : ''}`}
            title="点我互动，连点6下有惊喜！"
        >
            {renderPetSvg()}
        </div>

        {/* Chat Toggle Button - Positioned absolutely relative to the cat container */}
        {!showChat && (
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowChat(true);
                }}
                className="absolute -right-8 top-1/2 -translate-y-1/2 bg-farm-paper border-2 border-farm-wood p-2 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform text-farm-wood hover:text-farm-accent z-10"
                title="和小伙伴聊天"
            >
                <MessageCircle size={20} />
            </button>
        )}
        
        {/* Floor Shadow */}
        <div className={`w-16 h-3 bg-black/20 rounded-[50%] blur-[2px] mt-1 transition-all duration-300 ${action === 'jump' ? 'scale-50 opacity-50' : ''}`}></div>
      </div>

      {/* Pet Name Tag - Centered below pet */}
      <div className="mt-2 relative group/name z-20 flex justify-center items-center">
         <div className="bg-farm-wood-dark text-[#fff9e6] text-xs font-bold px-2 py-0.5 rounded border border-farm-wood shadow-sm">
           {petName}
         </div>
         
         {/* Rename Button */}
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onRename();
           }}
           className="absolute left-full top-1/2 -translate-y-1/2 ml-1.5 bg-white text-farm-wood p-0.5 rounded-full border border-farm-wood opacity-0 group-hover/name:opacity-100 transition-opacity hover:scale-110 shadow-sm"
           title="修改信息"
         >
           <Pencil size={10} />
         </button>
      </div>

    </div>
  );
};
