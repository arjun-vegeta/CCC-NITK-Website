import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/">Computer Center</Link>
        </div>
        <div className="space-x-6">
          <Link to="/howto" className="text-gray-600 hover:text-primary transition">
            How To
          </Link>
          <Link to="/facilities" className="text-gray-600 hover:text-secondary transition">
            Facilities
          </Link>
          <Link to="/policies" className="text-gray-600 hover:text-tertiary transition">
            Policies
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
