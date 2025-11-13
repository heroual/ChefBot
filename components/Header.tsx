import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-background-dark/80 backdrop-blur-sm border-b border-white/10 z-10">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-vibrant-orange font-aref-ruqaa-ink" style={{textShadow: '0 0 10px rgba(255, 122, 0, 0.4)'}}>
          <span role="img" aria-label="plate" className="mx-2">🍽️</span>
          شنو ناكل؟
        </h1>
      </div>
    </header>
  );
};

export default Header;