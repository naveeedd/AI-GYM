import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProteinShop: React.FC = () => {
  const products = [
    {
      name: 'Whey Protein Isolate',
      description: 'High-quality protein powder for muscle recovery and growth.',
      price: 49.99,
      image: 'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'BCAA Supplements',
      description: 'Essential amino acids to support muscle recovery and reduce fatigue.',
      price: 29.99,
      image: 'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Pre-Workout Energy',
      description: 'Boost your energy levels and enhance your workout performance.',
      price: 39.99,
      image: 'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Protein Shop</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our range of high-quality protein supplements to support your fitness journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{product.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-gray-900 font-bold text-xl mb-4">${product.price}</p>
              <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProteinShop;