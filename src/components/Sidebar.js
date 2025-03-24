import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ links }) => {
  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Contents</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.slug}>
            <Link to={link.href} className="text-gray-700 hover:text-primary transition">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;