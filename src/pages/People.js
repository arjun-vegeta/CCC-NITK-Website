import React, { useState, useEffect } from "react";
import { useDarkMode } from "../utils/DarkModeContext";
import peopleData from "../data/people.json";

const PeopleCCC = () => {
  const { darkMode } = useDarkMode();
  const [staff, setStaff] = useState(peopleData.staff);
  const [team, setTeam] = useState(peopleData.team);

  useEffect(() => {
    // Fetch latest people data from API
    fetch(`${process.env.REACT_APP_API_URL}/api/people`)
      .then(res => res.json())
      .then(data => {
        setStaff(data.staff);
        setTeam(data.team);
      })
      .catch(err => {
        console.error('Failed to fetch people data:', err);
        // Fallback to imported data
      });
  }, []);

  return (
    <div className={`px-8 md:px-8 lg:px-20 font-Montserrat ${darkMode ? 'text-gray-100' : 'text-[#192F59]'} dark-transition`}>
      {/* People Section */}
      <div className="mt-10 mb-16">
        <h2 className="font-extrabold underline text-2xl md:text-3xl">People</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {staff.map((person, index) => (
            <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-xl  bg-white dark:bg-gray-800 dark-transition flex gap-4 items-center">
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
        <h2 className="font-extrabold underline text-2xl md:text-3xl">Website Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {team.map((member, index) => (
            <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-gray-800 dark-transition flex gap-4 items-center">
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
