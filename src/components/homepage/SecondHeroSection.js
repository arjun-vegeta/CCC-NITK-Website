import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SecondHeroSection = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

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
    window.addEventListener("resize", handleResize);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
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
      title: "20+ Hostels",
      description: "",
      imgHeight: 340,
      imgSrc: "/stats/hostel.png"
    },
    {
      id: 3,
      title: "300+ Staff Quarters",
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

  // Get the tallest card height dynamically
  const maxCardHeight = Math.max(...cards.map(card => card.imgHeight));

  // Function to get scroll-based offset for each card based on current dimensions
  const getOffset = (originalHeight) => {
    // On small screens, all cards should have the same height (no offset)
    if (windowWidth < 1024) return 0;
    
    // Calculate dynamic height based on screen width
    const currentMaxHeight = windowWidth >= 1280 ? maxCardHeight : (maxCardHeight * windowWidth / 1280);
    
    // Scale the current card's height proportionally
    const currentCardHeight = originalHeight * (currentMaxHeight / maxCardHeight);
    
    // No offset for the tallest card
    if (originalHeight === maxCardHeight) return 0;
    
    // Calculate offset proportionally to the difference between this card and tallest card
    return scrollProgress * (currentMaxHeight - currentCardHeight);
  };

  // Determine if we should use square aspect ratio
  // Square for screens between 640px and 1023px
  const useSquareAspect = windowWidth >= 0 && windowWidth < 1024;

  return (
    <section
      ref={sectionRef}
      className="max-w-[1280px] mx-auto pt-24 pb-10 px-4 sm:px-6 relative font-Montserrat"
    >
      {/* Heading */}
      <motion.div
        className="text-center mb-10 md:mb-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0D1C44] dark:text-white mb-4 md:mb-6">
          Providing Internet Access to Thousands Across Campus
        </h2>
        <p className="text-gray-600 dark:text-blue-300 text-sm md:text-base">
          CCC maintains the campus network backbone connectivity and internet
          connections on 24x7 basis
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 relative pb-8">
        {cards.map((card, index) => {
          const yOffset = getOffset(card.imgHeight);
          
          // Calculate aspect ratio based on original desktop dimensions
          // Original width was 276px at 1280px screen
          const aspectRatio = card.imgHeight / 276;

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
                <div className="relative w-full overflow-hidden">
                  {/* Use different aspect ratios based on screen size */}
                  <div 
                    className={`w-full relative bg-[#1e2c50] rounded-2xl ${windowWidth < 640 ? 'aspect-square' : ''}`}
                    style={{ 
                      // Square aspect for sm-lg screens, original aspect for xs and xl+
                      paddingBottom: useSquareAspect ? '100%' : `${(aspectRatio * 100)}%`,
                      display: 'block',
                      minHeight: '0',
                    }}
                  >
                    <img
                      src={card.imgSrc}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl"
                    />
                  </div>
                </div>
                <h3 className="font-bold text-[#0D1C44] dark:text-blue-200 text-lg sm:text-lg mt-3 mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
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