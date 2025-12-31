import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 focus:ring-indigo-500/30 border border-transparent",
    secondary: "bg-white text-slate-800 border border-slate-200 hover:border-violet-300 hover:text-violet-600 shadow-sm hover:shadow-md focus:ring-violet-100",
    outline: "border-2 border-violet-600 text-violet-600 hover:bg-violet-50 focus:ring-violet-500/30",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-violet-600 focus:ring-slate-200",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};