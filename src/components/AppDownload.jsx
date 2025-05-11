import { FaChevronRight } from 'react-icons/fa';

const AppDownload = () => {
  const avatars = [
    { id: 1, src: "/avatar2.jpg", alt: "User 1" },
    { id: 2, src: "/avatar1.jpg", alt: "User 2" },
    { id: 3, src: "/avatar3.jpg", alt: "User 3" },
    { id: 4, src: "/avatar4.jpg", alt: "User 4" },
    { id: 5, src: "/avatar1.jpg", alt: "User 5" },
    { id: 6, src: "/avatar2.jpg", alt: "User 6" },
  ];

  return (
    <div className="w-full py-10 px-8 rounded-3xl overflow-hidden relative">
      {/* Curved gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary z-0 overflow-hidden">
        {/* Top left curve effect - using a pseudo-element with border-radius */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/20 rounded-full opacity-30"></div>
        
        {/* Additional gradient overlays for depth */}
        <div className="absolute bottom-0 right-0 w-full h-3/4 bg-gradient-to-t from-primary/30 to-transparent opacity-50"></div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Left side with phone image */}
        <div className="md:w-1/3 mb-8 md:mb-0">
          <img 
            src="/appImage.png" 
            alt="Mobile App" 
            className="max-w-full"
          />
        </div>
        
        {/* Right side with content */}
        <div className="md:w-2/3 md:pl-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text">Download Our Mobile App</h2>
          <p className="text-lg mb-8 text-text">Elevate your experience by downloading our mobile app for Seamless ordering experience.</p>
          
          {/* User avatars */}
          <div className="flex items-center mb-8">
            <div className="flex -space-x-3">
              {avatars.map((avatar) => (
                <div 
                  key={avatar.id}
                  className="w-12 h-12 rounded-full border-2 border-background overflow-hidden"
                >
                  <img 
                    src={avatar.src}
                    alt={avatar.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full bg-background border-2 border-background flex items-center justify-center">
                <span className="text-accent">
                  <FaChevronRight className="h-6 w-6" />
                </span>
              </div>
            </div>
          </div>
          
          {/* App store buttons */}
          <div className="flex flex-col sm:flex-row items gap-4">
            <a 
              href="https://play.google.com/store" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img 
                src="/playStore.jpg" 
                alt="Get it on Google Play" 
                className="h-12 rounded-lg"
              />
            </a>
            <a 
              href="https://apps.apple.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img 
                src="/appStore.jpg" 
                alt="Download on the App Store" 
                className="h-12 rounded-lg"
              />
            </a>
          </div>
        </div>
      </div>
      
      {/* Pizza icon decoration */}
      <div className="absolute top-8 right-16 z-10">
        <div className="relative">
          {/* <div className="w-32 h-32 rounded-full bg-primary  flex items-center justify-center opacity-50 absolute"></div> */}
          <img 
            src="/offerSectionImage34.png" 
            alt="" 
            className="w-24 h-24 relative z-20"
          />
        {/* </div> */}
      </div>
      </div>
      

    </div>
  );
};

export default AppDownload;