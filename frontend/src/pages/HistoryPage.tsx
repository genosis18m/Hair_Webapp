import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { analysisApi } from '../services/api';
import { FaHistory, FaChartBar, FaCalendar, FaImage } from 'react-icons/fa';

interface Analysis {
  id: string;
  topResult: string;
  confidence: number;
  createdAt: string;
  imageUrl: string | null;
  predictions: Array<{ className: string; probability: number }>;
}

const HistoryPage: React.FC = () => {
  const { user } = useUser();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const result = await analysisApi.getHistory(user.id, 20);
        setAnalyses(result.analyses || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('No analysis history yet. Take a photo to get started!');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaHistory className="text-3xl text-green-600" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Analysis History
          </h1>
        </div>

        {error || analyses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No analyses yet</h2>
            <p className="text-gray-400">Take a photo to start analyzing your hair!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis, index) => (
              <div
                key={analysis.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-slideIn overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Thumbnail */}
                  <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                    {analysis.imageUrl ? (
                      <img
                        src={analysis.imageUrl}
                        alt="Analysis"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedAnalysis(analysis)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaImage className="text-4xl" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendar className="text-green-500 text-sm" />
                      <span className="text-sm text-gray-500">
                        {formatDate(analysis.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {analysis.topResult}
                    </h3>
                    
                    {/* Confidence Bar */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${analysis.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {Math.round(analysis.confidence * 100)}% confidence
                      </span>
                    </div>

                    {/* Predictions breakdown */}
                    {analysis.predictions && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {analysis.predictions.slice(0, 6).map((pred, idx) => (
                          <div key={idx} className="text-xs bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-gray-700">{pred.className}</span>
                            <span className="text-green-600 ml-1 font-medium">
                              {Math.round(pred.probability * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedAnalysis && (
          <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAnalysis(null)}
          >
            <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden animate-fadeIn">
              {selectedAnalysis.imageUrl && (
                <img
                  src={selectedAnalysis.imageUrl}
                  alt="Analysis"
                  className="w-full max-h-96 object-contain bg-gray-100"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedAnalysis.topResult}
                </h3>
                <p className="text-gray-500 mb-4">
                  Analyzed on {formatDate(selectedAnalysis.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">
                    {Math.round(selectedAnalysis.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
