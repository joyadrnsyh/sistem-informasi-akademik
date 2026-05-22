import React from 'react';

/**
 * Reusable Form Input component with support for text, password, number, select, and textarea.
 */
export const InputForm = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  options = [], // For select type
  rows = 3,     // For textarea type
  icon: Icon,
  ...props
}) => {
  const inputBaseClasses = 'w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const hasIconClass = Icon ? 'pl-11' : '';
  const errorBorderClass = error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : '';

  return (
    <div className={`mb-4 text-left ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-stone-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputBaseClasses} ${hasIconClass} ${errorBorderClass}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white text-stone-800">
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            className={`${inputBaseClasses} ${hasIconClass} ${errorBorderClass}`}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputBaseClasses} ${hasIconClass} ${errorBorderClass}`}
            {...props}
          />
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputForm;
