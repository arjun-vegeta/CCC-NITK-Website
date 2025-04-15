import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SecondHeroSection = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const windowHeight = window.innerHeight;
      const sectionCenter = sectionTop + rect.height / 2;
      const screenCenter = windowHeight / 2;

      if (sectionCenter <= screenCenter) {
        const animationDistance = 300;
        const progress = Math.max(
          0,
          Math.min(1, (screenCenter - sectionCenter) / animationDistance)
        );
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cards = [
    {
      id: 1,
      title: "6000+ Students and Staff",
      description: "",
      imgHeight: 290,
      imgSrc: "/stats/user.png"
    },
    {
      id: 2,
      title: "22+ Hostels",
      description: "",
      imgHeight: 340,
      imgSrc: "/stats/hostel.png"
    },
    {
      id: 3,
      title: "200+ Staff Quarters",
      description: "",
      imgHeight: 400,
      imgSrc: "/stats/dept.png"
    },
    {
      id: 4,
      title: "1000+ Access Points",
      description: "",
      imgHeight: 320,
      imgSrc: "/stats/wifi.png"
    }
  ];

  // Function to get scroll-based offset for each card
  const getOffset = (height) => {
    if (height === 400) return 0;
    return scrollProgress * (400 - height);
  };

  return (
    <section
      ref={sectionRef}
      className="max-w-[1280px] mx-auto pt-24 pb-10 px-4 relative font-Montserrat"
    >
      {/* Heading */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D1C44] mb-6">
          Providing Internet Access to Thousands Across Campus
        </h2>
        <p className="text-gray-600">
          CCC maintains the campus network backbone connectivity and internet
          connections on 24x7 basis
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative pb-8">
        {cards.map((card, index) => {
          const yOffset = getOffset(card.imgHeight);

          return (
            <motion.div
              key={card.id}
              className="flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div style={{ y: yOffset }}>
                <img
                  src={card.imgSrc}
                  alt={card.title}
                  className="w-full rounded-2xl bg-[#1e2c50] mb-3"
                  style={{ height: `${card.imgHeight}px` }}
                />
                <h3 className="font-bold text-[#0D1C44] text-lg mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {card.description}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default SecondHeroSection;
