import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Home, ChevronDown } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useDarkMode } from "../utils/DarkModeContext";
import Sidebar from "./Sidebar";
import Toc from "./Toc";

// Extracted prose styles
const proseStyles = {
  container: "flex-1 px-6 md:px-12 dark-transition",
  content: "prose dark:prose-invert max-w-none dark-transition",
};

const FullWidthLayout = ({ children, sidebar, headings = [] }) => {
  const location = useLocation();
  const { darkMode } = useDarkMode();

  // --- TOC state & refs ---
  const [activeHeading, setActiveHeading] = useState(null);
  const [hoveredHeading, setHoveredHeading] = useState(null);
  const [headingLinePosition, setHeadingLinePosition] = useState({ top: 0, height: 0 });
  const headingsRefs = useRef({});
  const contentRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // --- window width & resize listener ---
  const getWindowWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  useEffect(() => {
    let frame;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWindowWidth(getWindowWidth()));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  // --- Sidebar open/close & tooltip ---
  const [isSidebarOpen, setSidebarOpen] = useState(getWindowWidth() > 800);
  const [showSidebarTooltip, setShowSidebarTooltip] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  // Handle mobile sidebar item clicks
  const handleSidebarItemClick = useCallback(() => {
    if (windowWidth <= 800) {
      setTimeout(() => setSidebarOpen(false), 350);
    }
  }, [windowWidth]);

  // --- Breadcrumb generation ---
  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split("/").filter((x) => x);
    return [
      { label: "Home", href: "/" },
      ...parts.map((seg, idx) => ({
        label: seg.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: "/" + parts.slice(0, idx + 1).join("/"),
      })),
    ];
  }, [location.pathname]);

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
  }, []);

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
    if (!contentRef.current) return;
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
  }, [children]);

  // --- Sync indicator when activeHeading changes ---
  useEffect(() => {
    if (!hoveredHeading && activeHeading) updateHeadingLinePosition(activeHeading);
  }, [activeHeading, hoveredHeading, updateHeadingLinePosition]);

  // --- Memoized sidebar toggle handlers ---
  const handleSidebarMouseEnter = useCallback(() => setShowSidebarTooltip(true), []);
  const handleSidebarMouseLeave = useCallback(() => setShowSidebarTooltip(false), []);

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

  // Extract sidebar links from the sidebar prop (assuming it's a Sidebar component with links)
  const sidebarLinks = useMemo(() => {
    if (!sidebar?.props?.links) return [];
    return sidebar.props.links;
  }, [sidebar]);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      {sidebar && (
        <>
          <div
            className={`
              ${windowWidth > 800 
                ? `w-[300px] sticky top-[89px] md:top-[93px] h-[calc(100vh-93px)]` 
                : `w-4/5 absolute top-[52px] bottom-0`
              }
              bg-[#f5f5f5] dark:bg-[#0b0c10] overflow-y-auto z-20 
              transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="h-full border-r border-gray-300 dark:border-gray-700">
              <Sidebar 
                links={sidebarLinks} 
                isOpen={isSidebarOpen}
                onItemClick={handleSidebarItemClick}
              />
            </div>
          </div>

          {/* Mobile overlay when sidebar is open */}
          {windowWidth <= 800 && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main content - no margin adjustment, maintains original layout */}
      <div
        className={`flex-1 flex flex-col`}
        style={{
          transition: 'margin-left 0.3s, width 0.3s',
          ...(sidebar && windowWidth > 800 && !isSidebarOpen
            ? { marginLeft: "-300px", width: "calc(100% + 300px)" }
            : {})
        }}
      >
        {/* Navbar + breadcrumb + toggle */}
        <div className="z-40 sticky top-[89px] md:top-[93px] shadow-md bg-[#f5f5f5] dark:bg-[#0b0c10] border-gray-300 dark:border-b dark:border-gray-700 dark-transition">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              onMouseEnter={handleSidebarMouseEnter}
              onMouseLeave={handleSidebarMouseLeave}
              className="relative h-full px-4 py-4 border-r border-gray-300 dark:border-gray-700 bg-[#f5f5f5] dark:bg-[#0b0c10] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19" height="19"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-layout-sidebar"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M9 4l0 16" />
              </svg>
              {showSidebarTooltip && windowWidth > 800 && (
                <div className="absolute left-12 top-full mt-1 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-30 whitespace-nowrap">
                  {isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                </div>
              )}
            </button>
            <div className="flex-1">
              <Breadcrumb className="px-8 py-4">
                <BreadcrumbList className="flex items-center">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={crumb.href + idx}>
                      <BreadcrumbItem>
                        {idx === 0 ? (
                          <BreadcrumbLink href={crumb.href} asChild>
                            <Link to={crumb.href} className="flex items-center gap-1">
                              <Home className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </Link>
                          </BreadcrumbLink>
                        ) : idx < breadcrumbs.length - 1 ? (
                          <BreadcrumbLink href={crumb.href} asChild>
                            <Link to={crumb.href}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>

        {/* Content & TOC */}
        <div className="flex flex-1">
          {/* Main article */}
          <div className="flex-1 flex flex-col">
            <div className={proseStyles.container}>
              <div ref={contentRef} className={proseStyles.content} style={{ width: "100%" }}>
                {children}
              </div>
            </div>
          </div>

          {/* TOC (desktop only >800px) */}
          {windowWidth > 996 && sidebar && headings.length > 0 && (
            <Toc headings={headings} contentRef={contentRef} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FullWidthLayout;