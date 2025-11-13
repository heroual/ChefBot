
import React from 'react';
import logo from '../logo.png'; // Adjust the path as necessary

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md z-10">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-orange-600 dark:text-orange-400 flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2" /> {/* Adjust size and margin as needed */}
          <span role="img" aria-label="plate" className="mx-2">🍽️</span>
          شنو ناكل؟
        </h1>
      </div>
    </header>
  );
};

export default Header;
