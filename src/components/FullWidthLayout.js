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

// Extracted prose styles for easier customization
const proseStyles = {
  container: "flex-1 border-l border-gray-200 dark:border-gray-700 px-6 md:px-12 dark-transition",
  content: "prose dark:prose-invert max-w-none dark-transition",
};

const FullWidthLayout = ({ children, sidebar, headings = [] }) => {
  const location = useLocation();
  const { darkMode } = useDarkMode();

  // New state: Keep track of a manual override while a TOC item is clicked.
  const [manualOverride, setManualOverride] = useState(false);
  // State to keep track of the active (currently visible or clicked) heading.
  const [activeHeading, setActiveHeading] = useState(null);
  // State for the animated indicator
  const [hoveredHeading, setHoveredHeading] = useState(null);
  const [headingLinePosition, setHeadingLinePosition] = useState({ top: 0, height: 0 });
  
  // Refs to TOC heading DOM nodes and the article content
  const headingsRefs = useRef({});
  const contentRef = useRef(null);

  const hoverTimeoutRef = useRef(null);
  
  // State to track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Listen to window resize events and update the state
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --- Breadcrumb generation ---
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { label: "Home", href: "/" },
      ...pathnames.map((segment, index) => ({
        label: segment
          .replace(/_/g, " ") // Replace underscores with spaces
          .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize first letter of each word
        href: "/" + pathnames.slice(0, index + 1).join("/"),
      })),
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  // --- Smooth scroll to a section ---
  const handleClick = (id) => {
    // Immediately mark the clicked heading as active.
    setActiveHeading(id);
    // Activate manual override to prevent the intersection observer from updating activeHeading.
    setManualOverride(true);
    updateHeadingLinePosition(id);

    const targetElement = document.getElementById(id);
    if (targetElement) {
      // Update URL with the hash.
      window.history.pushState(null, "", `#${id}`);
      
      // Calculate offset accounting for a sticky header.
      const headerOffset = 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      // Smooth scroll.
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      console.warn(`Element with id "${id}" not found`);
    }

    // Clear manual override after scrolling settles (adjust timeout if needed).
    setTimeout(() => setManualOverride(false), 5000 );
  };

  // --- Parsing and building a tree for headings ---
  const parseHeadings = (flatHeadings) => {
    return flatHeadings.map((heading) => {
      let title = "";
      let level = 1;
      if (typeof heading === "string") {
        const match = heading.match(/^(#+)\s*(.+)/);
        if (match) {
          level = match[1].length;
          title = match[2].trim();
        } else {
          title = heading;
        }
      } else if (heading && heading.title) {
        title = heading.title;
        level = heading.level || 1;
      }
      const id = title.toLowerCase().replace(/\s+/g, "-");
      return { title, id, level, children: [] };
    });
  };

  const buildTree = (headings) => {
    const root = [];
    const stack = [];
    // Optionally filter out level 1 headings if needed.
    const filteredHeadings = headings.filter((heading) => heading.level > 1);
    filteredHeadings.forEach((heading) => {
      while (stack.length && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }
      if (stack.length === 0) {
        root.push(heading);
      } else {
        stack[stack.length - 1].children.push(heading);
      }
      stack.push(heading);
    });
    return root;
  };

  const structuredHeadings = buildTree(parseHeadings(headings));

  // --- Update the position of the animated indicator based on a heading element ---
  const updateHeadingLinePosition = (id) => {
    const element = headingsRefs.current[id];
    if (element) {
      const container = element.closest(".toc-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        setHeadingLinePosition({
          top: rect.top - containerRect.top,
          height: rect.height,
        });
      }
    }
  };

  // --- Hover handling ---
  const handleHeadingHover = (id) => {
    setHoveredHeading(id);
    updateHeadingLinePosition(id);
  };

  useEffect(() => {
    // If URL contains a hash initially, update the indicator.
    const activeId = location.hash.replace("#", "");
    if (activeId && headingsRefs.current[activeId]) {
      updateHeadingLinePosition(activeId);
    }
  }, [location]);

  // --- Intersection Observer for active heading ---
  useEffect(() => {
    if (!contentRef.current) return;
    const headingElements = contentRef.current.querySelectorAll("h2, h3, h4, h5, h6");

    const observer = new IntersectionObserver((entries) => {
      // Skip updating if a manual override is active.
      if (manualOverride) return;

      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length === 0) return;

      // Choose the entry closest to the top of the viewport.
      const sorted = visibleEntries.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      );
      const newActiveId = sorted[0].target.id;
      setActiveHeading(newActiveId);
    }, {
      root: null,
      // Adjust rootMargin to control when a heading becomes "active."
      rootMargin: "0px 0px -70% 0px",
      threshold: 0.1,
    });

    headingElements.forEach((elem) => {
      observer.observe(elem);
    });

    return () => {
      observer.disconnect();
    };
  }, [children, manualOverride]);

  // --- Update the animated indicator from active heading if not hovering ---
  useEffect(() => {
    if (!hoveredHeading && activeHeading && headingsRefs.current[activeHeading]) {
      updateHeadingLinePosition(activeHeading);
    }
  }, [activeHeading, hoveredHeading]);

  // --- Render the table of contents headings recursively ---
  const renderHeadings = (items, depth = 0) => (
    <ul className={`space-y-3.5 ${depth > 0 ? "pl-6" : ""}`}>
      {items.map(({ title, id, children }) => (
        <li key={id} className="relative">
          <div
            ref={(el) => (headingsRefs.current[id] = el)}
            data-id={id}
            className={`group flex items-center cursor-pointer transition-colors duration-200 ${
              activeHeading === id 
                ? "font-medium text-black dark:text-white" 
                : "font-normal text-gray-600 dark:text-gray-400"
            } dark-transition`}
            onClick={() => handleClick(id)}
            onMouseEnter={() => {
              // Clear any pending timeout to avoid conflict
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              handleHeadingHover(id);
            }}
            onMouseLeave={() => {
              // Delay clearing hovered heading for smoother transition
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredHeading(null);
              }, 150); // Adjust delay time as desired
            }}
          >
            <span className="text-sm group-hover:text-gray-900 dark:group-hover:text-gray-200">
              {title}
            </span>
          </div>

          {children.length > 0 && (
            <div className="mt-3.5">
              {renderHeadings(children, depth + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar - only shown if window width > 768 */}
      {windowWidth > 768 && sidebar && (
        <div className="w-[300px] flex-shrink-0 sticky top-[104px] h-screen overflow-auto">
          {sidebar}
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Content + Right sidebar */}
        <div className="flex flex-1">
          {/* Article content with breadcrumb */}
          <div className="flex-1 flex flex-col">
            {/* Breadcrumb */}
            <div className="z-10 pt-1 shadow-sm bg-white dark:bg-black border-l border-gray-200 dark:border-gray-700 dark-transition">
              <Breadcrumb className="px-12 py-4">
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {index === 0 ? (
                          <BreadcrumbLink href={crumb.href} asChild>
                            <Link to={crumb.href} className="flex items-center gap-1">
                              <Home className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </Link>
                          </BreadcrumbLink>
                        ) : index < breadcrumbs.length - 1 ? (
                          <BreadcrumbLink href={crumb.href} asChild>
                            <Link to={crumb.href}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            {/* Article content */}
            <div className={proseStyles.container}>
              <div style={{ width: "100%" }} className={proseStyles.content} ref={contentRef}>
                {children}
              </div>
            </div>
          </div>
          
          {/* Table of Contents sidebar */}
          {windowWidth > 768 && sidebar && structuredHeadings.length > 0 && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky border-l border-gray-200 dark:border-gray-700 top-28 p-4 toc-container  dark-transition">
                {/* Animated indicator */}
                <div
                  className="absolute transition-all duration-200"
                  style={{
                    left: "7px",
                    top: `${headingLinePosition.top}px`,
                    height: `${headingLinePosition.height}px`,
                    width: "2.5px",
                    background: darkMode ? "#f3f4f6" : "#000000",
                    clipPath:
                      "polygon(0 4px, 100% 6px, 100% calc(100% - 4px), 0 calc(100% - 2px))",
                    borderRadius: "3px",
                    opacity: hoveredHeading || activeHeading ? 1 : 0,
                    transform: "translateX(0)",
                    zIndex: 10,
                  }}
                ></div>
                <div className="pl-0">
                  <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 dark-transition">Table of Contents</h3>
                  <div className="relative">
                    <div className="space-y-4 relative">
                      {renderHeadings(structuredHeadings)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullWidthLayout;
