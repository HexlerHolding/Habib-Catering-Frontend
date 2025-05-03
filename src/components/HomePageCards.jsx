import React from 'react';

const HomePageCards = () => {
  // Simple cards data structure
  const cards = [
    {
      id: 1,
      image: '/cardImage1.png',
      title: 'Delivering cheezy khushiyan',
      fallbackImage: 'https://via.placeholder.com/400x300/FFD700/000000?text=Delivery'
    },
    {
      id: 2,
      image: '/cardImage2.png',
      title: 'Fastest Growing Brand of the Year',
      fallbackImage: 'https://via.placeholder.com/400x300/FFD700/000000?text=Award'
    },
    {
      id: 3,
      image: '/cardImage3.png',
      title: 'Made with fresh, local ingredients and love',
      fallbackImage: 'https://via.placeholder.com/400x300/FFD700/000000?text=Pizza'
    }
  ];

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.id} className="flex flex-col">
              {/* Just the image */}
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full rounded-xl"
           
              />
              
              {/* Simple heading below image */}
              <h4 className="mt-4 font-semibold text-text text-2xl text-start">
                {card.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageCards;