import React, { useEffect, useState } from "react";

const Layout = ({ children, sidebar, headings = [] }) => {
  const [activeHeading, setActiveHeading] = useState("");

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
      window.history.pushState(null, "", `#${id}`); // Update URL
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex p-4 relative">
        {sidebar && <aside className="w-1/4 mr-4">{sidebar}</aside>}

        <main className="flex w-3/4 relative">
          {/* Article Content */}
          <article className="w-3/4 max-w-none prose
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
            lg:prose-xl">
            {children}
          </article>

          {/* Sticky Headings List */}
          {headings && headings.length > 0 && (
            <div className="w-1/4 ml-4 relative">
              <div className="sticky top-4 p-4 border-l">
                <h3 className="text-lg font-semibold">Jump to Section</h3>
                <ul className="space-y-2 text-sm">
                  {headings.map((heading) => {
                    const headingId = heading.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <li
                        key={headingId}
                        className={`cursor-pointer ${
                          activeHeading === headingId ? "text-blue-600 font-bold" : ""
                        }`}
                        onClick={() => handleClick(headingId)}
                      >
                        {heading}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
