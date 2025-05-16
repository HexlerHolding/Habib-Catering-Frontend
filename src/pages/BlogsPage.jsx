import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaUser, FaTag, FaArrowLeft } from 'react-icons/fa';
import { getAllBlogs } from '../data/blogData';
import { TITLE } from '../data/globalText';

const BlogsPage = () => {
  const blogPosts = getAllBlogs();
  const featuredPost = blogPosts[0]; // Using the first blog as featured post
  const regularPosts = blogPosts.slice(1);
  const navigate = useNavigate();

  // Always scroll to top when MenuPage mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen pt-14 sm:pt-16 pb-20 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Go Back Arrow */}
        <button
          className="flex items-center text-primary cursor-pointer hover:text-accent font-medium mb-4 px-2 py-1 rounded transition-colors"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-text font-montserrat leading-tight">
            Our Blog
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 sm:mb-8 rounded-full"></div>
          <p className="text-text/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Discover the latest news, tips, and delicious stories from the world of {TITLE}
          </p>
        </div>
        
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16 sm:mb-20 max-w-6xl mx-auto">
            <div className="bg-background rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row border border-primary/10">
              <div className="lg:w-1/2 relative overflow-hidden">
                <Link to={`/blogs/${featuredPost.slug}`}>
                  <img 
                    src={featuredPost.image || featuredPost.altImage} 
                    alt={featuredPost.title}
                    className="w-full h-64 sm:h-80 lg:h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </Link>
              </div>
              <div className="lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                  <span className="bg-primary/15 text-text rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium inline-flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Featured
                  </span>
                  {featuredPost.category && (
                    <span className="bg-accent/10 text-accent rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium inline-flex items-center">
                      <FaTag className="mr-2 text-xs" />
                      {featuredPost.category}
                    </span>
                  )}
                </div>
                
                <Link to={`/blogs/${featuredPost.slug}`} className="group">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-text group-hover:text-accent transition-colors font-montserrat leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>
                
                <div className="flex items-center text-xs sm:text-sm text-text/60 mb-4 sm:mb-5 border-b border-primary/10 pb-4 sm:pb-5">
                  <div className="flex items-center mr-4 sm:mr-6">
                    <FaUser className="mr-1 sm:mr-2 text-primary" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 sm:mr-2 text-primary" />
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
                
                <p className="text-text/80 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                
                <Link 
                  to={`/blogs/${featuredPost.slug}`}
                  className="inline-flex items-center text-accent hover:text-accent/80 font-medium group mt-auto"
                >
                  Read full article
                  <FaArrowRight className="ml-2 text-sm transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-text font-montserrat border-l-4 border-primary pl-4">Latest Articles</h2>
        
        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
          {regularPosts.map((post) => (
            <div key={post.id} className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-primary/5">
              <Link to={`/blogs/${post.slug}`} className="block overflow-hidden group">
                <div className="relative overflow-hidden h-48 sm:h-56">
                  <img 
                    src={post.image || post.altImage} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {post.category && (
                    <span className="absolute top-4 right-4 bg-accent text-secondary rounded-lg px-3 py-1 text-xs font-medium shadow-md">
                      {post.category}
                    </span>
                  )}
                </div>
              </Link>
              
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-text/60 mb-3 sm:mb-4">
                  <div className="flex items-center mr-4">
                    <FaUser className="mr-1 text-primary" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-primary" />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                <Link to={`/blogs/${post.slug}`} className="group">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text group-hover:text-accent transition-colors line-clamp-2 font-montserrat">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-text/70 mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base">{post.excerpt}</p>
                
                <Link 
                  to={`/blogs/${post.slug}`}
                  className="inline-flex items-center text-accent hover:text-accent/80 font-medium mt-auto group"
                >
                  Read article
                  <FaArrowRight className="ml-2 text-sm transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
