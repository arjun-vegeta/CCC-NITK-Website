import React from "react";
import { useDarkMode } from "../utils/DarkModeContext";

const staff = [
  {
    name: "Dr. Mohit P Tahiliani",
    position: "Professor In-charge (Central Computer Center)",
    image: "Mohit.jpg", 
  },
  {
    name: "Smt. Rekha S Devadiga",
    position: "Junior Assistant",
    image: "Rekha.jpg",
  },
  {
    name: "Sri Gurudatha Shenoy",
    position: "Technical Assistant",
    image: "Gurudatha.jpg",
  },
  {
    name: "Sri M. N. Shantha Kumar",
    position: "Technical Officer",
    image: "ShanthaKumar.jpg",
  },
  {
    name: "Sri P. G. Mohanan",
    position: "Systems Manager",
    image: "PGMohanan.jpg",
  },
  {
    name: "Sri Rangappa Goudar",
    position: "Assistant Engineer (SG II)",
    image: "Rangappa.jpg",
  },
  {
    name: "Sri S. Ashok Kumar Shettigar",
    position: "Junior Assistant",
    image: "ashok.jpg",
  },
  {
    name: "Sri Subhas",
    position: "Technician",
    image: "Subhas.jpg",
  },
  {
    name: "Sri Suguna Kumar B.",
    position: "Assistant Engineer (SG II)",
    image: "Suguna.jpg",
  },
  {
    name: "Sri Vairavanathan C",
    position: "Technical Officer",
    image: "Vairavanthan.jpg",
  },
  {
    name: "Sri Vijay Kumar Ghode",
    position: "Senior Scientific Officer",
    image: "Vijaykumar.jpg",
  },
];

const AboutCCC = () => {
  const { darkMode } = useDarkMode();

  return (
    <>
      

      <div className={`px-4 md:px-8 lg:px-16 font-Montserrat ${darkMode ? 'text-gray-100' : 'text-[#192F59]'} dark-transition`}>
        {/* <div className="mt-10">
          <h2 className="font-extrabold underline text-2xl md:text-3xl">Central Computer Center</h2>
          <p className="mt-4 text-sm md:text-base dark:text-gray-300">
            CCC is currently headed by <strong>Dr. Mohit P Tahiliani</strong> from the Department of CSE. CCC has the following permanent staff:
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm md:text-base space-y-1 dark:text-gray-300">
            <li>One Systems Manager</li>
            <li>One Senior Scientific Officer</li>
            <li>Two Technical Officers</li>
            <li>Two Assistant Engineers (SG-II)</li>
            <li>One Technical Assistant</li>
            <li>One Junior Assistant</li>
            <li>One Technician</li>
            <li>One Office Clerk</li>
            <li>Two Helpers</li>
            <li>One Sweeper</li>
          </ul>
        </div> */}

        <div className="mt-10 mb-16">
          <h2 className="font-extrabold underline text-2xl md:text-3xl">People</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {staff.map((person, index) => (
              <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 dark-transition flex gap-4 items-center">
                <img
                  src={`/People/${person.image}`}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <div>
                  <h3 className="text-lg font-semibold dark:text-gray-100">{person.name}</h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">{person.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutCCC;
