// src/App.tsx
import React, { useState } from 'react';
import Header from './components/Header';
import  ProductCard,  { Product } from './components/ProductCard';
import Cart, { CartItem } from './components/Cart'; 
import './index.css';


// DO NOT EXPOSE YOUR ALATPAY_API_KEY AND ALATPAY_BUSINESS_ID DIRECTLY IN CLIENT-SIDE CODE IN PRODUCTION!
// This is for demonstration purposes ONLY.
// In a real application, these API calls MUST be proxied through a secure backend server
// where your API keys are stored securely and never exposed to the client.
const ALATPAY_BASE_URL = "https://apibox.alatpay.ng";
const ALATPAY_API_KEY = "6aa94307985046b9bf2f59c5e284bed8"; // Sample Key - Replace with your actual Test Key
const ALATPAY_BUSINESS_ID = "4302a35f-8eef-46ab-fc5e-08ddb945d09a"; // Sample Business ID - Replace with your actual Test Business ID


// Define the structure for the ALATPay response for virtual account generation
interface AlatPayVirtualAccountResponse {
  status: boolean;
  message: string;
  data?: {
    virtualBankAccountNumber: string;
    bankName: string;
    beneficiaryName: string;
    amount: number;
    transactionId: string; // This is the transactionId to check status
    expiredAt: string; // ISO string
    // Other fields might be present based on actual API response
  };
}

// Define the structure for the ALATPay transaction status response
interface AlatPayTransactionStatusResponse {
  status: boolean;
  message: string;
  data?: {
    transactionId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED'; // Example statuses
    amount: number;
    currency: string;
    // Other fields might be present
  };
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<AlatPayVirtualAccountResponse['data'] | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null); // To display status in modal

  const initialProducts: Product[] = [
    {
      id: 1,
      name: 'Potato Chips',
      description: 'Crispy, thinly sliced potatoes, seasoned to perfection.',
      price: 500.00,
      image: 'https://placehold.co/150x150/FFC107/000000?text=Chips',
    },
    {
      id: 2,
      name: 'Chocolate Bar',
      description: 'A rich and creamy milk chocolate bar, a classic treat.',
      price: 350.00,
      image: 'https://placehold.co/150x150/8B4513/FFFFFF?text=Chocolate',
    },
    {
      id: 3,
      name: 'Gummy Bears',
      description: 'Chewy, fruit-flavored gummy candies in various colors.',
      price: 200.00,
      image: 'https://placehold.co/150x150/FF69B4/FFFFFF?text=Gummy',
    },
    {
      id: 4,
      name: 'Soda Drink',
      description: 'A refreshing carbonated soft drink, perfect for any occasion.',
      price: 400.00,
      image: 'https://placehold.co/150x150/4682B4/FFFFFF?text=Soda',
    },

    {
      id: 6,
      name: 'Fruit Snacks',
      description: 'Assorted fruit-flavored chewy snacks made with real fruit juice.',
      price: 300.00,
      image: 'https://placehold.co/150x150/90EE90/000000?text=Fruit',
    },
  ];

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc: CartItem[], item) => {
        if (item.id === id) {
          if (item.quantity === 1) {
            return acc;
          } else {
            return [...acc, { ...item, quantity: item.quantity - 1 }];
          }
        } else {
          return [...acc, item];
        }
      }, [])
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    setPaymentDetails(null);
    setShowPaymentModal(false);
    setTransactionStatus(null);
  };

  const generateOrderId = (): string => {
    // Generate a unique order ID for each transaction
    return `ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPaymentDetails(null);
    setTransactionStatus(null); // Reset status when initiating new checkout

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = generateOrderId();
    const customerEmail = "customer@example.com"; // Replace with actual customer email/input
    const customerPhone = "+2348012345678"; // Replace with actual customer phone/input
    const customerFirstName = "Test";
    const customerLastName = "Customer";

    const payload = {
      businessId: ALATPAY_BUSINESS_ID,
      amount: totalAmount,
      currency: "NGN",
      orderId: orderId,
      description: `Snacks Order #${orderId}`,
      customer: {
        email: customerEmail,
        phone: customerPhone,
        firstName: customerFirstName,
        lastName: customerLastName,
        metadata: "Snacks Store Checkout",
      },
    };

    try {
      const response = await fetch(`${ALATPAY_BASE_URL}/bank-transfer/api/v1/bankTransfer/virtualAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         'Ocp-Apim-Subscription-Key': ALATPAY_API_KEY, // which is actually your ALATPay API Key
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate virtual account.');
      }

      const data: AlatPayVirtualAccountResponse = await response.json();

      if (data.status && data.data) {
        setPaymentDetails(data.data);
        setShowPaymentModal(true);
        setCartItems([]); // Clear cart after successful payment initiation
      } else {
        throw new Error(data.message || 'Failed to get virtual account details from response.');
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during checkout.');
      console.error("Checkout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTransactionStatus = async () => {
    if (!paymentDetails || !paymentDetails.transactionId) {
      setError("No transaction ID available to check status.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactionStatus(null); // Clear previous status

    try {
      const response = await fetch(`${ALATPAY_BASE_URL}/bank-transfer/api/v1/bankTransfer/transactions/${paymentDetails.transactionId}`, {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': ALATPAY_API_KEY, // which is actually your ALATPay API Key
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch transaction status.');
      }

      const data: AlatPayTransactionStatusResponse = await response.json();

      if (data.status && data.data) {
        setTransactionStatus(data.data.status);
      } else {
        setTransactionStatus('Unknown (API response issue)');
        throw new Error(data.message || 'Failed to get transaction status from response.');
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while checking status.');
      console.error("Status check error:", err);
      setTransactionStatus('Error checking status');
    } finally {
      setIsLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentDetails(null);
    setTransactionStatus(null); // Clear status when modal closes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter text-gray-900">
      {/* Tailwind CSS and Inter font are assumed to be set up as per previous steps */}
      {/* If running as a standalone immersive, you would include the CDN and style tags here */}

      <Header cartItemCount={cartItems.reduce((count, item) => count + item.quantity, 0)} />

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-300 pb-2">Our Delicious Snacks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <aside>
          <Cart
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </aside>
      </main>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-lg font-semibold text-gray-800">Processing request...</p>
          </div>
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.196l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 9.5l-2.651-2.651a1.2 1.2 0 0 1 1.697-1.697L10 7.803l2.651-2.652a1.2 1.2 0 0 1 1.697 1.697L11.696 9.5l2.652 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && paymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100">
            <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">Complete Your Payment</h3>
            <p className="text-gray-700 mb-4 text-center">
              Please make a bank transfer to the details below to complete your order.
            </p>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
                <span className="font-semibold text-gray-700">Amount:</span>
                <span className="font-bold text-green-700 text-xl">₦{paymentDetails.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <span className="font-semibold text-gray-700">Account Number:</span>
                <span className="font-bold text-blue-600">{paymentDetails.virtualBankAccountNumber}</span>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
                <span className="font-semibold text-gray-700">Bank Name:</span>
                <span className="font-bold text-gray-800">{paymentDetails.bankName|| "Wema Bank"}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <span className="font-semibold text-gray-700">Beneficiary:</span>
                <span className="font-bold text-gray-800">{paymentDetails.beneficiaryName || "Snacks Store"}</span>
              </div>
          
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md text-sm">
                <span className="font-semibold text-gray-700">Expires At:</span>
                <span className="font-medium text-red-500">{new Date(paymentDetails.expiredAt).toLocaleString()}</span>
              </div>
            </div>

            {transactionStatus && (
              <div className={`mt-4 p-3 rounded-md text-center font-bold
                ${transactionStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                  transactionStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}`}>
                Transaction Status: {transactionStatus}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4 text-center">
              Please complete the transfer within the expiry time.
            </p>
            <div className="mt-8 flex flex-col space-y-3">
             {/*  <button
                onClick={checkTransactionStatus}
                className="bg-purple-600 text-white px-6 py-3 rounded-full w-full hover:bg-purple-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Checking Status...' : 'Check Payment Status'}
              </button> */}
              <button
                onClick={closePaymentModal}
                className="bg-blue-600 text-white px-6 py-3 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
