import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      <h1 className="text-6xl font-extrabold mb-6 text-center">
        Welcome to the Computer Center
      </h1>
      <p className="text-2xl mb-8 text-center max-w-2xl">
        Empowering our university with cutting-edge IT services and innovative learning experiences.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/howto"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          How To
        </Link>
        <Link
          to="/facilities"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Facilities
        </Link>
        <Link
          to="/policies"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          Policies
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  // return <Layout>{<Home />}</Layout>;
  return (
    <Home />
  )
    
}
