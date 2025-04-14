import React from "react";

const GuideSection = () => {
  // Data for the info boxes
  const infoBoxes = [
    {
      heading: "10000+ Hostels",
      description: "Description texts here",
      width: "w-full"
    },
    {
      heading: "Heading Text",
      description: "Description texts here",
      width: "w-full"
    },
    {
      heading: "Heading Text",
      description: "Description texts here",
      width: "w-full"
    },
    {
      heading: "Heading Text",
      description: "Description texts here",
      width: "w-full"
    }
  ];

  return (
    <section className="max-w-[1280px] mx-auto py-16 px-4">
      {/* Heading and subheading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D1C44] mb-2">
        Learn More About Guides
        </h2>
        <p className="text-gray-600">
        Some Long Description Line Goes Right Here, Keep It Long Itself For Design Sake        </p>
      </div>

      {/* Grid of info boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {infoBoxes.map((box, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${index === 0 || index === 3 ? "md:col-span-1" : "md:col-span-1"}`}
          >
            {/* Blue box image placeholder */}
            <div className="bg-[#1e2c50] rounded-lg aspect-square mb-3"></div>
            
            {/* Text content */}
            <h3 className="font-bold text-[#0D1C44] text-lg mb-1">
              {box.heading}
            </h3>
            <p className="text-gray-600 text-sm">
              {box.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuideSection;