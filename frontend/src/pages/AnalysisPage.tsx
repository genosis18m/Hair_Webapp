import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { FaCamera, FaChartLine, FaHistory, FaCoins, FaArrowRight, FaStar, FaCheck } from 'react-icons/fa';
import { prof, tube1, tube2, tube4, tube5 } from '../assets/index';
import { userApi, analysisApi } from '../services/api';
import styles from '../styles/AnalysisPageStyles';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [analysisCount, setAnalysisCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        // First try to get user data
        const userResult = await userApi.getUser(user.id);
        setCredits(userResult.user?.credits ?? 50);
        
        // Get history
        try {
          const historyResult = await analysisApi.getHistory(user.id, 100);
          setAnalysisCount(historyResult.analyses?.length ?? 0);
        } catch {
          setAnalysisCount(0);
        }
      } catch (err: any) {
        // If user not found (404), sync/create them
        if (err.response?.status === 404) {
          try {
            const syncResult = await userApi.syncUser({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              name: user.fullName || user.firstName || undefined,
              imageUrl: user.imageUrl || undefined,
            });
            setCredits(syncResult.user?.credits ?? 50);
            setAnalysisCount(0);
          } catch (syncErr) {
            console.error('Error syncing user:', syncErr);
            setCredits(50);
          }
        } else {
          console.error('Error fetching user:', err);
          setCredits(50);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  const handleButtonClick = () => {
    navigate('/dashboard/photo');
  };

  const features = [
    { icon: FaCheck, text: 'AI-powered hair analysis' },
    { icon: FaCheck, text: 'Personalized product recommendations' },
    { icon: FaCheck, text: 'Track your hair health over time' },
    { icon: FaCheck, text: 'Expert-level insights instantly' },
  ];

  return (
    <div className={styles.container}>
      {/* Colorful background circles */}
      <div className={styles.backgroundCircles}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>

      {/* Test tubes */}
      <img src={tube1} alt="Test tube 1" className={styles.tube1} />
      <img src={tube2} alt="Test tube 2" className={styles.tube2} />
      <img src={tube4} alt="Test tube 3" className={styles.tube3} />
      <img src={tube5} alt="Test tube 4" className={styles.tube4} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-100 dark:border-green-900 text-center">
            <FaCoins className="text-3xl text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {loading ? '...' : credits}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Credits Left</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-100 dark:border-green-900 text-center">
            <FaHistory className="text-3xl text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {loading ? '...' : analysisCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Analyses Done</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-100 dark:border-green-900 text-center col-span-2 md:col-span-1">
            <FaStar className="text-3xl text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">20</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Credits per Scan</div>
          </div>
        </div>

        {/* Scientist image */}
        <img src={prof} alt="Scientist" className={styles.scientistImage} />

        {/* Welcome text */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
          Welcome to Hair Analysis
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
          Get AI-powered insights about your hair health and personalized product recommendations.
        </p>

        {/* Features list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 w-full max-w-md">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <feature.icon className="text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleButtonClick}
            className={styles.startButton}
            disabled={credits !== null && credits < 20}
          >
            <FaCamera className="mr-2" />
            Start Analysis
            <FaArrowRight className="ml-2" />
          </button>
          <button
            onClick={() => navigate('/dashboard/history')}
            className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-2 border-green-500 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 flex items-center justify-center"
          >
            <FaChartLine className="mr-2" />
            View History
          </button>
        </div>

        {/* Credit warning */}
        {!loading && credits !== null && credits < 20 && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center max-w-md">
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              ⚠️ You have less than 20 credits. You need at least 20 credits to perform an analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
