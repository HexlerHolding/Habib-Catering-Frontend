import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const CategoryItem = ({ image, title, link }) => {

  
  return (
    <Link to={link} className="block">
      <div className={`rounded-lg overflow-hidden border-2 border-primary/60 hover:shadow-lg transition-shadow`}>
        <div className="relative pb-[75%]">
          <img 
            src={image} 
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className={`font-semibold text-lg uppercase `}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const CategorySlider = () => {

  const [swiperRef, setSwiperRef] = useState(null);
  
  const categories = [
    { id: 1, image: '/menu1.jpg', title: 'PASTAS', link: '/menu/pastas' },
    { id: 2, image: '/menu2.jpg', title: 'BURGERZ', link: '/menu/burgers' },
    { id: 3, image: '/menu3.jpg', title: 'SIDE ORDERS', link: '/menu/sides' },
    { id: 4, image: '/menu1.jpg', title: 'ADDONS', link: '/menu/addons' },
    { id: 5, image: '/menu2.jpg', title: 'DRINKS', link: '/menu/drinks' },
    { id: 6, image: '/menu3.jpg', title: 'DESSERTS', link: '/menu/desserts' },
  ];
  
  return (
    <section className="py-12 px-4 relative">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold text-text`}>
            Explore Menu
          </h2>
          <Link 
            to="/menu"
            className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
         
          >
            VIEW ALL
        
          </Link>
        </div>
        
        <div className="relative category-slider-container">
          {/* Custom navigation buttons */}
          <button 
            className="absolute z-10 left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background rounded-full w-10 h-10 shadow-md flex items-center justify-center category-prev-button"
            aria-label="Scroll left"
          >
            <FaArrowLeft className="text-text/80" />
          </button>
          
          {/* Category items with Swiper */}
          <Swiper
            modules={[Navigation]}
            onSwiper={setSwiperRef}
            slidesPerView={1}
            spaceBetween={24}
            navigation={{
              prevEl: '.category-prev-button',
              nextEl: '.category-next-button',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              }
            }}
            className="category-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className="py-2">
                <CategoryItem
                  image={category.image}
                  title={category.title}
                  link={category.link}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Right custom navigation button */}
          <button 
            className="absolute z-10 right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background rounded-full w-10 h-10 shadow-md flex items-center justify-center category-next-button"
            aria-label="Scroll right"
          >
            <FaArrowRight className="text-text/80" />
          </button>
        </div>
      </div>
      
      {/* Custom styles for Swiper */}
      <style jsx>{`
        .category-swiper {
          padding: 10px 5px;
        }
        .category-slider-container {
          padding: 0 20px;
        }
      `}</style>
    </section>
  );
};

export default CategorySlider;