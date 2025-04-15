import React, { useState } from "react";

const facilities = [
  { id: 1, name: "Facility 1", image: "/images_mdx/placeholder.png" },
  { id: 2, name: "Facility 2", image: "/images_mdx/placeholder.png" },
  { id: 3, name: "Facility 3", image: "/images_mdx/placeholder.png" },
  { id: 4, name: "Facility 4", image: "/images_mdx/placeholder.png" },
];

const FacilityInfo = () => {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [isImageError, setIsImageError] = useState(false); // Track image load error state

  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
    setIsImageError(false); // Reset error when changing facility
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] px-6 py-12 bg-white">
      <h2 className="text-4xl font-semibold text-gray-800 mb-0">
        Some of our <br />
        <span>Facilities</span>
      </h2>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 flex flex-col justify-around">
          {facilities.map((facility, index, array) => (
            <div className="flex items-center justify-start gap-x-3 mb-0" key={facility.id}>
              <div
                className={`relative ${index === array.length - 1
                  ? ""
                  : "after:absolute after:top-14 after:-bottom-16 after:start-0 after:w-[3px] after:translate-x-[26px] after:bg-[#172F59]"
                  }`}
              >
                <div className="relative z-10 size-19 flex justify-center items-center">
                  <div className="size-14 rounded-full bg-[#172F59]"></div>
                </div>
              </div>

              <div>
                <h3
                  className="flex gap-x-1.5 text-2xl cursor-pointer font-semibold text-[#172F59]"
                  onClick={() => handleFacilityClick(facility)}
                >
                  {facility.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Right Content */}
        <div className="w-2/3 flex justify-end items-start relative">
          <div className="bg-white shadow-lg rounded-t-xl overflow-hidden border border-gray-300 w-full">
            {/* Browser Tab */}
            <div className="absolute w-[20%] flex justify-center -top-9 left-2 bg-[#172F59] px-4 py-1 rounded-t-md shadow font-medium text-white ml-2 text-xl">
              {selectedFacility.name}
            </div>

            {/* Facility Image or Placeholder */}
            <div className="w-full bg-[#192F59] h-[calc(100vh-150px)] flex items-center justify-center">
              {!isImageError ? (
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={() => setIsImageError(true)} // Set image error state to true on error
                />
              ) : (
                <div className="text-white text-3xl font-semibold text-center">
                  {selectedFacility.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityInfo;
