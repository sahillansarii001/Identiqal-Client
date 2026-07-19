import React from "react";

export const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-[#2563EB] hover:bg-[#6A3B4B] text-white shadow-md shadow-[#2563EB]/10 focus:ring-[#2563EB]",
      secondary:
        "bg-white hover:bg-[#F8FAFC] text-[#2563EB] focus:ring-[#2563EB] border border-[#2563EB]",
      outline:
        "btn-hover-dark-text bg-transparent border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#2563EB]/30 text-brand-secondary hover:text-[#0F172A] focus:ring-[#2563EB]",
      danger:
        "bg-red-650 hover:bg-red-600 text-white shadow-md focus:ring-red-500",
      ghost:
        "btn-hover-dark-text bg-transparent hover:bg-[#F8FAFC] text-brand-secondary hover:text-[#0F172A] focus:ring-[#2563EB]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

