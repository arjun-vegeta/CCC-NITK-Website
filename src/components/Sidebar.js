import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ links }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [linePosition, setLinePosition] = useState({ top: 0, height: 0 });
  const itemsRef = useRef({});

  const toggleExpand = (slug) => {
    setExpanded((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const updateLinePosition = (itemSlug) => {
    const element = itemsRef.current[itemSlug];
    if (element) {
      const rect = element.getBoundingClientRect();
      const sidebarRect = element.closest('.sidebar-container').getBoundingClientRect();
      setLinePosition({
        top: rect.top - sidebarRect.top,
        height: rect.height
      });
    }
  };

  useEffect(() => {
    const activeItem = Object.keys(itemsRef.current).find(
      key => location.pathname === itemsRef.current[key].getAttribute('data-href')
    );
    if (activeItem) {
      updateLinePosition(activeItem);
    }
  }, [location.pathname]);

  const handleItemHover = (itemSlug) => {
    setHoveredItem(itemSlug);
    updateLinePosition(itemSlug);
  };

  const renderLinks = (items, depth = 0) => {
    return (
      <ul className={`space-y-2 ${depth > 0 ? "ml-4 pl-2 border-l border-gray-200" : ""}`}>
        {items.map((item) => (
          <li key={item.slug} className="relative">
            <div
              ref={el => itemsRef.current[item.slug] = el}
              data-href={item.href}
              className={`flex justify-between items-center cursor-pointer py-1 group transition-all duration-200 ${
                hoveredItem === item.slug ? "translate-x-2" : ""
              }`}
              onClick={() => item.children && toggleExpand(item.slug)}
              onMouseEnter={() => handleItemHover(item.slug)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={item.href || "#"}
                className={`block text-sm transition-all duration-150 ${
                  location.pathname === item.href 
                    ? hoveredItem === item.slug 
                      ? "text-gray-800 font-bold" 
                      : "text-black font-bold"
                    : hoveredItem === item.slug
                      ? "text-gray-800 font-normal"
                      : "text-gray-600 font-normal"
                }`}
              >
                {item.title}
              </Link>
              {item.children && (
                <ChevronDown
                  className={`transition-all duration-200 ${
                    expanded[item.slug] ? "rotate-180" : ""
                  } text-gray-400 group-hover:text-gray-600`}
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

  return (
    <div className="h-[full] p-6 bg-white relative sidebar-container">
      {/* Animated line indicator */}
      <div
        className="absolute left-4 w-0.5 bg-primary transition-all duration-200"
        style={{
          top: `${linePosition.top}px`,
          height: `${linePosition.height}px`,
          opacity: hoveredItem ? 1 : 0
        }}
      />
      {renderLinks(links)}
    </div>
  );
};

export default Sidebar;
