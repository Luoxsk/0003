
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Send, X, Loader2 } from 'lucide-react';
import { MoodType } from './types';
import { MOOD_OPTIONS } from './constants';

interface ChatInterfaceProps {
  mood: MoodType | null;
  petName: string;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ mood, petName, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const currentMoodConfig = mood ? MOOD_OPTIONS[mood] : MOOD_OPTIONS['happy'];

  // Initialize Chat Session
  useEffect(() => {
    if (!process.env.API_KEY) {
      setMessages([{ role: 'model', text: '喵呜... (好像找不到 API Key，我无法说话喵)' }]);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // System instruction defines the Cat's persona with Dynamic Name
    const systemInstruction = `
      你是一只住在“情绪小农场”里的像素橘猫。
      【你的名字】：${petName}。
      
      【当前用户心情状态】：${currentMoodConfig.label} (${currentMoodConfig.description})。
      
      【你的性格】：
      1. 语气温柔、治愈、可爱，喜欢在句尾加“喵”、“呼噜”或颜文字。
      2. 你不是心理医生，你是陪伴者。不要给严肃的医疗建议，而是提供情感支持、倾听、鼓励和简单的自我照顾建议（如喝水、看云、深呼吸）。
      3. 如果用户心情【${currentMoodConfig.label}】，请根据这个基调来回应。
         - 开心：一起撒花庆祝，蹭蹭用户。
         - 焦虑/低落：给予虚拟的拥抱，告诉用户“没关系”，鼓励专注当下。
         - 平静：分享安静的美好。
      4. 回复尽量简短（60字以内），像朋友发微信一样自然。
      
      请用中文回复。始终记得你的名字是${petName}。
    `;

    chatSessionRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: [
        {
          role: 'model',
          parts: [{ text: `喵～我是${petName}，我看你今天心情是“${currentMoodConfig.label}”，想聊聊吗？` }],
        },
      ],
    });

    // Set initial greeting
    setMessages([
      { role: 'model', text: `喵～我是${petName}，我看你今天心情是“${currentMoodConfig.label}”，想聊聊吗？` }
    ]);
  }, [mood, petName, currentMoodConfig.label, currentMoodConfig.description]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      const text = result.text;
      setMessages(prev => [...prev, { role: 'model', text: text || '喵？(我好像走神了)' }]);
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { role: 'model', text: '喵呜... 网络好像有点卡，能再说一遍吗？' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // Height 300px, bottom position adjusted for lower anchor
    <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-[280px] sm:w-[320px] mb-4 z-30 animate-in zoom-in-95 duration-200 origin-bottom">
      {/* Chat Window Container */}
      <div className="bg-[#fff9e6] border-[4px] border-farm-wood rounded-lg shadow-pixel overflow-hidden flex flex-col h-[300px] relative">
        
        {/* Pixel Corners Decoration */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-farm-wood-dark z-20"></div>
        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-farm-wood-dark z-20"></div>
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-farm-wood-dark z-20"></div>
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-farm-wood-dark z-20"></div>

        {/* Header */}
        <div className="bg-farm-wood px-3 py-2 flex items-center justify-between border-b-[4px] border-[#b08555] shrink-0">
          <span className="text-white font-pixel tracking-wider text-lg">{petName} (陪聊版)</span>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded p-0.5 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#fff9e6] scrollbar-thin">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`
                  max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed border-2 shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-farm-accent text-white border-[#b05f32] rounded-br-none' 
                    : 'bg-white text-farm-dark border-[#e6cdab] rounded-bl-none'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white px-3 py-2 rounded-lg rounded-bl-none border-2 border-[#e6cdab] text-farm-wood text-xs flex items-center gap-2">
                 <Loader2 size={12} className="animate-spin" />
                 <span>{petName}正在思考怎么回复喵...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-2 bg-[#f7e9cc] border-t-[4px] border-[#e6cdab] shrink-0">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="说点什么..."
              disabled={isLoading}
              className="w-full pl-3 pr-10 py-2 bg-white border-2 border-farm-wood/30 rounded-md focus:border-farm-accent focus:outline-none text-sm text-farm-dark placeholder:text-farm-wood/40"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-farm-accent hover:text-[#c96a3a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
      
      {/* Speech Bubble Arrow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-farm-wood"></div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#f7e9cc]"></div>
    </div>
  );
};
