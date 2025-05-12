import React, { useState } from 'react';

const BMRCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmr, setBmr] = useState<number | null>(null);

  const calculateBMR = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
      alert('Please enter valid numbers for weight, height, and age.');
      return;
    }

    let calculatedBMR;
    if (gender === 'male') {
      calculatedBMR = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      calculatedBMR = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    setBmr(Math.round(calculatedBMR));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">BMR Calculator</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate your Basal Metabolic Rate (BMR) to understand your daily calorie needs.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your weight"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your height"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your age"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button
            onClick={calculateBMR}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            Calculate BMR
          </button>
        </div>

        {bmr !== null && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-gray-900">Your BMR</h3>
            <p className="text-3xl font-bold text-red-600">{bmr} calories/day</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMRCalculator;