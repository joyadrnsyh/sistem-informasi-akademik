import React from 'react';

/**
 * A highly customizable UI stats widget component.
 */
export const StatsCard = ({
  icon: Icon,
  label,
  value,
  subLabel,
  subLabelPosition = 'inline', // 'inline' | 'block'
  iconBgClassName = 'bg-indigo-50 text-indigo-600',
  iconClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`bg-white border border-stone-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs text-left ${className}`} {...props}>
      <div className={`p-3 rounded-2xl flex-shrink-0 ${iconBgClassName}`}>
        {Icon && <Icon className={`h-6 w-6 ${iconClassName}`} />}
      </div>
      <div className="text-left min-w-0 flex-1">
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block truncate">
          {label}
        </span>

        {subLabelPosition === 'inline' ? (
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-stone-800 tracking-tight">
              {value}
            </span>
            {subLabel && (
              <span className="text-[10px] text-stone-400 font-bold uppercase">
                {subLabel}
              </span>
            )}
          </div>
        ) : (
          <div className="mt-1">
            <span className="text-lg font-extrabold text-stone-800 block leading-tight">
              {value}
            </span>
            {subLabel && (
              <span className="text-[9px] text-stone-400 font-semibold block mt-0.5">
                {subLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
