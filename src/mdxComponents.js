import React from 'react';

// Common styling patterns extracted for easier editing
const styles = {
  headings: {
    base: "w-full dark-transition",
    h1: "text-10xl font-extrabold mb-8 mt-10 pb-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white relative",
    h2: "text-2xl font-bold mb-6 mt-8 pb-2 border-b border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 relative",
    h3: "text-xl font-semibold mb-4 mt-6 text-gray-800 dark:text-gray-200",
    h4: "text-lg font-medium mb-3 mt-4 text-gray-700 dark:text-gray-300",
    decoration: {
      h1: "absolute -left-4 top-0 bottom-0 w-1 bg-blue-500 rounded hidden md:block",
      h2: "absolute -left-3 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 rounded hidden md:block"
    }
  },
  text: {
    paragraph: "mb-4 leading-relaxed text-gray-700 dark:text-gray-300 w-full tracking-wide dark-transition",
    link: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors dark-transition",
    list: {
      ul: "mb-4 pl-6 list-disc space-y-2 w-full",
      ol: "mb-4 pl-6 list-decimal space-y-2 w-full",
      li: "text-gray-700 dark:text-gray-300 tracking-wide dark-transition"
    }
  },
  blocks: {
    blockquote: "mb-4 pl-4 border-l-4 border-blue-500/40 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-500/30 py-2 text-gray-700 dark:text-gray-300 italic w-full dark-transition",
    code: {
      inline: "px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 text-sm font-mono dark-transition",
      block: "mb-4 rounded-lg overflow-hidden w-full",
      pre: "p-4 bg-gray-50 dark:bg-gray-800 overflow-x-auto w-full dark-transition",
      content: "text-sm font-mono text-gray-800 dark:text-gray-200"
    },
    table: {
      container: "mb-4 rounded-lg border overflow-hidden w-full dark:border-gray-700 dark-transition",
      th: "px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left border-b dark:border-gray-700 text-gray-800 dark:text-gray-200 dark-transition",
      td: "px-4 py-2 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300 dark-transition"
    },
    image: {
      container: "my-6",
      img: "rounded-lg border shadow-sm dark:border-gray-700 mx-auto",
      caption: "text-center mt-2 text-sm text-gray-500 dark:text-gray-400 dark-transition"
    }
  }
};

// Helper function to generate heading IDs
const generateId = (children) => {
  return typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '';
};

export const mdxComponents = {
  // Heading components
  h1: ({ children, id }) => (
    <h1 id={id || generateId(children)} className={styles.headings.h1}>
      <div className={styles.headings.decoration.h1}></div>
      {children}
    </h1>
  ),
  
  h2: ({ children, id }) => (
    <h2 id={id || generateId(children)} className={styles.headings.h2}>
      <div className={styles.headings.decoration.h2}></div>
      {children}
    </h2>
  ),
  
  h3: ({ children, id }) => (
    <h3 id={id || generateId(children)} className={`${styles.headings.h3} ${styles.headings.base}`}>
      {children}
    </h3>
  ),
  
  h4: ({ children, id }) => (
    <h4 id={id || generateId(children)} className={`${styles.headings.h4} ${styles.headings.base}`}>
      {children}
    </h4>
  ),
  
  // Text components
  p: ({ children }) => (
    <p className={styles.text.paragraph}>{children}</p>
  ),
  
  a: ({ children, href }) => (
    <a href={href} className={styles.text.link} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  
  // Lists
  ul: ({ children }) => <ul className={styles.text.list.ul}>{children}</ul>,
  ol: ({ children }) => <ol className={styles.text.list.ol}>{children}</ol>,
  li: ({ children }) => <li className={styles.text.list.li}>{children}</li>,
  
  // Block elements
  blockquote: ({ children }) => (
    <blockquote className={styles.blocks.blockquote}>{children}</blockquote>
  ),
  
  // Code blocks with inline vs block display
  code: ({ children, className }) => {
    const isInline = !className?.includes('language');
    return isInline ? (
      <code className={styles.blocks.code.inline}>{children}</code>
    ) : (
      <div className={styles.blocks.code.block}>
        <pre className={styles.blocks.code.pre}>
          <code className={`${styles.blocks.code.content} ${className || ''}`}>{children}</code>
        </pre>
      </div>
    );
  },
  
  // Tables
  table: ({ children }) => (
    <div className={styles.blocks.table.container}>
      <table className="w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className={styles.blocks.table.th}>{children}</th>,
  td: ({ children }) => <td className={styles.blocks.table.td}>{children}</td>,
  
  // Images with captions
  img: (props) => {
    const { src, alt, width, height } = props;
    const imagePath = src.startsWith('/') ? src : `/${src}`;
    return (
      <div className={styles.blocks.image.container}>
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
          className={styles.blocks.image.img}
        />
        {alt && <div className={styles.blocks.image.caption}>{alt}</div>}
      </div>
    );
  },
};