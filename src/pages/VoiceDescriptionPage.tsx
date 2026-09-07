import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { useProductCreation } from '../context/ProductCreationContext';

export const VoiceDescriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    audioUrl,
    setAudioRecording,
  } = useProductCreation();

  const handleContinue = () => {
    navigate('/add-product/processing');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-10 max-w-md mx-auto">
      <Header
        title="Voice Description"
        showBack
        onBack={() => navigate('/add-product/photo')}
      />

      <main className="p-4 space-y-4 flex-1 flex flex-col items-center">
        {/* Simple Artisan Friendly Header */}
        <div className="w-full bg-white rounded-2xl p-4 border border-stone-200 text-center">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Step 2 of 2
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight mt-0.5">
            Tell us about your product in your language.
          </h2>
          <p className="text-stone-500 text-xs mt-1 leading-relaxed">
            अपनी भाषा में बोलें • Tell us what material you used, how you made it, and what it is used for.
          </p>
        </div>

        {/* Core Voice Recorder Component */}
        <VoiceRecorder
          onAudioReady={(blob, url) => setAudioRecording(blob, url)}
          existingAudioUrl={audioUrl}
          onContinue={handleContinue}
        />
      </main>
    </div>
  );
};
