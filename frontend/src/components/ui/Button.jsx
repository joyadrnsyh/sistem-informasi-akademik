import React from 'react';

/**
 * A highly customizable UI Button component.
 */
export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 focus:ring-indigo-500 active:scale-[0.98]',
    secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/80 focus:ring-stone-500 active:scale-[0.98]',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10 focus:ring-emerald-500 active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/10 focus:ring-rose-500 active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-stone-50 text-stone-700 border border-stone-300 hover:border-stone-400 focus:ring-indigo-500 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-stone-100 text-stone-550 hover:text-stone-800 focus:ring-indigo-500',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />
      ) : null}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className={`h-4 w-4 ${children ? 'ml-2' : ''}`} />
      ) : null}
    </button>
  );
};

export default Button;
