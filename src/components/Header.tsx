// src/components/Header.tsx
import React from 'react';

// Define the props interface for the Header component
interface HeaderProps {
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount }) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold font-inter">Snacks Store</h1>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 cursor-pointer text-gray-200 hover:text-white transition duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-lg">
              {cartItemCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;