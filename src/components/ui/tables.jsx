import React, { useRef, useState } from 'react';

/**
 * A mobile-first responsive table component
 * Uses CSS containment and proper touch handling to ensure scrolling works correctly
 */
const Table = ({ children, className = "", ...props }) => {
  // Add touch event handlers
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);

  // Handle touch start - capture initial position
  const handleTouchStart = (e) => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      const canScroll = scrollWidth > clientWidth;
      setIsScrolling(false);
      setStartX(e.touches[0].clientX);
      
      // Only prevent default if the table is scrollable horizontally
      if (canScroll) {
        // Don't prevent default yet - just detect if scrolling is possible
        e.stopPropagation();
      }
    }
  };
  
  // Handle touch move - determine if horizontal scrolling should be engaged
  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    
    const { scrollWidth, clientWidth } = containerRef.current;
    if (scrollWidth <= clientWidth) return; // Not scrollable horizontally
    
    const currentX = e.touches[0].clientX;
    const diffX = Math.abs(startX - currentX);
    
    // If horizontal movement is detected on a scrollable table
    if (diffX > 5) {
      setIsScrolling(true);
    }
  };
  
  // Clean up when touch ends
  const handleTouchEnd = () => {
    setIsScrolling(false);
  };

  // For MDX-based tables
  if (children) {
    return (
      <div className="relative mb-6 rounded-lg border border-gray-300 dark:border-gray-700 inline-block max-w-[86vw] w-auto mx-auto">
        <div 
          ref={containerRef}
          className="overflow-x-auto scrolling-touch"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            // Only handle horizontal scrolling when needed, otherwise let the page scroll
            touchAction: isScrolling ? 'pan-x' : 'auto'
          }}
        >
          <div className="min-w-max md:min-w-min">
            <table className="w-auto" cellPadding="0" cellSpacing="0" {...props}>
              {children}
            </table>
          </div>
        </div>
      </div>
    );
  }

  // For legacy prop-based tables
  const { headers, rows } = props;
  
  return (
    <div className="relative mb-6 rounded-lg border border-gray-300 dark:border-gray-700 inline-block max-w-full md:max-w-[85vw] w-auto mx-auto">
      <div 
        ref={containerRef}
        className="overflow-x-auto scrolling-touch"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          // Only handle horizontal scrolling when needed, otherwise let the page scroll
          touchAction: isScrolling ? 'pan-x' : 'auto'
        }}
      >
        <div className="min-w-max">
          <table className="w-auto" cellPadding="0" cellSpacing="0">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {headers?.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-800 font-semibold text-left border-b dark:border-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rows?.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Also export individual table elements for MDX usage
export const Thead = ({ children, ...props }) => (
  <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
    {children}
  </thead>
);

export const Tbody = ({ children, ...props }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props}>
    {children}
  </tbody>
);

export const Tr = ({ children, ...props }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50" {...props}>
    {children}
  </tr>
);

export const Th = ({ children, ...props }) => (
  <th
    className="px-4 py-3 bg-gray-50 dark:bg-gray-800 font-semibold text-left border-b dark:border-gray-700 text-gray-800 dark:text-gray-200"
    {...props}
  >
    {children}
  </th>
);

export const Td = ({ children, ...props }) => (
  <td
    className="px-4 py-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300"
    {...props}
  >
    {children}
  </td>
);

export { Table };
export default Table;