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
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full px-4 py-2.5 bg-white border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-[#E9E2DC] focus:ring-[#5A3342] focus:border-[#5A3342]'
        } rounded-xl text-slate-900 placeholder-slate-400 text-sm transition-all focus:outline-none focus:ring-2`}
        {...props}
      />
      {description && !error && (
        <span className="text-xs text-slate-550">{description}</span>
      )}
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
