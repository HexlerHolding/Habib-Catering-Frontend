import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: '/hero.png',
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Automatic slide transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to section on same page
   const scrollToSection = () => {
    const section = document.getElementById('category-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Redirect to event catering page
  const goToEventCatering = () => {
    navigate('/contact');
  };

  return (
    <div className="relative h-[50vh] md:h-[75vh] w-full overflow-hidden">
      {/* Slider */}
      <div
        className="h-full w-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="h-full w-full flex-shrink-0 relative flex items-center justify-center"
          >
            {/* Image with reduced opacity */}
            <img
              src={slide.image}
              alt={slide.title || 'Slide image'}
              className="w-full h-full object-cover opacity-80"
            />
            {/* Green overlay */}
            <div className="absolute inset-0 bg-[var(--color-green)] opacity-30"></div>
            {/* Text and buttons */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-2">
                Habib Catering
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-secondary)] mb-4">
                Food Ordering and Event Catering
              </p>
              <div className="flex space-x-2 sm:space-x-4">
                <button
                  onClick={scrollToSection}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-[var(--color-green)] cursor-pointer text-[var(--color-secondary)] font-semibold rounded-md hover:bg-[var(--color-green-dark)] transition-colors text-sm sm:text-base"
                >
                  Order Now
                </button>
                <button
                  onClick={goToEventCatering}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-[var(--color-green)]  cursor-pointer text-[var(--color-secondary)] font-semibold rounded-md hover:bg-[var(--color-green-dark)] transition-colors text-sm sm:text-base"
                >
                  Event Catering
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;