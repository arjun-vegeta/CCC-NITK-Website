import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useDarkMode } from "../utils/DarkModeContext";

// Extracted prose styles
const proseStyles = {
  container: "flex-1 px-6 md:px-12 dark-transition",
  content: "prose dark:prose-invert max-w-none dark-transition",
};

const FullWidthLayout = ({ children, sidebar, headings = [] }) => {
  const location = useLocation();
  const { darkMode } = useDarkMode();

  // --- TOC state & refs ---
  const [manualOverride, setManualOverride] = useState(false);
  const [activeHeading, setActiveHeading] = useState(null);
  const [hoveredHeading, setHoveredHeading] = useState(null);
  const [headingLinePosition, setHeadingLinePosition] = useState({ top: 0, height: 0 });
  const headingsRefs = useRef({});
  const contentRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // --- window width & resize listener ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // --- Sidebar open/close & tooltip ---
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 800);
  const [showSidebarTooltip, setShowSidebarTooltip] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => setSidebarOpen((o) => !o);

  // Close sidebar on any link click in mobile
  useEffect(() => {
    const node = sidebarRef.current;
    if (!node) return;
    const handleClick = (e) => {
      if (windowWidth <= 800) {
        const link = e.target.closest("a");
        if (link) setSidebarOpen(false);
      }
    };
    node.addEventListener("click", handleClick);
    return () => node.removeEventListener("click", handleClick);
  }, [windowWidth]);

  // --- Breadcrumb generation ---
  const generateBreadcrumbs = () => {
    const parts = location.pathname.split("/").filter((x) => x);
    return [
      { label: "Home", href: "/" },
      ...parts.map((seg, idx) => ({
        label: seg.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: "/" + parts.slice(0, idx + 1).join("/"),
      })),
    ];
  };
  const breadcrumbs = generateBreadcrumbs();

  // --- Smooth scroll handler ---
  const handleClickHeading = (id) => {
    setActiveHeading(id);
    setManualOverride(true);
    updateHeadingLinePosition(id);
    const el = document.getElementById(id);
    if (el) {
      window.history.pushState(null, "", `#${id}`);
      const headerOffset = 56; // match your navbar height
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setTimeout(() => setManualOverride(false), 5000);
  };

  // --- Parse & build TOC tree ---
  const parseHeadings = (flat) =>
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
    });
  const buildTree = (nodes) => {
    const root = [], stack = [];
    nodes.filter((h) => h.level > 1).forEach((h) => {
      while (stack.length && stack[stack.length - 1].level >= h.level) stack.pop();
      if (!stack.length) root.push(h);
      else stack[stack.length - 1].children.push(h);
      stack.push(h);
    });
    return root;
  };
  const structuredHeadings = buildTree(parseHeadings(headings));

  // --- Indicator position updater ---
  const updateHeadingLinePosition = (id) => {
    const el = headingsRefs.current[id];
    if (!el) return;
    const container = el.closest(".toc-container");
    const cRect = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setHeadingLinePosition({ top: r.top - cRect.top, height: r.height });
  };

  // --- TOC hover handlers ---
  const handleHeadingHover = (id) => {
    setHoveredHeading(id);
    updateHeadingLinePosition(id);
  };

  // --- On initial hash ---
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (id && headingsRefs.current[id]) updateHeadingLinePosition(id);
  }, [location]);

  // --- IntersectionObserver for scrolling ---
  useEffect(() => {
    if (!contentRef.current) return;
    const elems = contentRef.current.querySelectorAll("h2, h3, h4, h5, h6");
    const obs = new IntersectionObserver((entries) => {
      if (manualOverride) return;
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;
      const nearest = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      setActiveHeading(nearest.target.id);
    }, { root: null, rootMargin: "0px 0px -70% 0px", threshold: 0.1 });
    elems.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [children, manualOverride]);

  // --- Sync indicator when activeHeading changes ---
  useEffect(() => {
    if (!hoveredHeading && activeHeading) updateHeadingLinePosition(activeHeading);
  }, [activeHeading, hoveredHeading]);

  // --- Recursive TOC render ---
  const renderHeadings = (items, depth = 0) => (
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
  );

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      {sidebar && (
        <div
          ref={sidebarRef}
          className={`
          ${windowWidth > 800
              ? `${isSidebarOpen ? "w-[300px]" : "w-0"} sticky top-[89px] md:top-[93px] h-[calc(100vh-93px)] -left-1 transition-[width] duration-300 ease-in-out`
              : `${isSidebarOpen ? "w-4/5" : "w-0"} absolute top-14 bottom-0 transition-[width] duration-300 ease-in-out`}
          bg-[#f5f5f5] dark:bg-[#0b0c10] overflow-y-auto
          z-20
          ${isSidebarOpen
              ? "translate-x-0"
              : windowWidth > 800
                ? "-translate-x-0"
                : "-translate-x-0"}
        `}
        >
          {/* Only render sidebar content if open on desktop, always on mobile */}
          {(isSidebarOpen || windowWidth > 800) && (
            <div className="h-full border-r border-gray-300 dark:border-gray-700">
              {sidebar}
            </div>
          )}
        </div>
      )}

      {/* Main content (shifts on desktop) */}
      <div
        className={"flex-1 flex flex-col transition-[margin] duration-300 ease-in-out"}
      >
        {/* Navbar + breadcrumb + toggle */}
        <div className="z-40 sticky top-[89px] md:top-[93px] shadow-md bg-[#f5f5f5] dark:bg-[#0b0c10] border-gray-300 dark:border-b dark:border-gray-700 dark-transition">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              onMouseEnter={() => setShowSidebarTooltip(true)}
              onMouseLeave={() => setShowSidebarTooltip(false)}
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
                    <React.Fragment key={idx}>
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
          {windowWidth > 800 && sidebar && structuredHeadings.length > 0 && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky border-l border-gray-300 dark:border-gray-700 top-36 p-4 toc-container dark-transition">
                <div
                  className="absolute transition-all duration-200"
                  style={{
                    left: "7px",
                    top: `${headingLinePosition.top}px`,
                    height: `${headingLinePosition.height}px`,
                    width: "2.5px",
                    background: darkMode ? "#f3f4f6" : "#000",
                    clipPath:
                      "polygon(0 4px, 100% 6px, 100% calc(100% - 4px), 0 calc(100% - 2px))",
                    borderRadius: "3px",
                    opacity: hoveredHeading || activeHeading ? 1 : 0,
                    zIndex: 10,
                  }}
                />
                <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 dark-transition">
                  Table of Contents
                </h3>
                {renderHeadings(structuredHeadings)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullWidthLayout;