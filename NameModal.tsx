
import React, { useState } from 'react';
import { UI_TEXT, PET_OPTIONS } from '../constants';
import { PetType } from '../types';

interface NameModalProps {
  isOpen: boolean;
  onSave: (name: string, type: PetType) => void;
  initialName?: string;
  initialType?: PetType;
  isRenaming?: boolean;
  onClose?: () => void;
}

export const NameModal: React.FC<NameModalProps> = ({ isOpen, onSave, initialName = '', initialType = 'cat', isRenaming = false, onClose }) => {
  const [inputName, setInputName] = useState(initialName);
  const [selectedType, setSelectedType] = useState<PetType>(initialType);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError('名字不能为空喵！');
      return;
    }
    if (trimmed.length > 8) {
      setError('名字太长啦 (最多8个字)');
      return;
    }
    onSave(trimmed, selectedType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fff9e6] border-[6px] border-farm-wood rounded-lg shadow-pixel w-full max-w-sm relative p-6 flex flex-col items-center max-h-[90vh] overflow-y-auto">
        
        {/* Pixel Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-farm-wood-dark"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-farm-wood-dark"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-farm-wood-dark"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-farm-wood-dark"></div>

        {/* Title */}
        <h2 className="text-xl font-bold text-farm-wood-dark mb-4 font-pixel tracking-wider flex items-center gap-2">
          <span>🐾</span>
          {isRenaming ? '修改伙伴' : UI_TEXT.naming.title}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          
          {/* Pet Type Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-farm-wood">{UI_TEXT.naming.typeLabel}</label>
            <div className="grid grid-cols-4 gap-2">
                {PET_OPTIONS.map((pet) => (
                    <button
                        key={pet.id}
                        type="button"
                        onClick={() => setSelectedType(pet.id)}
                        className={`
                            aspect-square rounded border-2 flex flex-col items-center justify-center transition-all
                            ${selectedType === pet.id 
                                ? 'bg-farm-accent border-farm-wood-dark text-white scale-105 shadow-md' 
                                : 'bg-white border-farm-wood/30 text-farm-wood hover:border-farm-accent hover:bg-white/80'
                            }
                        `}
                    >
                        <span className="text-2xl mb-1">{pet.emoji}</span>
                        <span className="text-[10px] font-bold">{pet.name}</span>
                    </button>
                ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-1 mt-2">
             <label className="text-sm font-bold text-farm-wood">{UI_TEXT.naming.label}</label>
             <input 
                type="text" 
                value={inputName}
                onChange={(e) => {
                    setInputName(e.target.value);
                    setError('');
                }}
                placeholder={UI_TEXT.naming.placeholder}
                className="w-full px-3 py-2 bg-white border-2 border-farm-wood rounded focus:border-farm-accent outline-none text-center font-bold text-farm-dark placeholder:text-farm-wood/30"
             />
             {error && <p className="text-red-500 text-xs font-bold text-center mt-1">{error}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            {isRenaming && onClose && (
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-2 rounded border-2 border-farm-wood text-farm-wood font-bold hover:bg-black/5"
                >
                  取消
                </button>
            )}
            <button 
                type="submit" 
                className="flex-1 bg-farm-accent text-white py-2 rounded shadow-card hover:bg-[#c96a3a] font-bold active:translate-y-1 active:shadow-none transition-all"
            >
                {UI_TEXT.naming.save}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
