import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import Sidebar from "./Sidebar";
import Toc from "./Toc";

const FullWidthLayout = ({ children, sidebar, headings = [] }) => {
  const location = useLocation();
  const contentRef = useRef(null);

  // Window width management
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

  // Sidebar state
  const [isSidebarOpen, setSidebarOpen] = useState(getWindowWidth() > 800);
  const [showSidebarTooltip, setShowSidebarTooltip] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  const handleSidebarItemClick = useCallback(() => {
    if (windowWidth <= 800) {
      setTimeout(() => setSidebarOpen(false), 350);
    }
  }, [windowWidth]);

  // Breadcrumb generation
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

  const sidebarLinks = useMemo(() => {
    if (!sidebar?.props?.links) return [];
    return sidebar.props.links;
  }, [sidebar]);

  return (
    <div className="flex min-h-screen relative">
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

          {windowWidth <= 800 && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      <div
        className="flex-1 flex flex-col"
        style={{
          transition: 'margin-left 0.3s, width 0.3s',
          ...(sidebar && windowWidth > 800 && !isSidebarOpen
            ? { marginLeft: "-300px", width: "calc(100% + 300px)" }
            : {})
        }}
      >
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

        <div className="flex flex-1">
          <div className="flex-1 px-6 md:px-12 dark-transition">
            <div ref={contentRef} className="prose dark:prose-invert max-w-none dark-transition">
              {children}
            </div>
          </div>

          {windowWidth > 996 && sidebar && headings.length > 0 && (
            <Toc headings={headings} contentRef={contentRef} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FullWidthLayout;