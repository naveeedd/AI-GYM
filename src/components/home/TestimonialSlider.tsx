import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSlider: React.FC = () => {
  const testimonials = [
    {
      name: 'John Smith',
      role: 'Member for 2 years',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      text: "FlexFit has transformed my fitness journey. The trainers are amazing and the facilities are top-notch. I've never felt better!"
    },
    {
      name: 'Sarah Johnson',
      role: 'Member for 1 year',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      text: 'The personalized training programs and supportive community at FlexFit have helped me achieve goals I never thought possible.'
    },
    {
      name: 'Mike Wilson',
      role: 'Member for 3 years',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      text: 'Best gym I\'ve ever been to. The equipment is always well-maintained and the staff goes above and beyond to help members succeed.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                </div>
                <p className="text-gray-300 text-lg mb-6 italic">
                  "{testimonial.text}"
                </p>
                <h4 className="text-white font-bold text-xl">{testimonial.name}</h4>
                <p className="text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-red-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;