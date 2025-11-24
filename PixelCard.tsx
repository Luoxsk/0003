import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'wood';
}

export const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  className = '', 
  title, 
  icon,
  variant = 'default' 
}) => {
  const baseClasses = variant === 'wood' 
    ? "bg-farm-wood border-4 border-farm-dark text-farm-paper shadow-pixel"
    : "bg-farm-paper border-4 border-farm-wood shadow-pixel relative";

  return (
    <div className={`${baseClasses} rounded-sm ${className}`}>
      {/* Decorative Inner Border for Paper variant */}
      {variant === 'default' && (
        <div className="absolute inset-0 border-2 border-[#e6cdab] pointer-events-none m-1"></div>
      )}

      {(title || icon) && (
        <div className={`
          px-4 py-2 text-xl font-pixel tracking-wide flex items-center gap-3 border-b-4 
          ${variant === 'wood' ? 'bg-farm-wood-light border-farm-dark text-white' : 'bg-farm-wood border-farm-dirt-dark text-farm-paper'}
        `}>
          {icon && <span className="filter drop-shadow-sm">{icon}</span>}
          {title && <span className="drop-shadow-md">{title}</span>}
        </div>
      )}
      
      <div className="p-5 relative z-10">
        {children}
      </div>

      {/* Corner Decorations for Paper variant */}
      {variant === 'default' && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 bg-farm-dirt-dark"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-farm-dirt-dark"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-farm-dirt-dark"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-farm-dirt-dark"></div>
          
          {/* Screws */}
          <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-farm-wood-light rounded-full"></div>
          <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-farm-wood-light rounded-full"></div>
          <div className="absolute bottom-1.5 left-1.5 w-1 h-1 bg-farm-wood-light rounded-full"></div>
          <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-farm-wood-light rounded-full"></div>
        </>
      )}
    </div>
  );
};