import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  title?: string;
  badge?: string;
  variant?: 'dark' | 'gold' | 'neon' | 'emerald';
  className?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  title,
  badge,
  variant = 'dark',
  className = '',
}) => {
  const getBoxClass = () => {
    switch (variant) {
      case 'gold':
        return 'pixel-box-gold';
      case 'neon':
        return 'pixel-box-neon';
      case 'emerald':
        return 'pixel-box-emerald';
      case 'dark':
      default:
        return 'pixel-box';
    }
  };

  return (
    <div className={`p-4 md:p-6 relative ${getBoxClass()} ${className}`}>
      {(title || badge) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-700/80">
          {title && (
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-amber-300 flex items-center gap-2">
              {title}
            </h3>
          )}
          {badge && (
            <span className="text-xs md:text-sm font-bold text-cyan-300">
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
