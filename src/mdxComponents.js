import React from 'react';

export const mdxComponents = {
  h1: ({ children, id }) => {
    const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '');
    return (
      <h1 id={headingId} className="text-10xl font-extrabold mb-8 mt-10 pb-4 border-b border-gray-200 dark:border-gray-700 w-full relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500 rounded hidden md:block"></div>
        {children}
      </h1>
    );
  },
  h2: ({ children, id }) => {
    const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '');
    return (
      <h2 id={headingId} className="text-2xl font-bold mb-6 mt-8 pb-2 border-b border-gray-100 dark:border-gray-700 w-full relative">
        <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gray-300 rounded hidden md:block"></div>
        {children}
      </h2>
    );
  },
  h3: ({ children, id }) => {
    const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '');
    return (
      <h3 id={headingId} className="text-xl font-semibold mb-4 mt-6 text-gray-800 dark:text-gray-200 w-full">
        {children}
      </h3>
    );
  },
  h4: ({ children, id }) => {
    const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '');
    return (
      <h4 id={headingId} className="text-lg font-medium mb-3 mt-4 text-gray-700 dark:text-gray-300 w-full">
        {children}
      </h4>
    );
  },
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-blue-700 dark:text-gray-300 w-full tracking-wide">
      {children}
    </p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 pl-6 list-disc space-y-2 w-full">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 pl-6 list-decimal space-y-2 w-full">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-700 dark:text-gray-300 tracking-wide">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 pl-4 border-l-4 border-blue-500/40 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-500/30 py-2 text-gray-700 dark:text-gray-300 italic w-full">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isInline = !className?.includes('language');
    return isInline ? (
      <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 text-sm font-mono">
        {children}
      </code>
    ) : (
      <div className="mb-4 rounded-lg overflow-hidden w-full">
        <pre className="p-4 bg-gray-50 dark:bg-gray-800 overflow-x-auto w-full">
          <code className={`text-sm font-mono ${className}`}>{children}</code>
        </pre>
      </div>
    );
  },
  table: ({ children }) => (
    <div className="mb-4 rounded-lg border overflow-hidden w-full">
      <table className="w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left border-b">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border-b dark:border-gray-700">
      {children}
    </td>
  ),
  img: (props) => {
    const { src, alt, width, height } = props;
    const imagePath = src.startsWith('/') ? src : `/${src}`;
    return (
      <div className="my-6">
        <img
          {...props}
          src={imagePath}
          alt={alt}
          width={width}
          height={height}
          style={{ 
            maxWidth: width || '100%',
            height: height || 'auto',
            width: width || 'auto'
          }}
          className="rounded-lg border shadow-sm dark:border-gray-700 mx-auto"
        />
        {alt && <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">{alt}</div>}
      </div>
    );
  },
};