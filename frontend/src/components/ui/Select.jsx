import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * A highly reusable custom Select dropdown menu component.
 */
export const Select = ({
  options = [],
  value,
  onChange,
  className = '',
  containerClassName = '',
  selectSize = 'md', // 'sm' | 'md'
  variant = 'default', // 'default' | 'flat'
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 pr-6 rounded-lg font-bold',
    md: 'text-xs px-4 py-2 pr-10 rounded-xl font-bold',
  };

  const variantClasses = {
    default: 'bg-white border border-stone-200 hover:border-stone-300 text-stone-600 shadow-sm',
    flat: 'bg-stone-50 border border-stone-200/80 text-stone-500 hover:bg-stone-100',
  };

  return (
    <div className={`relative inline-block ${containerClassName}`}>
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none focus:outline-none cursor-pointer ${sizeClasses[selectSize]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {label}
            </option>
          );
        })}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-stone-400">
        <ChevronDown className={selectSize === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      </div>
    </div>
  );
};

export default Select;
