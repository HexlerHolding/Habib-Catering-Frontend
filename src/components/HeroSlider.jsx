import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const slides = [
  {
    id: 1,
    image: '/slideImage1.png',
   
  },
  {
    id: 2,
    image: '/slideImage2.png', // Fixed: Use path instead of undefined variable
    
  },
  {
    id: 3,
    image: '/slideImage3.png', // Fixed: Use path instead of undefined variable
  
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Automatic slide transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Navigation handlers
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
      {/* Slider */}
      <div 
        className="h-full w-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className="h-full w-full flex-shrink-0 relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            
            />
       
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
        onClick={goToPrevSlide}
      >
        <FaChevronLeft />
      </button>
      
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
        onClick={goToNextSlide}
      >
        <FaChevronRight />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide ? 'w-6 bg-white' : 'w-3 bg-white bg-opacity-50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;