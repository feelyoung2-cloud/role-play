import React from 'react';
import { soundManager } from '../utils/audio';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'normal' | 'large';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  size = 'normal',
  children,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-amber-400 text-slate-950 hover:bg-amber-300 active:bg-amber-500 border-black';
      case 'secondary':
        return 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:bg-cyan-600 border-black';
      case 'success':
        return 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:bg-emerald-600 border-black';
      case 'danger':
        return 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 border-black';
      case 'ghost':
        return 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'large':
        return 'text-lg md:text-xl px-6 py-4 tracking-wide font-bold min-h-[56px]';
      case 'normal':
      default:
        return 'text-base md:text-lg px-4 py-2.5 font-bold min-h-[46px]';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      soundManager.playClick();
      if (onClick) onClick(e);
    }
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`pixel-btn inline-flex items-center justify-center gap-2 cursor-pointer select-none font-bold uppercase transition-all whitespace-nowrap ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : ''
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
