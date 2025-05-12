import React from 'react';
import { MapPin } from 'lucide-react';

const GymLocations: React.FC = () => {
  const locations = [
    {
      name: 'Downtown Branch',
      address: '123 Main Street, Downtown',
      hours: 'Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-8PM',
      phone: '(555) 123-4567',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Westside Branch',
      address: '456 West Avenue, Westside',
      hours: 'Mon-Fri: 5AM-11PM, Sat-Sun: 6AM-9PM',
      phone: '(555) 234-5678',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Eastside Branch',
      address: '789 East Road, Eastside',
      hours: 'Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-8PM',
      phone: '(555) 345-6789',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Our Locations</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Find a FlexFit gym near you. We have multiple locations to serve you better.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {locations.map((location, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{location.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <MapPin className="h-6 w-6 text-red-500 mt-1" />
                <div className="ml-3">
                  <p className="text-gray-900 font-medium">{location.address}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Hours:</span> {location.hours}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {location.phone}
                </p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Get Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymLocations;