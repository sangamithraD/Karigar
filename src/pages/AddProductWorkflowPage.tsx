import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mic, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useProductCreation } from '../context/ProductCreationContext';

export const AddProductWorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const { photoUrl, audioBlob, audioUrl } = useProductCreation();

  const hasPhoto = !!photoUrl;
  const hasVoice = !!audioBlob || !!audioUrl;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-10 max-w-md mx-auto">
      <Header title="Add New Product" showBack onBack={() => navigate('/dashboard')} />

      <main className="p-4 space-y-5">
        {/* Simple Workflow Header */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Easy 2-Step Process
          </span>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
            Create Listing
          </h2>
          <p className="text-stone-600 text-sm mt-1 leading-relaxed">
            No typing required. Simply take a photo and speak in your language.
          </p>
        </div>

        {/* Step 1 Card: Photo */}
        <div
          onClick={() => navigate('/add-product/photo')}
          className={`bg-white rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-xs ${
            hasPhoto ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200 hover:border-amber-500'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  hasPhoto
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {hasPhoto ? <Check className="w-6 h-6 text-emerald-700" /> : '1'}
              </div>
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  Step 1
                </span>
                <h3 className="text-lg font-bold text-stone-900 leading-tight">
                  Take a photo of your product
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-2.5">
            {hasPhoto ? 'Photo selected and ready.' : 'Take a photo or choose from your gallery.'}
          </p>

          {hasPhoto && (
            <div className="mt-3 flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">
              <img
                src={photoUrl!}
                alt="Selected"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span className="text-xs font-semibold text-emerald-800">
                Photo captured successfully
              </span>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <Camera className="w-4 h-4" />
              {hasPhoto ? 'Change Photo' : 'Take or Upload Photo'}
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Step 2 Card: Voice */}
        <div
          onClick={() => {
            if (!hasPhoto) {
              navigate('/add-product/photo');
            } else {
              navigate('/add-product/voice');
            }
          }}
          className={`bg-white rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-xs ${
            hasVoice
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : hasPhoto
              ? 'border-stone-200 hover:border-amber-500'
              : 'border-stone-200 opacity-80'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  hasVoice
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {hasVoice ? <Check className="w-6 h-6 text-emerald-700" /> : '2'}
              </div>
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  Step 2
                </span>
                <h3 className="text-lg font-bold text-stone-900 leading-tight">
                  Tell us about your product
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-2.5">
            {hasVoice ? 'Voice recorded and ready.' : 'Speak in your language: Hindi, regional, or English.'}
          </p>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <Mic className="w-4 h-4" />
              {hasVoice ? 'Re-record Voice' : 'Record Voice'}
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          {!hasPhoto ? (
            <Button
              id="start-photo-step-btn"
              onClick={() => navigate('/add-product/photo')}
              variant="warm"
              size="lg"
              fullWidth
              icon={<Camera className="w-5 h-5" />}
            >
              Start Step 1: Take Photo
            </Button>
          ) : !hasVoice ? (
            <Button
              id="start-voice-step-btn"
              onClick={() => navigate('/add-product/voice')}
              variant="warm"
              size="lg"
              fullWidth
              icon={<Mic className="w-5 h-5" />}
            >
              Start Step 2: Record Voice
            </Button>
          ) : (
            <Button
              id="start-ai-generate-btn"
              onClick={() => navigate('/add-product/processing')}
              variant="warm"
              size="lg"
              fullWidth
              icon={<Sparkles className="w-5 h-5" />}
            >
              Generate AI Listing
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};
