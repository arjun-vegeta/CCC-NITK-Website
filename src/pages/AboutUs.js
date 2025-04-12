import React from "react";

const staff = [
  {
    name: "Dr. Mohit P Tahiliani",
    position: "Professor In-charge (Central Computer Center)",
  },
  {
    name: "Smt. Rekha S Devadiga",
    position: "Junior Assistant",
  },
  {
    name: "Sri Gurudatha Shenoy",
    position: "Technical Assistant",
  },
  {
    name: "Sri M. N. Shantha Kumar",
    position: "Technical Officer",
  },
  {
    name: "Sri P. G. Mohanan",
    position: "Systems Manager",
  },
  {
    name: "Sri Rangappa Goudar",
    position: "Assistant Engineer (SG II)",
  },
  {
    name: "Sri S. Ashok Kumar Shettigar",
    position: "Junior Assistant",
  },
  {
    name: "Sri Subhas",
    position: "Technician",
  },
  {
    name: "Sri Suguna Kumar B.",
    position: "Assistant Engineer (SG II)",
  },
  {
    name: "Sri Vairavanathan C",
    position: "Technical Officer",
  },
  {
    name: "Sri Vijay Kumar Ghode",
    position: "Senior Scientific Officer",
  },
];

const AboutCCC = () => {
  return (
    <>
      <header className="bg-[#eaeaea] w-full h-40 text-[#192F59] text-3xl font-Montserrat font-extrabold flex items-center justify-center text-center md:text-left md:px-10">
        <h1>ABOUT CCC</h1>
      </header>

      <div className="px-4 md:px-8 lg:px-16 font-Montserrat text-[#192F59]">
        <div className="mt-10">
          <h2 className="font-extrabold underline text-2xl md:text-3xl">Central Computer Center</h2>
          <p className="mt-4 text-sm md:text-base">
            CCC is currently headed by <strong>Dr. Mohit P Tahiliani</strong> from the Department of CSE. CCC has the following permanent staff:
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm md:text-base space-y-1">
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
        </div>

        <div className="mt-10">
          <h2 className="font-extrabold underline text-2xl md:text-3xl">People</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {staff.map((person, index) => (
              <div key={index} className="border border-gray-300 p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold">{person.name}</h3>
                <p className="text-sm md:text-base text-gray-700">{person.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutCCC;
