// src/components/Cart.tsx
import React from 'react';
import  { Product } from './ProductCard'; // Import Product interface

// Define the CartItem interface (extends Product with quantity)
export interface CartItem extends Product {
  quantity: number;
}

// Define the props interface for the Cart component
interface CartProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onRemoveFromCart, onClearCart, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center py-4">Your cart is empty. Add some snacks!</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">₦{item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t-2 border-gray-300 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-extrabold text-green-700">₦{total.toFixed(2)}</span>
          </div>
          <div className="mt-6 flex flex-col space-y-3">
            <button
              onClick={onCheckout}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 font-semibold"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={onClearCart}
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 font-semibold"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;