import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useDarkMode } from "../utils/DarkModeContext";

const Sidebar = ({ links }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
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
      <ul className={`space-y-1.5 ${depth > 0 ? "ml-4 pl-2 border-l border-gray-300 dark:border-gray-700" : ""}`}>
        {items.map((item) => (
          <li key={item.slug} className="relative">
            <div
              ref={el => itemsRef.current[item.slug] = el}
              data-href={item.href}
              className={`flex justify-between items-center cursor-pointer py-2 px-2 group transition-all duration-200 rounded-lg ${
                location.pathname === item.href 
                  ? "bg-gray-200/80 dark:bg-gray-800" 
                  : ""
              } ${
                hoveredItem === item.slug ? "translate-x-2" : ""
              }`}
              onClick={() => {
                if (item.children) {
                  toggleExpand(item.slug);
                } else if (item.href) {
                  navigate(item.href);
                }
              }}
              onMouseEnter={() => handleItemHover(item.slug)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span
                className={`block text-[15.5px] transition-all duration-150 ${
                  location.pathname === item.href 
                    ? hoveredItem === item.slug 
                      ? "text-gray-800 dark:text-gray-100 font-medium" 
                      : "text-black dark:text-white font-medium"
                    : hoveredItem === item.slug
                      ? "text-gray-900 dark:text-gray-100 font-normal"
                      : "text-gray-600 dark:text-gray-300 font-normal"
                }`}
              >
                {item.title}
              </span>
              {item.children && (
                <ChevronDown
                  className={`transition-all duration-200 ${
                    expanded[item.slug] ? "rotate-180" : ""
                  } text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300`}
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
    <div className="h-full p-6 pr-4 bg-[#f5f5f5] dark:bg-[#0b0c10] relative sidebar-container dark-transition sticky top-[93px]">
      {/* Animated indicator */}
      <div
        className="absolute transition-all duration-200"
        style={{
          left: '24px',
          top: `${linePosition.top}px`,
          height: `${linePosition.height}px`,
          width: '3.5px',
          background: darkMode ? '#f3f4f6' : '#000000',
          clipPath: 'polygon(0 4px, 100% 6px, 100% calc(100% - 8px), 0 calc(100% - 6px))',
          borderRadius: '3px',
          opacity: hoveredItem ? 1 : 0,
          transform: 'translateX(0)',
          zIndex: 10
        }}
      />
      <div className={`pl-0 transition-opacity duration-300 ${!links || links.length === 0 ? '' : 'opacity-100'} ${typeof window !== 'undefined' && window.innerWidth > 800 && !document.querySelector('.w-0') ? 'opacity-100' : ''}`}
        style={{
          opacity: (typeof window !== 'undefined' && window.innerWidth > 800 && document.querySelector('.w-0')) ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        {renderLinks(links)}
      </div>
    </div>
  );
};

export default Sidebar;
