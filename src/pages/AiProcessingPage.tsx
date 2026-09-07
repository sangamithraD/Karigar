import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { useProductCreation } from '../context/ProductCreationContext';

export const AiProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isProcessing,
    processingStage,
    processingError,
    startAiPipeline,
  } = useProductCreation();

  useEffect(() => {
    // Kick off the AI pipeline when entering screen
    if (!isProcessing && processingStage === 0 && !processingError) {
      startAiPipeline(() => {
        navigate('/add-product/generated');
      });
    }
  }, []);

  const handleRetry = () => {
    startAiPipeline(() => {
      navigate('/add-product/generated');
    });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between pb-10 max-w-md mx-auto">
      <Header
        title="AI Assistant"
        showBack
        onBack={() => navigate('/add-product/voice')}
      />

      <main className="p-4 flex-1 flex flex-col justify-center">
        {processingError ? (
          <ErrorMessage
            title="Processing Issue"
            message={processingError}
            onRetry={handleRetry}
            actionLabel="Try Again"
          />
        ) : (
          <LoadingState
            currentStage={processingStage || 1}
            title="Creating your product listing..."
            subtitle="AI is analyzing your voice and photo for online buyers"
          />
        )}
      </main>
    </div>
  );
};
