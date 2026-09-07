import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera, Mic, IndianRupee, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      id="welcome-screen"
      className="min-h-screen bg-stone-100 flex flex-col justify-between p-4 max-w-md mx-auto"
    >
      {/* Top Banner / Artisan Heritage Accent */}
      <div className="pt-6 pb-2 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-700 text-white font-black text-2xl shadow-md mb-3 ring-4 ring-amber-100">
          K
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
          SIH 2026 • Project SIH26090
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
          Karigan
        </h1>
        <p className="text-sm font-semibold text-amber-800 mt-0.5">
          AI Digital Business Assistant for Artisans
        </p>
      </div>

      {/* Hero Visual Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-xs space-y-4 my-auto">
        <div className="aspect-16/9 rounded-2xl overflow-hidden relative bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"
            alt="Handicraft Artisan"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-4">
            <p className="text-white text-sm font-semibold">
              Sell your handcrafted products directly to urban buyers
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h2 className="text-xl font-bold text-stone-900 leading-snug">
            Your Virtual Business Manager
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            No complicated typing or paperwork. Just photograph your craft, speak in your mother tongue, and our AI builds marketplace-ready digital listings with fair-trade pricing.
          </p>
        </div>

        {/* 3 Simple Value Props */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
          <div className="p-2.5 rounded-xl bg-stone-50 flex flex-col items-center">
            <Camera className="w-5 h-5 text-amber-700 mb-1" />
            <span className="text-[11px] font-bold text-stone-800">1. Snap Photo</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 flex flex-col items-center">
            <Mic className="w-5 h-5 text-amber-700 mb-1" />
            <span className="text-[11px] font-bold text-stone-800">2. Speak Voice</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 flex flex-col items-center">
            <IndianRupee className="w-5 h-5 text-amber-700 mb-1" />
            <span className="text-[11px] font-bold text-stone-800">3. Fair Price</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-4 space-y-3">
        <Button
          id="welcome-start-btn"
          onClick={() => navigate('/dashboard')}
          variant="warm"
          size="xl"
          fullWidth
          icon={<ArrowRight className="w-6 h-6" />}
          iconPosition="right"
        >
          Get Started
        </Button>
        <p className="text-center text-xs text-stone-400 font-medium">
          Zero cost • Built for rural & marginalized artisans
        </p>
      </div>
    </div>
  );
};
