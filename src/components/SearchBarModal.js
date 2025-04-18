import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Static Routes
const staticItems = [
  { title: "Home", link: "/" },
  { title: "About Us", link: "/about" },
  { title: "Facilities", link: "/facilities" },
  { title: "Network Guides", link: "/guides" },
];

// Load .mdx files from the /content directory
const req = require.context("../content", true, /\.mdx$/);

const mdxItems = req.keys().map((filePath) => {
  // Split path by '/', lowercase, replace spaces with underscores
  const parts = filePath
    .replace(/^.\//, "") // remove leading './'
    .split("/") // split by '/'
    .map((part) =>
      part
        .replace(/\s+/g, "_")
        .replace(/\.mdx$/, "") // remove the file extension
    );

  // Remove 'content' from the parts array (as it's not needed in the link)
  const filteredParts = parts.filter((part) => part !== "content");

  // Build the link from the filtered parts
  const link = "/" + filteredParts.join("/");

  // Fallback title from last part (format it nicely)
  const last = filteredParts[filteredParts.length - 1];
  const title = last.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title,
    link,
  };
});

// Combine static items and mdx items
const items = [...staticItems, ...mdxItems];

const SearchbarModal = ({ display, closeSearch }) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const modalRef = useRef(null);

  // Search functionality: filter items based on the query
  useEffect(() => {
    if (query === "") {
      setFilteredItems([]);
    } else {
      const results = items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(results);
    }
  }, [query]);

  // Reset query when the modal is closed or hidden
  useEffect(() => {
    if (!display) {
      setQuery("");
    }
  }, [display]);

  // Handle outside clicks to close the modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Only process if the modal is displayed
      if (!display) return;

      // Check if the click was outside the modal
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeSearch();
        // Query will be cleared by the display effect above
      }
    };

    // Add the event listener to the document
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [display, closeSearch]);

  // Handle navigation with link click
  const handleLinkClick = () => {
    closeSearch();
    // Query will be cleared by the display effect above
  };

  return (
    display && (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center pt-20 px-4">
        {/* Modal Container */}
        <div ref={modalRef} className="w-full max-w-2xl">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Search </h2>
            <button
              onClick={closeSearch}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input Container */}
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[70vh] overflow-hidden">
            <div className="relative">
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Search facilities, guides and policies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-lg pl-12 pr-12 py-5 rounded-lg border-2 border-inset border-green-500 dark:bg-gray-900 dark:text-white placeholder-gray-400"
              />


              {/* Clear Button */}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="mt-4">
              <Link
                to="/advanced-search"
                state={{ query }}
                onClick={handleLinkClick}
                className="inline-flex ml-4 mb-3 items-center text-base font-medium text-[#0FA444] hover:text-[#0d8c3a] transition-colors"
              >
                Advanced Search
              </Link>
            </div>

            {/* Scrollable Search Results */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 overflow-y-auto max-h-[40vh] pr-1 custom-scroll">
              {(query ? filteredItems : items).length > 0 ? (
                (query ? filteredItems : items).map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    onClick={handleLinkClick}
                    className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span className="w-3 h-3 mr-3 rounded-full bg-[#0D1C44] dark:bg-gray-200 group-hover:bg-[#0FA444] flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-200 group-hover:text-[#0FA444] transition-colors">
                      {item.title}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    )
  );
};

export default SearchbarModal;