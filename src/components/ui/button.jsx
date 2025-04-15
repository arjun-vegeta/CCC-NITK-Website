import React from 'react';

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke="currentColor"
    className="w-5 h-5"
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
  className = '',
  showIcon = true,
  ...props
}) => {
  const baseStyles =
    "mt-6 inline-flex items-center gap-2 px-9 py-0 text-lg font-semibold shadow-lg rounded-full transition-transform duration-300";
  const colorStyles =
    "border-2 border-black text-black dark:border-white dark:text-white";
  const hoverStyles = "hover:scale-105";
  const noUnderline = "no-underline"; // Added no-underline class

  const buttonClasses = `${baseStyles} ${colorStyles} ${hoverStyles} ${noUnderline} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        {...props}
      >
        <span>{children}</span>
        {showIcon && <ArrowIcon />}
      </a>
    );
  }

  return (
    <button className={buttonClasses} type="button" {...props}>
      <span>{children}</span>
      {showIcon && <ArrowIcon />}
    </button>
  );
};

export default Button;
