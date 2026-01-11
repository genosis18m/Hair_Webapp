import React from 'react';
import { FaCamera, FaRobot, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const steps = [
  {
    number: '01',
    icon: FaCamera,
    title: 'Take a Photo',
    description: 'Snap a clear photo of your hair or upload an existing image from your device.',
  },
  {
    number: '02',
    icon: FaRobot,
    title: 'AI Analysis',
    description: 'Our advanced AI analyzes your hair type, texture, condition, and health in seconds.',
  },
  {
    number: '03',
    icon: FaCheckCircle,
    title: 'Get Results',
    description: 'Receive personalized insights and product recommendations tailored to your hair.',
  },
];

const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  return (
    <section id="how-it-works" className="bg-gray-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-green-500 font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h3 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            3 Simple Steps to Better Hair
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Get started in less than a minute. No complicated setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line (hidden on mobile, last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-green-500/50 to-transparent" />
                )}
                
                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center border-2 border-green-500/30">
                      <Icon className="text-4xl text-green-500" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                  <p className="text-gray-400 max-w-xs mx-auto">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(isSignedIn ? '/dashboard/analysis' : '/signup')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
          >
            Start Analyzing Now
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
