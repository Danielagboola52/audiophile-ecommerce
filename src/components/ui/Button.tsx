import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  variant = 'primary',
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'text-subtitle tracking-[1px] font-bold transition-all duration-300 inline-block text-center';
  
  const variantStyles = {
    primary: 'bg-primary-orange hover:bg-primary-orange-hover text-white px-8 py-4',
    secondary: 'bg-secondary-black hover:bg-[#4C4C4C] text-white px-8 py-4',
    tertiary: 'border-2 border-secondary-black hover:bg-secondary-black hover:text-white px-8 py-4',
    quaternary: 'text-secondary-black/50 hover:text-primary-orange',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${widthStyle} ${disabledStyle} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
    >
      {children}
    </button>
  );
}