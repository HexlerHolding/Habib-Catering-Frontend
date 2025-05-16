import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaArrowRight } from 'react-icons/fa';
import { getBlogBySlug, getAllBlogs } from '../data/blogData';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = () => {
      setLoading(true);
      window.scrollTo(0, 0);
      
      // Get the blog from our centralized data
      const blogPost = getBlogBySlug(slug);
      setBlog(blogPost);
      
      // Get related posts (based on category or other criteria)
      if (blogPost) {
        const allBlogs = getAllBlogs();
        const related = allBlogs
          .filter(post => post.id !== blogPost.id)
          .filter(post => post.category === blogPost.category)
          .slice(0, 3);
        setRelatedPosts(related);
      }
      
      setLoading(false);
    };
    
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-32 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-40 bg-primary/20 rounded-lg mb-6"></div>
          <div className="h-6 w-96 bg-primary/20 rounded-lg mb-4"></div>
          <div className="h-6 w-80 bg-primary/20 rounded-lg mb-12"></div>
          <div className="h-64 w-full max-w-4xl bg-primary/20 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-32 text-center">
        <h2 className="text-3xl font-bold mb-4 text-text font-montserrat">Blog post not found</h2>
        <p className="text-text/70 mb-8 text-lg">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/blogs" className="inline-block bg-primary text-text px-8 py-3 rounded-lg hover:bg-primary/80 font-medium transition-colors shadow-md">
          Browse All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20 mt-9">
      {/* Navigation Link */}
      <div className="container mx-auto px-4 sm:px-6 pt-6">
        <Link to="/blogs" className="inline-flex items-center text-accent hover:text-accent/70 font-medium bg-background py-2 px-4 rounded-lg shadow-md transition-colors border-b-2 border-accent mb-2">
          <FaArrowLeft className="mr-2" />
          All Articles
        </Link>
      </div>
      
      {/* Hero Section */}
      <div className="w-full h-[50vh] md:h-[60vh] relative mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-text-secondary/30 to-text-secondary/70 z-10"></div>
        <img 
          src={blog.image || blog.altImage} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container  mx-auto px-4 sm:px-6 pb-10 sm:pb-12 md:pb-16 ">
            <div className="max-w-4xl">
              {blog.category && (
                <div className="inline-block bg-accent text-secondary px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base font-medium shadow-md">
                  {blog.category}
                </div>
              )}
              <h1 className="text-secondary text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 font-montserrat leading-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center text-secondary/90 gap-x-4 sm:gap-x-6 text-xs sm:text-sm">
                <div className="flex items-center mb-2">
                  <FaUser className="mr-2" />
                  <span className="font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{blog.date}</span>
                </div>
                {blog.readTime && (
                  <div className="flex items-center mb-2">
                    <FaClock className="mr-2" />
                    <span>{blog.readTime} min read</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 md:-mt-16 relative z-30">
        <div className="max-w-3xl mx-auto">
          {/* Blog content */}
          <article className="bg-background rounded-xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 mb-16">
            <div className="text-text">
              {blog.content && blog.content.map((item, index) => {
                if (item.type === 'heading') {
                  return (
                    <h3 key={index} className="text-xl sm:text-2xl font-bold mt-6 sm:mt-10 mb-3 sm:mb-4 text-text font-montserrat">
                      {item.text}
                    </h3>
                  );
                } else {
                  return (
                    <p key={index} className="my-4 sm:my-6 leading-relaxed text-text/90">
                      {item.text}
                    </p>
                  );
                }
              })}
            </div>
          </article>
          
          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center mb-16 bg-background p-4 sm:p-6 rounded-xl shadow-md">
              <span className="mr-4 font-medium text-text">Topics:</span>
              {blog.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-primary/10 text-text rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-sm mr-3 mb-2 hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6 sm:mb-8 text-text font-montserrat border-l-4 border-primary pl-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="bg-background rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Link to={`/blogs/${post.slug}`} className="block relative">
                      <img 
                        src={post.image || post.altImage} 
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-text/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <div className="p-5">
                      <Link to={`/blogs/${post.slug}`}>
                        <h4 className="font-bold text-lg mb-2 text-text hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <div className="flex items-center text-xs text-text/60 mb-2">
                        <FaCalendarAlt className="mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <p className="text-text/70 line-clamp-2 text-sm mb-3">{post.excerpt}</p>
                      <Link 
                        to={`/blogs/${post.slug}`}
                        className="text-sm text-accent hover:text-accent/80 font-medium inline-flex items-center group"
                      >
                        Read more
                        <FaArrowRight className="ml-1 text-xs transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;