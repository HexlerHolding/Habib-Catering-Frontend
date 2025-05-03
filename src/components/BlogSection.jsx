import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import blogPosts from '../data/blogData';

const BlogSection = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-text">Blogs</h2>
          <Link to="/blogs" className="text-accent flex items-center">
            VIEW ALL
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="relative overflow-hidden rounded-lg shadow-md bg-background cursor-pointer h-[340px]">
              <Link to={`/blogs/${post.slug}`}>
                <div className="h-full relative">
                  <img 
                    src={post.image || post.altImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[rgba(60,40,0,0.8)] p-4">
                    <h3 className="text-secondary text-xl font-semibold mb-2">{post.title}</h3>
                    <Link to={`/blogs/${post.slug}`} className="text-secondary inline-flex items-center">
                      Learn more
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;