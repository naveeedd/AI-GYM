import React from 'react';
import { CheckCircle } from 'lucide-react';

const GymPlans: React.FC = () => {
  const plans = [
    {
      name: 'Basic Plan',
      price: 29.99,
      features: [
        'Access to gym equipment',
        'Basic fitness assessment',
        'Group classes',
        'Locker room access'
      ]
    },
    {
      name: 'Premium Plan',
      price: 49.99,
      features: [
        'Access to gym equipment',
        'Comprehensive fitness assessment',
        'Group classes',
        'Locker room access',
        'Personal trainer sessions',
        'Nutrition consultation'
      ]
    },
    {
      name: 'Elite Plan',
      price: 79.99,
      features: [
        'Access to gym equipment',
        'Comprehensive fitness assessment',
        'Group classes',
        'Locker room access',
        'Personal trainer sessions',
        'Nutrition consultation',
        'Access to premium facilities',
        'Priority booking for classes'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Gym Plans</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Choose a plan that fits your fitness goals and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
              <p className="text-gray-900 font-bold text-3xl mb-4">${plan.price}/month</p>
              <ul className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300">
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymPlans;