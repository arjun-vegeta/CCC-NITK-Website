import React from "react";

const GuideSection = () => {
  // Data for the info boxes with image paths
  const infoBoxes = [
    {
      heading: "Eduroam",
      description: "Guide to connecting to eduroam WiFi at NITK",
      width: "w-full",
      image: "/HomeGuide/image1.jpg" // Replace with actual image filename
    },
    {
      heading: "NITK Net",
      description: "NITK Net Captive Portal Configuration",
      width: "w-full",
      image: "/HomeGuide/image2.jpg" // Replace with actual image filename
    },
    {
      heading: "Troubleshooting",
      description: "Step-by-step guide for troubleshooting network",
      width: "w-full",
      image: "/HomeGuide/image3.jpg" // Replace with actual image filename
    },
    {
      heading: "NITK VPN",
      description: "Read Guide",
      width: "w-full",
      image: "/HomeGuide/image4.jpg" // Replace with actual image filename
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
          Some Long Description Line Goes Right Here, Keep It Long Itself For Design Sake
        </p>
      </div>

      {/* Grid of info boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-16">
        {infoBoxes.map((box, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${index === 0 || index === 3 ? "md:col-span-1" : "md:col-span-1"}`}
          >
            {/* Box with image background and content at bottom left */}
            <div 
              className="rounded-3xl aspect-square mb-3 p-4 flex flex-col justify-end relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(30, 44, 80, 0.3), rgba(30, 44, 80, 0.9)), url(${box.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Text content */}
              <div>
                <h3 className="font-bold text-white text-lg mb-1">
                  {box.heading}
                </h3>
                <p className="text-gray-200 text-sm">
                  {box.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuideSection;