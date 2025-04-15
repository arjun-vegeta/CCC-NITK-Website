import React from 'react';

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-5 h-5 ml-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
    />
  </svg>
);

const Button = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-blue-500",
    light: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 dark:bg-transparent dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800/30",
    dark: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
    auto: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
  };

  const sizeStyles = {
    sm: "text-sm px-4 py-1",
    md: "text-base px-8 py-1",
    lg: "text-lg px-10 py-1"
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        <span>{children}</span>
        {showIcon && <ArrowIcon />}
      </a>
    );
  }

  return (
    <button
      className={buttonClasses}
      type="button"
      {...props}
    >
      <span>{children}</span>
      {showIcon && <ArrowIcon />}
    </button>
  );
};

export default Button;
