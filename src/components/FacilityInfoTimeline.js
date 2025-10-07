import React from "react";
import { Timeline } from "../components/ui/timeline";
import { motion } from "framer-motion";

export function TimelineDemo({ facilities = [] }) {
  // Use facilities from props, with fallback to default data if empty
  const defaultFacilities = [
    {
      id: 1,
      name: "Data Centre & Server Infrastructure",
      image: "/hero/dc.jpg",
    },
    {
      id: 2,
      name: "General Purpose Computing & Labs",
      image: "/images_mdx/Lab.png",
    },
    {
      id: 3,
      name: "Website Hosting & Management Service",
      image: "/hero/dc.png",
    },
    {
      id: 4,
      name: "Skill Development Centre",
      image: "/images_mdx/Lab.png",
    },
  ];

  const facilitiesData = facilities.length > 0 ? facilities : defaultFacilities;

  const data = facilitiesData.map((facility, index) => ({
    title: facility.name,
    content: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, margin: "-50px" }}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        <img
          src={facility.image}
          alt={facility.name}
          className="w-full h-[220px] object-cover"
          onError={(e) => {
            // Prevent infinite loop
            if (!e.target.dataset.errorHandled) {
              e.target.dataset.errorHandled = 'true';
              e.target.style.backgroundColor = '#e5e7eb';
              e.target.style.display = 'none';
            }
          }}
        />
      </motion.div>
    ),
  }));

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
