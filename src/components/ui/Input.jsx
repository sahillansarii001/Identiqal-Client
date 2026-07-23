import React from "react";

export const Input = React.forwardRef(
  (
    {
      label,
      type = "text",
      error,
      className = "",
      description,
      rightElement,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:!text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={`w-full px-4 py-2.5 bg-white dark:!bg-white/5 border ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-[#E2E8F0] dark:!border-white/10 focus:ring-[#2563EB] focus:border-[#2563EB] dark:focus:!border-[#3B82F6]"
            } rounded-xl text-slate-900 dark:!text-white placeholder-slate-400 dark:!placeholder-slate-400 text-sm transition-all focus:outline-none focus:ring-2 ${
              rightElement ? "pr-10" : ""
            }`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
              {rightElement}
            </div>
          )}
        </div>
        {description && !error && (
          <span className="text-xs text-slate-500 dark:!text-slate-400">{description}</span>
        )}
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

