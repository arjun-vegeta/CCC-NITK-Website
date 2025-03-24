import React from 'react';

export const mdxComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mb-6 mt-8 border-b pb-2 dark:border-gray-700">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mb-4 mt-6 border-b pb-2 dark:border-gray-700">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-medium mb-3 mt-4">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">
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
    <ul className="mb-4 pl-6 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 pl-6 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:text-gray-400 dark:border-gray-600">
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
      <div className="mb-4 rounded-lg overflow-hidden">
        <pre className="p-4 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
          <code className={`text-sm font-mono ${className}`}>{children}</code>
        </pre>
      </div>
    );
  },
  table: ({ children }) => (
    <div className="mb-4 rounded-lg border overflow-hidden">
      <table className="w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left border-b">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border-b dark:border-gray-700">{children}</td>
  ),
  img: ({ src, alt }) => (
    <div className="my-6">
      <img
        src={src}
        alt={alt}
        className="rounded-lg border shadow-sm dark:border-gray-700 mx-auto"
      />
      {alt && <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">{alt}</div>}
    </div>
  ),
};