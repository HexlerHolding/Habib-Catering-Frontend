import React from 'react';

const Offer = () => {
  return (
    <div className="relative w-full overflow-hidden h-[31rem] flex bg-background" 
         style={{
           backgroundImage: 'url(offerSectionImage2.jpg)',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      
      <div className="relative z-10 flex items-center justify-between p-8 max-w-6xl mx-auto">
        {/* Left section with form */}
        <div className="w-full md:w-2/5 bg-background/80  p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-accent mb-2">Special Offers &amp; News</h2>
          <p className="text-text mb-6">
            Subscribe now for news, promotions and more delivered right to your inbox
          </p>
          
          <div className="w-full max-w-md">
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 border border-text/50 rounded-md "
              />
            </div>
            
            <button className="px-8 py-2 font-bold text-text uppercase bg-gradient-to-r from-primary/40 to-primary hover:brightness-105 rounded-md  transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
        
        {/* Right section with "Let's talk cheezy" */}
        <div className="hidden md:block w-1/2">
          <div className="flex items-center">
            <div className="mr-4">
              <h2 className="text-6xl font-extrabold text-primary leading-tight drop-shadow-lg">
                let's talk
                <br />
                <span className="text-8xl">CHEEZY</span>
              </h2>
            </div>
            
            {/* Megaphone Icon - simplified version */}
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="/offerSectionImage3.webp" alt="Megaphone" className="transform rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;