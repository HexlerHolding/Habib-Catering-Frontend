import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { getBlogBySlug } from '../data/blogData';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = () => {
      setLoading(true);
      
      // Get the blog from our centralized data
      const blogPost = getBlogBySlug(slug);
      setBlog(blogPost);
      
      setLoading(false);
    };
    
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-xl">Blog post not found</p>
        <Link to="/blogs" className="mt-4 inline-block bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/80">
          Return to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <img 
          src={blog.image || blog.altImage} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-secondary text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center text-secondary space-x-4">
              <div className="flex items-center">
                <FaUser className="mr-2" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{blog.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-md p-6 md:p-8">
          <Link to="/blogs" className="inline-flex items-center text-accent hover:text-accent/60 mb-6">
            <FaArrowLeft className="mr-2" />
            Back to all blogs
          </Link>
          
          <div 
            className="blog-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
        
        {/* Related Posts could go here */}
      </div>
    </div>
  );
};

export default BlogDetail;