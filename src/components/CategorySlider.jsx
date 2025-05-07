import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { menuService } from '../../Services/menuService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const CategoryItem = ({ image, title, id }) => {
  return (
    <Link to={`/menu?category=${id}`} className="block w-full">
      <div className="rounded-lg overflow-hidden border-2 border-primary/60 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-square w-full">
          <img 
            src={image} 
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.target.src = '/menu1.jpg';
            }}
          />
        </div>
        <div className="p-3 text-center flex-1 flex items-center justify-center min-h-[60px]">
          <h3 className="font-semibold text-lg uppercase line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const CategorySlider = () => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await menuService.getMenuCategories();
        
        // Filter out the "All" category if it exists
        const filteredCategories = fetchedCategories.filter(
          category => category.id !== 'all'
        );
        
        setCategories(filteredCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // Set fallback categories
        setCategories([
          { id: 'pizzas', name: 'PIZZAS', image: '/menu1.jpg' },
          { id: 'burgers', name: 'BURGERS', image: '/menu2.jpg' },
          { id: 'sides', name: 'SIDE ORDERS', image: '/menu3.jpg' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  return (
    <section className="py-12 px-4 relative">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            Explore Menu
          </h2>
          <Link 
            to="/menu"
            className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
          >
            VIEW ALL
          </Link>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text/70">Loading categories...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-accent/20 border border-accent/40 text-accent px-4 py-3 rounded relative mb-8 mx-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Categories carousel */}
        {!isLoading && categories.length > 0 && (
          <div className="relative category-slider-container">
            {/* Custom navigation buttons */}
            <button 
              className="absolute z-10 left-0 top-1/2 -translate-y-1/2 -translate-x-0 md:-translate-x-1/2 bg-background rounded-full w-10 h-10 shadow-md flex items-center justify-center category-prev-button"
              aria-label="Scroll left"
            >
              <FaArrowLeft className="text-text/80" />
            </button>
            
            {/* Category items with Swiper */}
            <Swiper
              modules={[Navigation]}
              onSwiper={setSwiperRef}
              slidesPerView={1}
              spaceBetween={20}
              navigation={{
                prevEl: '.category-prev-button',
                nextEl: '.category-next-button',
              }}
              breakpoints={{
                480: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 24,
                }
              }}
              className="category-swiper px-2"
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id} className="py-2 h-auto">
                  <CategoryItem
                    image={category.image || category.placeholderImage}
                    title={category.name}
                    id={category.id}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Right custom navigation button */}
            <button 
              className="absolute z-10 right-0 top-1/2 -translate-y-1/2 translate-x-0 md:translate-x-1/2 bg-background rounded-full w-10 h-10 shadow-md flex items-center justify-center category-next-button"
              aria-label="Scroll right"
            >
              <FaArrowRight className="text-text/80" />
            </button>
          </div>
        )}
      </div>
      
      {/* Custom styles for Swiper */}
      <style jsx>{`
        .category-swiper {
          padding: 10px 0;
        }
        .category-slider-container {
          padding: 0 15px;
        }
        .swiper-slide {
          height: auto;
          display: flex;
        }
      `}</style>
    </section>
  );
};

export default CategorySlider;