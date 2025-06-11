import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDarkMode } from "../utils/DarkModeContext";

const Toc = ({ headings = [], contentRef }) => {
  const location = useLocation();
  const { darkMode } = useDarkMode();

  // --- TOC state & refs ---
  const [activeHeading, setActiveHeading] = useState(null);
  const [hoveredHeading, setHoveredHeading] = useState(null);
  const [headingLinePosition, setHeadingLinePosition] = useState({ top: 0, height: 0 });
  const headingsRefs = useRef({});
  const hoverTimeoutRef = useRef(null);

  // --- Parse & build TOC tree ---
  const parseHeadings = useCallback((flat) =>
    flat.map((h) => {
      let title = "", level = 1;
      if (typeof h === "string") {
        const m = h.match(/^(#+)\s*(.+)/);
        if (m) { level = m[1].length; title = m[2].trim(); }
        else title = h;
      } else {
        title = h.title; level = h.level || 1;
      }
      return { title, id: title.toLowerCase().replace(/\s+/g, "-"), level, children: [] };
    }),
  []);
  const buildTree = useCallback((nodes) => {
    const root = [], stack = [];
    nodes.filter((h) => h.level > 1).forEach((h) => {
      while (stack.length && stack[stack.length - 1].level >= h.level) stack.pop();
      if (!stack.length) root.push(h);
      else stack[stack.length - 1].children.push(h);
      stack.push(h);
    });
    return root;
  }, []);
  const structuredHeadings = useMemo(() => buildTree(parseHeadings(headings)), [headings, parseHeadings, buildTree]);

  // --- Indicator position updater ---
  const updateHeadingLinePosition = useCallback((id) => {
    const el = headingsRefs.current[id];
    if (!el) return;
    const container = el.closest(".toc-container");
    const cRect = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setHeadingLinePosition({ top: r.top - cRect.top, height: r.height });
  }, []);

  // --- TOC hover handlers ---
  const handleHeadingHover = useCallback((id) => {
    setHoveredHeading(id);
    updateHeadingLinePosition(id);
  }, [updateHeadingLinePosition]);

  // --- On initial hash ---
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (id && headingsRefs.current[id]) updateHeadingLinePosition(id);
  }, [location, updateHeadingLinePosition]);

  // --- IntersectionObserver for scrolling ---
  useEffect(() => {
    if (!contentRef?.current) return;
    const elems = contentRef.current.querySelectorAll("h2, h3, h4, h5, h6");
    if (!elems.length) return;
    let ticking = false;
    const obs = new window.IntersectionObserver((entries) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const nearest = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActiveHeading(nearest.target.id);
        }
        ticking = false;
      });
    }, { root: null, rootMargin: "0px 0px -70% 0px", threshold: 0.1 });
    elems.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [contentRef, headings]);

  // --- Sync indicator when activeHeading changes ---
  useEffect(() => {
    if (!hoveredHeading && activeHeading) updateHeadingLinePosition(activeHeading);
  }, [activeHeading, hoveredHeading, updateHeadingLinePosition]);

  // --- Smooth scroll handler ---
  const handleClickHeading = useCallback((id) => {
    setActiveHeading(id);
    updateHeadingLinePosition(id);
    const el = document.getElementById(id);
    if (el) {
      window.history.pushState(null, "", `#${id}`);
      const headerOffset = 170;
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [updateHeadingLinePosition]);

  // --- Recursive TOC render ---
  const renderHeadings = useCallback((items, depth = 0) => (
    <ul className={`space-y-3.5 ${depth > 0 ? "pl-6" : ""}`}>
      {items.map(({ title, id, children }) => (
        <li key={id} className="relative">
          <div
            ref={(el) => (headingsRefs.current[id] = el)}
            className={`
              group flex items-center cursor-pointer transition-colors duration-200
              ${activeHeading === id
                ? "font-medium text-black dark:text-white"
                : "font-normal text-gray-600 dark:text-gray-400"}
              dark-transition
            `}
            onClick={() => handleClickHeading(id)}
            onMouseEnter={() => {
              hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current);
              handleHeadingHover(id);
            }}
            onMouseLeave={() => {
              hoverTimeoutRef.current = setTimeout(() => setHoveredHeading(null), 150);
            }}
          >
            <span className="text-sm group-hover:text-gray-900 dark:group-hover:text-gray-200">
              {title}
            </span>
          </div>
          {children.length > 0 && <div className="mt-3.5">{renderHeadings(children, depth + 1)}</div>}
        </li>
      ))}
    </ul>
  ), [activeHeading, handleClickHeading, handleHeadingHover]);

  // --- Memoized TOC indicator style ---
  const tocIndicatorStyle = useMemo(() => ({
    left: "7px",
    top: `${headingLinePosition.top}px`,
    height: `${headingLinePosition.height}px`,
    width: "2.5px",
    background: darkMode ? "#f3f4f6" : "#000",
    clipPath: "polygon(0 4px, 100% 6px, 100% calc(100% - 4px), 0 calc(100% - 2px))",
    borderRadius: "3px",
    opacity: hoveredHeading || activeHeading ? 1 : 0,
    zIndex: 10,
  }), [headingLinePosition, darkMode, hoveredHeading, activeHeading]);

  if (!headings || !headings.length) return null;

  return (
    <div className="w-80 flex-shrink-0">
      <div className="sticky border-l border-gray-300 dark:border-gray-700 top-36 p-4 toc-container dark-transition">
        <div
          className="absolute transition-all duration-200"
          style={tocIndicatorStyle}
        />
        <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 dark-transition">
          Table of Contents
        </h3>
        {renderHeadings(structuredHeadings)}
      </div>
    </div>
  );
};

export default Toc; 