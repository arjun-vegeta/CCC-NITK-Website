import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home } from "lucide-react";

const Layout = ({ children, sidebar, headings = [] }) => {
  const [activeHeading, setActiveHeading] = useState("");
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

  // Heading scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      let current = "";

      headingElements.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          current = heading.id;
        }
      });

      setActiveHeading(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      window.history.pushState(null, "", `#${id}`);
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const parseHeadings = (flatHeadings) => {
    return flatHeadings.map((title) => {
      const level = (title.toLowerCase().match(/sub/g) || []).length + 1;
      const id = title.toLowerCase().replace(/\s+/g, "-");
      return { title, id, level, children: [] };
    });
  };

  const buildTree = (headings) => {
    const root = [];
    const stack = [];

    headings.forEach((heading) => {
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
    <ul className={`space-y-1 ${depth > 0 ? "ml-4 pl-3 border-l border-gray-300" : ""}`}>
      {items.map(({ title, id, children }) => (
        <li key={id}>
          <div
            className={`cursor-pointer pl-2 ${
              activeHeading === id ? "text-blue-600 font-semibold" : ""
            }`}
            onClick={() => handleClick(id)}
          >
            {title}
          </div>
          {children.length > 0 && renderHeadings(children, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumbs */}
      <nav
        className="py-4 flex justify-center bg-white shadow-sm"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 text-base font-semibold text-gray-800">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-1 text-gray-400">/</span>}
              {index === 0 ? (
                <Link
                  to={crumb.href}
                  className="hover:text-blue-600"
                  aria-label="Home"
                >
                  <Home
                    size={20}
                    className="text-gray-700 hover:text-blue-600"
                  />
                </Link>
              ) : index < breadcrumbs.length - 1 ? (
                <Link to={crumb.href} className="hover:text-blue-600">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-blue-600">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex p-4 relative">
        {sidebar && <aside className="w-1/4 mr-4">{sidebar}</aside>}

        <main className="flex w-3/4 relative">
          <article
            className="w-3/4 max-w-none prose
            prose-lg 
            dark:prose-invert 
            prose-headings:font-semibold
            prose-a:no-underline
            prose-code:before:content-['']
            prose-code:after:content-['']
            prose-pre:bg-gray-50
            dark:prose-pre:bg-gray-800
            prose-img:rounded-xl
            prose-blockquote:border-l-4
            prose-blockquote:not-italic
            prose-table:border-collapse
            prose-td:border
            prose-th:border
            lg:prose-xl"
          >
            {children}
          </article>

          {structuredHeadings.length > 0 && (
            <div className="w-1/4 ml-4 relative">
              <div className="sticky top-4 p-4 border-l">
                <h3 className="text-lg font-semibold mb-2">Jump to Section</h3>
                {renderHeadings(structuredHeadings)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
