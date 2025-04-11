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

const FullWidthLayout = ({ children, sidebar, headings = [] }) => {
  const location = useLocation();

  // Breadcrumb generation
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { label: "Home", href: "/" },
      ...pathnames.map((segment, index) => ({
        label: segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        href: "/" + pathnames.slice(0, index + 1).join("/"),
      })),
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleClick = (id) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      // Update URL with the hash
      window.history.pushState(null, "", `#${id}`);
      
      // Calculate offset to account for sticky header
      const headerOffset = 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      // Scroll to the element with offset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
  };

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
        // In case heading is already an object
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

    // Filter out level 1 headings
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

  // --- Animated Trapezium Indicator logic for headings ---
  const [hoveredHeading, setHoveredHeading] = useState(null);
  const [headingLinePosition, setHeadingLinePosition] = useState({ top: 0, height: 0 });
  const headingsRefs = useRef({});

  const updateHeadingLinePosition = (id) => {
    const element = headingsRefs.current[id];
    if (element) {
      // Get the bounding rectangle relative to the TOC container
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

  const handleHeadingHover = (id) => {
    setHoveredHeading(id);
    updateHeadingLinePosition(id);
  };

  useEffect(() => {
    // If URL contains a hash, update the indicator to the active heading.
    const activeId = location.hash.replace("#", "");
    if (activeId && headingsRefs.current[activeId]) {
      updateHeadingLinePosition(activeId);
    }
  }, [location]);

  // --- Render headings with animated indicator ---
  const renderHeadings = (items, depth = 0) => (
    <ul className={`space-y-3.5 ${depth > 0 ? "pl-6" : ""}`}>
      {items.map(({ title, id, children }) => (
        <li key={id} className="relative">
          <div
            ref={(el) => (headingsRefs.current[id] = el)}
            data-id={id}
            className={`group flex items-center cursor-pointer hover:text-black transition-colors duration-200 ${
              depth === 0
                ? "font-normal text-gray-600"
                : depth === 1
                ? "font-normal text-gray-600"
                : depth === 2
                ? "text-gray-700"
                : "text-gray-600"
            }`}
            onClick={() => handleClick(id)}
            onMouseEnter={() => handleHeadingHover(id)}
            onMouseLeave={() => setHoveredHeading(null)}
          >
            <span className="text-sm">{title}</span>
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
      {/* Left sidebar */}
      {sidebar && (
        <div className="w-[300px] flex-shrink-0 sticky top-0 h-screen overflow-auto">
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
            <div className="sticky top-0 z-10 pt-1 bg-white border-l border-gray-200">
              <Breadcrumb className="px-12 py-4 ">
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {index === 0 ? (
                          <BreadcrumbLink href={crumb.href} asChild>
                            <Link to={crumb.href} className="flex items-center gap-1">
                              <Home className="h-4 w-4" />
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
            <div className="flex-1 border-l border-gray-200 px-12 pb-6">
              <div style={{ width: "100%" }} className="prose max-w-none">
                {children}
              </div>
            </div>
          </div>
          
          {/* Table of Contents sidebar */}
          {structuredHeadings.length > 0 && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky border-l top-24 p-4 toc-container relative">
                {/* Animated trapezium indicator */}
                <div
                  className="absolute transition-all duration-200"
                  style={{
                    left: "7px",
                    top: `${headingLinePosition.top}px`,
                    height: `${headingLinePosition.height}px`,
                    width: "2.5px",
                    background: "#000000",
                    clipPath:
                      "polygon(0 4px, 100% 6px, 100% calc(100% - 4px), 0 calc(100% - 2px))",
                    borderRadius: "3px",
                    opacity: hoveredHeading ? 1 : 0,
                    transform: "translateX(0)",
                    zIndex: 10,
                  }}
                ></div>
                <div className="pl-0">
                  <h3 className="text-base font-semibold mb-6 text-gray-900">Table of Contents</h3>
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
