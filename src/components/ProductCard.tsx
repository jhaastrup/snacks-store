// src/components/ProductCard.tsx
import React from 'react';

// Define the Product interface
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

// Define the props interface for the ProductCard component
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition duration-300 ease-in-out border border-gray-200">
      <img
        src={product.image}
        alt={product.name}
        className="w-36 h-36 object-cover rounded-full mb-4 border-4 border-blue-200 shadow-md"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/150x150/E0F2F7/000000?text=${product.name.split(' ')[0]}`; }}
      />
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
      <p className="text-2xl font-extrabold text-green-600 mb-4">₦{product.price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;