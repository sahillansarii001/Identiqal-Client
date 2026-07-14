import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  className = '',
  description,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full px-4 py-2.5 bg-slate-900 border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-indigo-500 focus:border-indigo-500'
        } rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2`}
        {...props}
      />
      {description && !error && (
        <span className="text-xs text-slate-500">{description}</span>
      )}
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
