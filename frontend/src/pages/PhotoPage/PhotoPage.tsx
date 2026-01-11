import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import CameraCapturePage from './CameraCapture';
import ImageUploader from './ImageUploader';

const PhotoPage: React.FC = () => {
  const [isCameraView, setIsCameraView] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any | null>(null);
  const [model, setModel] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // TODO: Replace with your Teachable Machine model URL
  const modelURL = 'https://teachablemachine.withgoogle.com/models/LNAvMinwT/model.json';
  const metadataURL = 'https://teachablemachine.withgoogle.com/models/LNAvMinwT/metadata.json';

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        setModelError(null);
      } catch (error) {
        console.error('Error loading model:', error);
        setModelError('AI Model not configured. Please add your Teachable Machine model URL.');
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  const classifyImage = async (file: File) => {
    if (!model) {
      console.warn('Model not loaded yet');
      return;
    }

    setIsAnalyzing(true);
    setPredictions(null);

    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);

    image.onload = async () => {
      try {
        const prediction = await model.predict(image);
        setPredictions(prediction);
      } catch (error) {
        console.error('Error classifying image:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading AI Model...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      {modelError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg max-w-md animate-slideIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{modelError}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-2xl animate-fadeIn">
        {isCameraView ? (
          <CameraCapturePage
            setImageSrc={setImageSrc}
            setIsCameraView={setIsCameraView}
            classifyImage={classifyImage}
          />
        ) : (
          <ImageUploader
            imageSrc={imageSrc}
            setImageSrc={setImageSrc}
            predictions={predictions}
            classifyImage={classifyImage}
            setIsCameraView={setIsCameraView}
            isAnalyzing={isAnalyzing}
          />
        )}
      </div>
    </div>
  );
};

export default PhotoPage;
