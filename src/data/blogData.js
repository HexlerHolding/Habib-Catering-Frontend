const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Effortless Food Ordering with Habib Catering",
    image: "/blog1.jpg",
    altImage: "https://via.placeholder.com/800x400/FFD700/8B4513?text=Effortless+Food+Ordering",
    author: "Syed Arslan",
    date: "May 1, 2025",
    excerpt: "Discover how to make your next meal a breeze with these simple food ordering tips from Habib Catering.",
    slug: "effortless-food-ordering-tips",
    content: [
      {
        type: "paragraph",
        text: "Ordering food should be easy and enjoyable! At Habib Catering, we want to make sure your experience is smooth from start to finish. Here are our top 5 tips for effortless food ordering."
      },
      {
        type: "heading",
        text: "1. Plan Ahead"
      },
      {
        type: "paragraph",
        text: "Check our menu online and decide what you want before you order. This saves time and helps you avoid last-minute indecision."
      },
      {
        type: "heading",
        text: "2. Use Our App or Website"
      },
      {
        type: "paragraph",
        text: "Ordering through our app or website is quick and secure. You can customize your order, save your favorite dishes, and track your delivery in real time."
      },
      {
        type: "heading",
        text: "3. Double-Check Your Order"
      },
      {
        type: "paragraph",
        text: "Before you hit submit, review your cart to make sure you’ve got everything you need. Don’t forget to add drinks or desserts!"
      },
      {
        type: "heading",
        text: "4. Take Advantage of Deals"
      },
      {
        type: "paragraph",
        text: "Look out for special offers and discounts on our homepage. You might find a great deal on your favorite meal."
      },
      {
        type: "heading",
        text: "5. Share Your Experience"
      },
      {
        type: "paragraph",
        text: "We love hearing from you! Tag us on social media with your Habib Catering order and let us know how we did."
      }
    ]
  },
  {
    id: 2,
    title: "Why Catering is the Secret Ingredient to a Successful Event",
    image: "/blog2.jpg",
    altImage: "https://via.placeholder.com/800x400/FFD700/FF0000?text=Event+Catering",
    author: "Syed Arslan",
    date: "April 20, 2025",
    excerpt: "From weddings to office parties, discover how professional catering can elevate any occasion.",
    slug: "catering-secret-successful-event",
    content: [
      {
        type: "paragraph",
        text: "Planning an event? The food you serve can make or break the experience. Here’s why choosing Habib Catering is the best decision for your next gathering."
      },
      {
        type: "heading",
        text: "Stress-Free Planning"
      },
      {
        type: "paragraph",
        text: "Our team handles everything from menu selection to setup and cleanup, so you can focus on your guests."
      },
      {
        type: "heading",
        text: "Custom Menus for Every Occasion"
      },
      {
        type: "paragraph",
        text: "Whether it’s a formal dinner or a casual get-together, we offer a variety of menu options to suit your needs and preferences."
      },
      {
        type: "heading",
        text: "Professional Presentation"
      },
      {
        type: "paragraph",
        text: "Our staff ensures every dish looks as good as it tastes, leaving a lasting impression on your guests."
      },
      {
        type: "heading",
        text: "Delicious, Reliable Food"
      },
      {
        type: "paragraph",
        text: "With Habib Catering, you can count on fresh, flavorful food delivered on time, every time."
      },
      {
        type: "paragraph",
        text: "Let us help you create an event to remember! Contact us today to discuss your catering needs."
      }
    ]
  },
  {
    id: 3,
    title: "How to Choose the Perfect Menu for Your Next Party",
    image: "/blog3.jpg",
    altImage: "https://via.placeholder.com/800x400/FFD700/000000?text=Menu+Planning",
    author: "Syed Arslan",
    date: "March 30, 2025",
    excerpt: "Not sure what to serve at your next event? Here’s a simple guide to picking the right menu with Habib Catering.",
    slug: "choose-perfect-menu-party",
    content: [
      {
        type: "paragraph",
        text: "Choosing the right menu is key to a successful party. Here’s how Habib Catering can help you make the best choice."
      },
      {
        type: "heading",
        text: "Consider Your Guests"
      },
      {
        type: "paragraph",
        text: "Think about your guests’ preferences and dietary needs. We offer vegetarian, vegan, and gluten-free options to accommodate everyone."
      },
      {
        type: "heading",
        text: "Mix and Match Dishes"
      },
      {
        type: "paragraph",
        text: "A variety of appetizers, main courses, and desserts keeps things interesting and ensures there’s something for everyone."
      },
      {
        type: "heading",
        text: "Don’t Forget the Drinks"
      },
      {
        type: "paragraph",
        text: "Pair your menu with a selection of beverages, from fresh juices to classic sodas."
      },
      {
        type: "heading",
        text: "Ask for Recommendations"
      },
      {
        type: "paragraph",
        text: "Our catering experts are happy to suggest crowd-pleasing combinations based on your event type and size."
      },
      {
        type: "paragraph",
        text: "Ready to plan your party? Explore our menu online or contact us for personalized advice!"
      }
    ]
  }
];

// Function to get all blog posts
export const getAllBlogs = () => blogPosts;

// Function to get a blog by slug
export const getBlogBySlug = (slug) => {
  return blogPosts.find(blog => blog.slug === slug) || null;
};

export default blogPosts;
