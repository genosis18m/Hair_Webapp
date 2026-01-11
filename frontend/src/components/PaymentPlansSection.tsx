import React, { useState } from 'react';
import { FaCheckCircle, FaCrown, FaStar, FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const PaymentPlansSection: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Starter',
      price: 0,
      credits: 50,
      description: "Perfect for trying out AI hair analysis. Get started for free!",
      features: [
        "50 free analysis credits",
        "Basic hair type detection",
        "Product recommendations",
        "Analysis history (7 days)"
      ],
      icon: FaStar,
      buttonText: 'Get Started Free',
      popular: false,
      isFree: true,
    },
    {
      name: 'Pro',
      price: 9.99,
      credits: 200,
      description: "Most popular for regular users who want consistent hair care insights.",
      features: [
        "200 analysis credits/month",
        "Advanced hair health scoring",
        "Personalized treatment plans",
        "Unlimited analysis history",
        "Priority support"
      ],
      icon: FaCrown,
      buttonText: 'Upgrade to Pro',
      popular: true,
      isFree: false,
    },
    {
      name: 'Unlimited',
      price: 19.99,
      credits: 'Unlimited',
      description: "For professionals and hair care enthusiasts who need unlimited access.",
      features: [
        "Unlimited analyses",
        "Professional-grade insights",
        "Export reports as PDF",
        "API access",
        "24/7 dedicated support",
        "Early access to new features"
      ],
      icon: FaRocket,
      buttonText: 'Go Unlimited',
      popular: false,
      isFree: false,
    },
  ];

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.isFree) {
      // Free plan - just navigate to dashboard
      if (isSignedIn) {
        navigate('/dashboard/analysis');
      } else {
        navigate('/signup');
      }
    } else {
      // Paid plans - show coming soon modal
      setSelectedPlan(plan.name);
      setShowComingSoon(true);
    }
  };

  return (
    <section id="pricing" className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
            Choose Your Perfect Plan
          </h3>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Start with our free tier and upgrade anytime. All plans include AI-powered hair analysis 
            and personalized product recommendations.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div 
                key={plan.name} 
                className={`relative rounded-2xl shadow-xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : 'border border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full px-4 py-1 shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                  plan.popular ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="text-2xl" />
                </div>

                <h4 className="font-bold text-2xl text-gray-800 mb-2">{plan.name}</h4>
                <p className="text-gray-500 text-sm mb-6 h-12">{plan.description}</p>
                
                {/* Price */}
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <p className="text-5xl font-bold text-gray-800">Free</p>
                  ) : (
                    <p className="text-5xl font-bold text-gray-800">
                      ${plan.price}
                      <span className="text-lg text-gray-500 font-normal">/month</span>
                    </p>
                  )}
                  <p className="text-green-600 font-medium mt-1">
                    {typeof plan.credits === 'number' ? `${plan.credits} credits` : plan.credits}
                  </p>
                </div>

                {/* Features */}
                <ul className="text-left text-gray-600 mb-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            🔒 Secure payments powered by Stripe • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowComingSoon(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedPlan} Plan Coming Soon!
            </h3>
            <p className="text-gray-500 mb-6">
              We're working hard to bring you the {selectedPlan} plan. 
              In the meantime, enjoy our free tier with 50 credits!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowComingSoon(false);
                  if (isSignedIn) {
                    navigate('/dashboard/analysis');
                  } else {
                    navigate('/signup');
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors"
              >
                Try Free Plan Instead
              </button>
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentPlansSection;