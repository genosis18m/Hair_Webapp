import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FaCamera, FaArrowRight, FaStar } from 'react-icons/fa';
import { prof } from '../assets/index';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/dashboard/analysis');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 dark:bg-gray-950 flex items-center relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaStar className="text-yellow-400" />
              AI-Powered Hair Analysis
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Perfect Hair </span>
              Care Routine
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
              Upload a photo and let our AI analyze your hair type, condition, and get personalized product recommendations in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 text-lg"
              >
                <FaCamera />
                Start Free Analysis
                <FaArrowRight />
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-green-500 hover:text-green-400 transition-all duration-300 text-lg"
              >
                View Pricing
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-gray-500 text-sm">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-gray-500 text-sm">Analyses Done</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-gray-500 text-sm">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Right side - Image/Visual */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl transform scale-110"></div>
              
              {/* Image container */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <img
                  src={prof}
                  alt="Hair Analysis"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
                
                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl animate-bounce-gentle">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCamera className="text-white text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">Scan Hair</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <FaStar className="text-white text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">Get Results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;