import React from "react";
import { useDarkMode } from "../utils/DarkModeContext";

const staff = [
  {
    name: "Mohit P. Tahiliani",
    position: "Professor In-charge",
    image: "Mohit.jpg",
  },
  {
    name: "P. G. Mohanan",
    position: "Systems Manager",
    image: "PGMohanan.jpg",
  },
  {
    name: "Vijay Kumar Ghode",
    position: "Senior Scientific Officer",
    image: "Vijaykumar.jpg",
  },
  {
    name: "C. Vairavanathan ",
    position: "Technical Officer",
    image: "Vairavanthan.jpg",
  },
  {
    name: "M. N. Shanthakumar",
    position: "Technical Officer",
    image: "ShanthaKumar.jpg",
  },
  {
    name: "Suguna Kumar B.",
    position: "Assistant Engineer (SG II)",
    image: "Suguna.jpg",
  },
  {
    name: "Rangappa B. Goudar",
    position: "Assistant Engineer (SG II)",
    image: "Rangappa.jpg",
  },
  {
    name: "Gurudatha Shenoy",
    position: "Technical Assistant",
    image: "Gurudatha.jpg",
  },
  {
    name: "Ashok Kumar Shettigar",
    position: "Senior Assistant",
    image: "ashok.jpg",
  },
  {
    name: "Subhas",
    position: "Technician",
    image: "Subhas.jpg",
  },
  {
    name: "Rekha S. Devadiga",
    position: "Junior Assistant",
    image: "Rekha.jpg",
  },
];

const team = [
  {
    name: "Arjun R",
    role: "Designer and Developer",
    passingYear: "2026",
    image: "Arjun.jpg",
  },
  {
    name: "Hari Hardhik",
    role: "Developer",
    passingYear: "2026",
    image: "Hardhik.jpg",
  },
  {
    name: "K. Naveen",
    role: "Developer",
    passingYear: "2026",
    image: "Naveen.jpg",
  },
  {
    name: "Mohit P. Tahiliani",
    role: "Faculty Guide",
    designation: "Professor In-charge, CCC",
    image: "Mohit.jpg",
  },
];

const PeopleCCC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`px-8 md:px-8 lg:px-20 font-Montserrat ${darkMode ? 'text-gray-100' : 'text-[#192F59]'} dark-transition`}>
      {/* People Section */}
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

      {/* Meet the Team Section */}
      <div className="mt-10 mb-16">
        <h2 className="font-extrabold underline text-2xl md:text-3xl">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {team.map((member, index) => (
            <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 dark-transition flex gap-4 items-center">
              <img
                src={`/People/${member.image}`}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <div>
                <h3 className="text-lg font-semibold dark:text-gray-100">{member.name}</h3>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">{member.role}</p>
                {member.passingYear ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.passingYear}</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.designation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeopleCCC;
