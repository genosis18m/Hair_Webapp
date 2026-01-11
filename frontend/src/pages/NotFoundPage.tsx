import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="text-center animate-fadeIn">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              404
            </div>
            <FaExclamationTriangle className="absolute -top-4 -right-4 text-4xl text-yellow-500 animate-bounce" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base">
          Oops! The page you're looking for doesn't exist or has been moved to a new location.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg font-medium"
          >
            <FaHome />
            Go Home
          </Link>
          <Link
            to="/dashboard/analysis"
            className="inline-flex items-center gap-2 bg-white border-2 border-green-500 text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 transition-all duration-300 font-medium"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
