import React from "react";
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
      const headerOffset = 7;
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
    const filteredHeadings = headings.filter(heading => heading.level > 1);

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

  const renderHeadings = (items, depth = 0) => (
    <ul className="space-y-3">
      {items.map(({ title, id, children }) => (
        <li key={id}>
          <div
            className={`group flex items-center cursor-pointer 
              ${depth === 0 ? "font-medium text-gray-700" : 
                depth === 1 ? "font-medium text-gray-700 pl-3" : 
                depth === 2 ? "text-gray-700 pl-6" : "text-gray-600 pl-9"}
              hover:text-black  transition-colors duration-200`}  
            onClick={() => handleClick(id)}
          >
            <span className="text-sm">{title}</span>
          </div>
          {children.length > 0 && (
            <div className={`mt-2.5`}>
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
            <div className="sticky top-0 z-10 bg-white border-l  border-gray-200">
              <Breadcrumb className="px-12 py-4">
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {index === 0 ? (
                          <BreadcrumbLink href={crumb.href} asChild>
                            <Link to={crumb.href} className="flex items-center gap-1">
                              <Home className="h-4 w-4" />
                              {/* {crumb.label} */}
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
            <div className="flex-1 border-l border-gray-200  px-12 py-6">
              {/* Adjusted the font size here to text-sm */}
              <div style={{ width: '100%' }} className="prose prose-sm max-w-none">
                {children}
              </div>
            </div>
          </div>
          
          {/* Table of contents sidebar */}
          {structuredHeadings.length > 0 && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky border-l top-24 p-4">
                <div className="pl-4">
                  <h3 className="text-base font-semibold mb-6 pl-0 text-gray-900">Table of Contents</h3>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-0"></div>
                    <div className="space-y-4 pl-0 relative">
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
