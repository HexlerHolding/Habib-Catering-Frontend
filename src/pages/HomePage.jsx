import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import CategorySlider from '../components/CategorySlider';
import { FaArrowRight } from 'react-icons/fa';
import HomePageCards from '../components/HomePageCards';
import AppDownload from '../components/AppDownload';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import Offer from '../components/Offer';
// Removed OrderNowButton import since it's now in MainLayout

const HomePage = () => {
  return (
    <div className="relative">
      {/* Hero Slider */}
      <HeroSlider />
      
      <div className="mx-auto px-6 sm:px-40 xl:px-[15rem] py-8">
        {/* Category Slider - Replacing the previous Explore Menu section */}
        <CategorySlider />
        
        {/* Home Page Cards */}
        <HomePageCards />
        
        {/* App Download Component - Added here */}
        <div className="my-12">
          <AppDownload />
        </div>
        <div className="my-12">
          <BlogSection />
        </div>
      </div>
      
      {/* Offer Section */}
      <Offer />
    </div>
  );
};

export default HomePage;