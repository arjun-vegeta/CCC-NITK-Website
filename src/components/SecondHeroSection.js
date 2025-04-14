import React, { useEffect, useRef, useState } from "react";

const SecondHeroSection = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const windowHeight = window.innerHeight;
      const sectionCenter = sectionTop + (rect.height / 2);
      const screenCenter = windowHeight / 2;
      
      // Only start animation when section's center passes screen center
      if (sectionCenter <= screenCenter) {
        // Calculate progress based on how far past center we've scrolled
        // Map from [screenCenter, screenCenter - 300px] to [0, 1]
        const animationDistance = 300; // pixels to complete animation
        const progress = Math.max(0, Math.min(1, 
          (screenCenter - sectionCenter) / animationDistance
        ));
        
        setScrollProgress(progress);
      } else {
        // Before center, keep at 0 progress
        setScrollProgress(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card data with updated heights as requested
  const cards = [
    {
      id: 1,
      title: "10000+ Hostels",
      description: "Description texts here",
      imgHeight: 290,
      imgSrc: "/images/hostel.png", // Replace with your actual image
      getTransform: (progress) => ({
        transform: `translateY(${progress * (400 - 290)}px)`
      })
    },
    {
      id: 2,
      title: "Heading Text 2",
      description: "Description texts here",
      imgHeight: 340,
      imgSrc: "/images/library.png",
      getTransform: (progress) => ({
        transform: `translateY(${progress * (400 - 340)}px)`
      })
    },
    {
      id: 3,
      title: "Heading Text 3",
      description: "Description texts here",
      imgHeight: 400,
      imgSrc: "/images/canteen.png",
      getTransform: () => ({
        transform: `translateY(0px)`
      })
    },
    {
      id: 4,
      title: "Heading Text 4",
      description: "Description texts here",
      imgHeight: 320,
      imgSrc: "/images/gym.png",
      getTransform: (progress) => ({
        transform: `translateY(${progress * (400 - 320)}px)`
      })
    }
  ];
  

  return (
    <section 
      ref={sectionRef}
      className="max-w-[1280px] mx-auto pt-24 pb-10 px-4 relative font-Montserrat"
    >
      {/* Heading and subheading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D1C44] mb-6">
          Providing Internet Access to Thousands Across Campus
        </h2>
        <p className="text-gray-600">
        CCC maintains the campus network backbone connectivity and internet connections on 24x7 basis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative pb-8">
        {cards.map((card) => (
          <div 
            key={card.id}
            className="flex flex-col transition-transform duration-500 ease-out"
            style={card.getTransform(scrollProgress)}
          >
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default SecondHeroSection;