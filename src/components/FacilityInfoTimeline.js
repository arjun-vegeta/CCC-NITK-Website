import React from "react";
import { Timeline } from "../components/ui/timeline";
import { motion } from "framer-motion";

export function TimelineDemo() {
  const facilities = [
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

  const data = facilities.map((facility) => ({
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
          src={facility.image || "/images_mdx/placeholder.png"}
          alt={facility.name}
          className="w-full h-[220px] object-cover"
          onError={(e) => {
            e.target.src = "/images_mdx/placeholder.png";
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
