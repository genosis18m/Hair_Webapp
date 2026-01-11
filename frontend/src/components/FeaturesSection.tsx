import React from 'react';
import { FaCamera, FaBrain, FaHistory, FaShoppingCart, FaMagic, FaShieldAlt } from 'react-icons/fa';

const features = [
  {
    icon: FaCamera,
    title: 'Easy Photo Capture',
    description: 'Simply take a photo or upload an existing image for instant AI analysis.',
  },
  {
    icon: FaBrain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning identifies your hair type, condition, and needs.',
  },
  {
    icon: FaMagic,
    title: 'Personalized Recommendations',
    description: 'Get customized product suggestions based on your unique hair profile.',
  },
  {
    icon: FaHistory,
    title: 'Track Your Progress',
    description: 'Monitor your hair health over time with detailed analysis history.',
  },
  {
    icon: FaShoppingCart,
    title: 'Shop Directly',
    description: 'Find the best products from top retailers like Amazon, Alibaba & more.',
  },
  {
    icon: FaShieldAlt,
    title: 'Privacy First',
    description: 'Your photos and data are secure. We never share your personal information.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-gray-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">Features</span>
          <h3 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Everything You Need for Healthy Hair
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our AI-powered platform analyzes your hair and provides personalized insights 
            to help you achieve your best hair ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800 hover:border-green-500/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-2xl text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
