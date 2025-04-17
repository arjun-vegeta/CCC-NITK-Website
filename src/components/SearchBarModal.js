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
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col items-center pt-24 px-4">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-white text-4xl font-bold hover:text-gray-300 transition"
          onClick={closeSearch}
        >
          &times;
        </button>

        {/* Search Container - add ref here */}
        <div ref={modalRef} className="flex justify-center flex-col items-center w-full">
          {/* Search Input */}
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-md shadow-lg p-6">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-lg px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0FA444] dark:bg-gray-800 dark:text-white"
              autoFocus
            />
          </div>

          {/* Search Results */}
          {query && (
            <div className="w-full max-w-2xl mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 space-y-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    onClick={handleLinkClick}
                    className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
                  >
                    {item.title}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 px-4">No results found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default SearchbarModal;