import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ links }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (slug) => {
    setExpanded((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const renderLinks = (items, depth = 0) => {
    return (
      <ul className={`space-y-2 ${depth > 0 ? "ml-4 pl-2 border-l border-gray-300" : ""}`}>
        {items.map((item) => (
          <li key={item.slug}>
            <div
              className="flex justify-between items-center cursor-pointer py-1"
              onClick={() => item.children && toggleExpand(item.slug)}
            >
              <Link
                to={item.href || "#"}
                className={`block text-gray-700 hover:text-primary transition ${
                  location.pathname === item.href ? "font-bold" : ""
                }`}
              >
                {item.title}
              </Link>
              {item.children && (
                <ChevronDown
                  className={`transition-transform duration-200 ${
                    expanded[item.slug] ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>
            {item.children && expanded[item.slug] && (
              <div className="mt-1 ml-2">{renderLinks(item.children, depth + 1)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return <div className="min-h-screen p-6 bg-gray-50">{renderLinks(links)}</div>;
};

export default Sidebar;
