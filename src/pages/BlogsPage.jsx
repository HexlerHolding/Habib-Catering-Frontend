import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { getAllBlogs } from '../data/blogData';

const BlogsPage = () => {
  const blogPosts = getAllBlogs();

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-text">Our Blog</h1>
        <p className="text-center text-text max-w-3xl mx-auto mb-12">
          Discover the latest news, tips, and stories from Cheezious
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-background rounded-lg shadow-md overflow-hidden">
              <Link to={`/blogs/${post.slug}`}>
                <img 
                  src={post.image || post.altImage} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-5">
                <div className="flex items-center text-sm text-text/70 mb-3">
                  <div className="flex items-center mr-4">
                    <FaUser className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                <Link to={`/blogs/${post.slug}`}>
                  <h2 className="text-xl font-semibold mb-3 hover:text-accent/60 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                
                <Link 
                  to={`/blogs/${post.slug}`}
                  className="inline-flex items-center text-accent hover:text-accent/60"
                >
                  Read more
                  <FaArrowRight className="ml-2 text-sm" />
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
