import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import styles from '../../styles/ImageUploaderStyles';
import UpgradeCard from '../UpgradeCard';
import { analysisApi, userApi } from '../../services/api';
import { useToast } from '../../components/Toast';

interface Prediction {
    className: string;
    probability: number;
}

interface ImageUploaderProps {
    imageSrc: string | null;
    setImageSrc: (src: string | null) => void;
    predictions: Prediction[] | null;
    classifyImage: (file: File) => Promise<void>;
    setIsCameraView: React.Dispatch<React.SetStateAction<boolean>>;
    isAnalyzing?: boolean;
}

// Product recommendations based on hair type
const getProductRecommendations = (hairType: string) => {
    const products: Record<string, Array<{ name: string; description: string; price: string; url: string }>> = {
        'Dry Hair': [
            { name: 'Argan Oil Treatment', description: 'Deep moisturizing oil for dry, damaged hair', price: '$24.99', url: 'https://www.amazon.com/s?k=argan+oil+hair+treatment' },
            { name: 'Hydrating Shampoo', description: 'Sulfate-free moisturizing shampoo', price: '$18.99', url: 'https://www.amazon.com/s?k=hydrating+shampoo+dry+hair' },
            { name: 'Leave-in Conditioner', description: 'Intensive moisture for all-day hydration', price: '$15.99', url: 'https://www.amazon.com/s?k=leave+in+conditioner+dry+hair' },
        ],
        'Oily Hair': [
            { name: 'Clarifying Shampoo', description: 'Deep cleanse to remove excess oil', price: '$16.99', url: 'https://www.amazon.com/s?k=clarifying+shampoo+oily+hair' },
            { name: 'Dry Shampoo', description: 'Absorbs oil between washes', price: '$12.99', url: 'https://www.amazon.com/s?k=dry+shampoo+oily+hair' },
            { name: 'Lightweight Conditioner', description: 'Conditions without adding weight', price: '$14.99', url: 'https://www.amazon.com/s?k=lightweight+conditioner' },
        ],
        'Damaged Hair': [
            { name: 'Protein Treatment', description: 'Rebuilds and strengthens damaged strands', price: '$29.99', url: 'https://www.amazon.com/s?k=protein+treatment+damaged+hair' },
            { name: 'Bond Repair Serum', description: 'Repairs broken hair bonds', price: '$35.99', url: 'https://www.amazon.com/s?k=olaplex+bond+repair' },
            { name: 'Heat Protectant', description: 'Prevents further heat damage', price: '$19.99', url: 'https://www.amazon.com/s?k=heat+protectant+spray' },
        ],
        'Curly Hair': [
            { name: 'Curl Defining Cream', description: 'Enhances and defines natural curls', price: '$22.99', url: 'https://www.amazon.com/s?k=curl+defining+cream' },
            { name: 'Anti-Frizz Serum', description: 'Controls frizz and adds shine', price: '$18.99', url: 'https://www.amazon.com/s?k=anti+frizz+serum+curly+hair' },
            { name: 'Deep Conditioning Mask', description: 'Weekly treatment for curly hair', price: '$26.99', url: 'https://www.amazon.com/s?k=deep+conditioner+curly+hair' },
        ],
        'default': [
            { name: 'Nourishing Shampoo', description: 'Gentle daily cleansing shampoo', price: '$16.99', url: 'https://www.amazon.com/s?k=nourishing+shampoo' },
            { name: 'Conditioning Treatment', description: 'Weekly deep conditioning', price: '$19.99', url: 'https://www.amazon.com/s?k=hair+conditioning+treatment' },
            { name: 'Hair Vitamin Gummies', description: 'Supports healthy hair growth', price: '$24.99', url: 'https://www.amazon.com/s?k=hair+vitamins+biotin' },
        ],
    };

    // Find matching category or return default
    for (const key of Object.keys(products)) {
        if (hairType.toLowerCase().includes(key.toLowerCase().split(' ')[0])) {
            return products[key];
        }
    }
    return products['default'];
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
    imageSrc,
    setImageSrc,
    predictions,
    classifyImage,
    setIsCameraView,
    isAnalyzing = false,
}) => {
    const { user } = useUser();
    const { showToast } = useToast();
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [analysisSaved, setAnalysisSaved] = useState(false);

    // Fetch credits from backend
    useEffect(() => {
        const fetchCredits = async () => {
            if (!user) return;
            try {
                const result = await userApi.getUser(user.id);
                setCredits(result.user?.credits ?? 0);
            } catch (err) {
                // User might not exist yet, will be created on first analysis
                setCredits(50);
            }
        };
        fetchCredits();
    }, [user]);

    // Save analysis when predictions arrive and show with delay
    useEffect(() => {
        if (predictions && predictions.length > 0 && imageSrc && !analysisSaved && user) {
            setLoading(true);
            setShowResults(false);
            
            // Add delay for legitimacy (5 seconds)
            const timer = setTimeout(async () => {
                try {
                    // Save to database
                    const result = await analysisApi.saveAnalysis({
                        clerkId: user.id,
                        imageUrl: imageSrc,
                        predictions,
                    });
                    
                    setCredits(result.remainingCredits);
                    setAnalysisSaved(true);
                    setShowResults(true);
                    showToast('Analysis complete! 20 credits used.', 'success');
                } catch (err: any) {
                    console.error('Error saving analysis:', err);
                    if (err.response?.status === 403) {
                        showToast('Insufficient credits!', 'error');
                    } else {
                        showToast('Analysis complete!', 'success');
                        setShowResults(true);
                    }
                } finally {
                    setLoading(false);
                }
            }, 5000); // 5 second delay for legitimacy

            return () => clearTimeout(timer);
        }
    }, [predictions, imageSrc, analysisSaved, user, showToast]);

    const handleFileChange = async (file: File) => {
        if (credits < 1) {
            showToast('No credits remaining!', 'error');
            return;
        }

        setAnalysisSaved(false);
        setShowResults(false);
        
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            classifyImage(file);
        };
        reader.readAsDataURL(file);
    };

    const handleInputClick = () => {
        document.getElementById('fileInput')?.click();
    };

    const handleCameraClick = () => {
        if (credits < 1) {
            showToast('No credits remaining!', 'error');
            return;
        }
        setAnalysisSaved(false);
        setShowResults(false);
        setIsCameraView(true);
    };

    const topPrediction = predictions?.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
    );

    const recommendedProducts = topPrediction ? getProductRecommendations(topPrediction.className) : [];

    return (
        <div className={styles.container}>
            {credits < 1 && !showResults ? (
                <UpgradeCard />
            ) : (
                <>
                    {/* Image Display */}
                    {imageSrc ? (
                        <img src={imageSrc} alt='Captured' className={styles.image} />
                    ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p>No photo yet</p>
                            </div>
                        </div>
                    )}

                    <h2 className={styles.title}>Take a Photo</h2>
                    <p className={styles.description}>We'll use this to analyze and return predictions from the AI model</p>
                    
                    {/* Credits Display */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-2xl">💰</span>
                        <span className={styles.credits}>{credits} Credits Remaining</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                        <button
                            className={styles.button}
                            onClick={handleCameraClick}
                            disabled={credits < 1 || isAnalyzing || loading}
                        >
                            📷 Use Camera
                        </button>
                        <div className="relative inline-block">
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) handleFileChange(file);
                                }}
                                className="hidden"
                            />
                            <button
                                className={styles.button}
                                onClick={handleInputClick}
                                disabled={credits < 1 || isAnalyzing || loading}
                            >
                                📁 Choose from Library
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {(isAnalyzing || loading) && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 animate-pulse">
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                                <span className="text-green-700 font-medium">
                                    {isAnalyzing ? 'Analyzing your hair...' : 'Processing results...'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Analysis Results */}
                    {showResults && predictions && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Main Result */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                                <h3 className="text-lg font-semibold mb-2">🎯 Hair Analysis Result</h3>
                                <div className="text-3xl font-bold mb-2">{topPrediction?.className}</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white/30 rounded-full h-2">
                                        <div 
                                            className="bg-white h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(topPrediction?.probability ?? 0) * 100}%` }}
                                        />
                                    </div>
                                    <span className="font-medium">{Math.round((topPrediction?.probability ?? 0) * 100)}%</span>
                                </div>
                            </div>

                            {/* All Predictions */}
                            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                                <h4 className="font-semibold text-gray-800 mb-4">📊 Full Analysis</h4>
                                <div className="space-y-3">
                                    {predictions.slice(0, 5).map((pred, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600 w-32 truncate">{pred.className}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${pred.probability * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 w-12 text-right">
                                                {Math.round(pred.probability * 100)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Recommendations */}
                            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                                <h4 className="font-semibold text-gray-800 mb-4">🛍️ Recommended Products for {topPrediction?.className}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {recommendedProducts.map((product, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <h5 className="font-medium text-gray-800 mb-1">{product.name}</h5>
                                            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-green-600 font-bold">{product.price}</span>
                                                <a
                                                    href={product.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
                                                >
                                                    View →
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* New Analysis Button */}
                            <div className="text-center">
                                <button
                                    onClick={() => {
                                        setImageSrc(null);
                                        setShowResults(false);
                                        setAnalysisSaved(false);
                                    }}
                                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    🔄 Analyze Another Photo
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ImageUploader;