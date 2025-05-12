import React from 'react';
import { ArrowRight, CheckCircle, Award, MapPin, Calculator, ShoppingBag } from 'lucide-react';
import BMRCalculator from '../../components/home/BMRCalculator';
import GymPlans from '../../components/home/GymPlans';
import ProteinShop from '../../components/home/ProteinShop';
import GymLocations from '../../components/home/GymLocations';
import TestimonialSlider from '../../components/home/TestimonialSlider';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center flex items-center" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1600)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Build Your <span className="text-red-500">Perfect Body</span> <br /> With Us
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Transform your physique and achieve your fitness goals with the best gym equipment, expert trainers, and customized workout plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <a href="#plans" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-300 flex items-center justify-center">
              View Plans <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="#calculator" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center justify-center">
              BMR Calculator
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose FlexFit?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We provide top-notch facilities and services to help you reach your fitness goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-red-500 mb-4">
                <Award className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Trainers</h3>
              <p className="text-gray-600">
                Our certified trainers develop personalized workout plans to help you achieve your goals efficiently.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-red-500 mb-4">
                <Calculator className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customized Plans</h3>
              <p className="text-gray-600">
                Get a customized workout and diet plan based on your BMR and fitness goals.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-red-500 mb-4">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Supplements</h3>
              <p className="text-gray-600">
                Access high-quality protein supplements to maximize your workout results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-16 bg-gray-50">
        <GymPlans />
      </section>

      {/* BMR Calculator Section */}
      <section id="calculator" className="py-16 bg-white">
        <BMRCalculator />
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Members Say</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Don't take our word for it. Hear from our satisfied members.
            </p>
          </div>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* Protein Shop Section */}
      <section id="shop" className="py-16 bg-white">
        <ProteinShop />
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-16 bg-gray-50">
        <GymLocations />
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Body?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join FlexFit today and start your fitness journey with the best gym in town.
          </p>
          <a 
            href="/register" 
            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium inline-block transition-colors duration-300"
          >
            Join Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;