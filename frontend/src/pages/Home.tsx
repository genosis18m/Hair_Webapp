import React from 'react';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import CompaniesSection from '../components/CompaniesSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import PaymentPlansSection from '../components/PaymentPlansSection';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CompaniesSection />
      <HowItWorksSection />
      <PaymentPlansSection />
      <Footer />
    </div>
  );
};

export default Home;
