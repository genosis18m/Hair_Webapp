import React, {useState} from 'react';
import { alibaba, amazon, jumia } from '../../assets/index';
import styles from '../../styles/ImageUploaderStyles';
import UpgradeCard from '../UpgradeCard';

interface Prediction {
    className: string;
    probability: number;
}

interface ImageUploaderProps {
    imageSrc: string | null ;
    setImageSrc: (src: string | null) => void;
    predictions: Prediction[] | null;
    classifyImage: (file: File) => Promise<void>;
    setIsCameraView: React.Dispatch<React.SetStateAction<boolean>>
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    imageSrc,
    setImageSrc,
    predictions,
    classifyImage,
    setIsCameraView
}) => {

    const [showModel, setShowModel] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
    const [credits, setCredits] = useState(150);

    const handleFileChange = async (file: File) => {
        if (credits < 1) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            classifyImage(file)

            setCredits(prev => Math.max(prev - 25, 0));
        };
        reader.readAsDataURL(file);
    };

    const handleInputClick = () => {
        document.getElementById('fileInput')?.click();
    };

    const handleBuyHairProducts = () => {
        if (predictions && predictions.length > 0){
            const topPrediction = predictions.reduce((prev, current) => 
                prev.probability > current.probability ? prev : current
            );
            const product = encodeURIComponent(topPrediction.className + 'hair products');
            setSelectedWebsite(product);
            setShowModel(true);
        } else {
            alert('No predictions available to search for products.')
        }
    };

    const handleWebsiteClick = (website: string) =>{
        let url = '';
        switch (website) {
            case 'Amazon':
                url = `https://www.amazon.com/s?k=${selectedWebsite}`;
                break;
            case 'Alibaba':
                url = `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${selectedWebsite}`;
                break;
            case 'Jumia':
                url = `https://www.jumia.com.ng/catalog/?g=${selectedWebsite}`;
                break;
            default:
                return;
        }
        window.open(url, '_blank')
        setShowModel(false);
    };

    return (
      <div className={styles.container}>
        {credits < 1 ? (
            <UpgradeCard />
        ) : (
            <>
            {imageSrc ? (
                <img src={imageSrc} alt='Capured' className={styles.image} />
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
            <p className={styles.credits}>Credits: {credits}</p>
            
            <button
                className={styles.button}
                onClick={() => {
                    setIsCameraView(true);
                    setCredits(prev => Math.max(prev - 25, 0));
                }}
                disabled={credits < 1}
            >
                Use Camera
            </button>
            <div className="flex justify-center space-x-4 mb-4">
                <div className="relative inline-block">
                    <input
                        id="fileInput" 
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) handleFileChange(file);
                        }}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                <button
                    className={styles.button}
                    onClick={handleInputClick}
                    disabled={credits < 1}
                >
                Choose from Library
                </button>
                </div>
            </div>

            {predictions && (
                <div className={styles.analysisContainer}>
                    <h3 className={styles.analysisTitle}>Analysis Result</h3>
                    <ul>
                        {predictions.map((concept, index) => (
                            <li key={index} className={styles.analysisItem}>
                                {concept.className}: {Math.round(concept.probability * 100)}%
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none"
                        onClick={handleBuyHairProducts}
                    >
                        Buy Hair Products
                    </button>
                </div>
            )}
            
            {showModel && (
                <div className={styles.modalContainer}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>Choose a Website</h3>
                        <div className="flex flex-col space-y-2">
                            <button
                            className={styles.websiteButton}
                            onClick={() => handleWebsiteClick('Amazon')}
                            >
                                <img src={amazon} alt="Amazon" className="w-6 h-6"/>
                                <span>Amazon</span>
                            </button>

                            <button
                            className={styles.websiteButton}
                            onClick={() => handleWebsiteClick('Alibaba')}
                            >
                                <img src={alibaba} alt="Alibaba" className="w-6 h-6"/>
                                <span>Alibaba</span>
                            </button>

                            <button
                            className={styles.websiteButton}
                            onClick={() => handleWebsiteClick('Jumia')}
                            >
                                <img src={jumia} alt="Jumia" className="w-6 h-6"/>
                                <span>Jumia</span>
                            </button>

                        </div>

                    </div>

                </div>
            )}
            </>
        )}

      </div>
    )
  }
  
  export default ImageUploader
  