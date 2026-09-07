import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Server, Sparkles, BookOpen, Layers, Settings2 } from 'lucide-react';
import { getBackendBaseUrl, isMockModeEnabled, setBackendBaseUrl, setMockMode } from '../api/apiClient';
import { resetMockDataToDefault } from '../api/productApi';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [mockMode, setMockModeState] = useState(isMockModeEnabled());
  const [apiUrl, setApiUrl] = useState(getBackendBaseUrl());
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const isHome = location.pathname === '/' || location.pathname === '/dashboard';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const testBackendConnection = async () => {
    setIsTesting(true);
    setTestStatus('Pinging backend at ' + apiUrl + '...');
    try {
      const res = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        setTestStatus('Connected! Backend responded 200 OK.');
      } else {
        setTestStatus(`Backend returned status ${res.status}.`);
      }
    } catch (err: any) {
      setTestStatus('Cannot reach backend. Make sure your FastAPI server is running on port 8000 with CORS enabled.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = () => {
    setBackendBaseUrl(apiUrl);
    setMockMode(mockMode);
    setShowConfigModal(false);
    window.location.reload();
  };

  const handleResetCatalog = async () => {
    await resetMockDataToDefault();
    alert('Catalog reset to the 5 standard demo artisan items.');
    window.location.reload();
  };

  return (
    <>
      <header
        id="app-header"
        className="sticky top-0 z-30 w-full bg-stone-900/95 backdrop-blur-md text-white border-b border-stone-800 px-4 py-3"
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {showBack ? (
              <button
                type="button"
                id="header-back-btn"
                onClick={handleBack}
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200 transition-colors cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div
                onClick={() => navigate('/dashboard')}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 to-orange-500 flex items-center justify-center font-black text-white text-base shadow-xs cursor-pointer"
              >
                क
              </div>
            )}

            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                {title || 'KalaKriti'}
              </h1>
              <p className="text-[11px] text-stone-400 font-medium leading-none">
                Artisan Market Linkage • SIH26090
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Status Pill for Hackathon Judges */}
            <button
              type="button"
              id="api-status-badge"
              onClick={() => setShowConfigModal(true)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-700 bg-stone-800/90 text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="FastAPI / Demo Mode Settings"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  mockMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              <span className="hidden sm:inline">
                {mockMode ? 'Demo Mode' : 'Live API'}
              </span>
              <Settings2 className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Backend & Mock Mode Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-stone-900 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-lg text-stone-900">
                  Hackathon Settings
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Toggle between the built-in resilient Hackathon Demo Mode and a live Python FastAPI backend.
            </p>

            {/* Mode Switch */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-stone-900 block">
                    Demo Mock Mode
                  </span>
                  <span className="text-xs text-stone-500">
                    Runs standalone without needing FastAPI backend
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={mockMode}
                  onChange={(e) => setMockModeState(e.target.checked)}
                  className="w-5 h-5 accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Backend URL input */}
            <div className="mb-4">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                FastAPI Backend URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full text-sm font-medium border border-stone-300 rounded-xl px-3 py-2 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={testBackendConnection}
                  disabled={isTesting}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  {isTesting ? 'Testing...' : 'Ping /api/health'}
                </button>
                <button
                  type="button"
                  onClick={handleResetCatalog}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  Reset Demo Items
                </button>
              </div>

              {testStatus && (
                <p className="text-xs text-stone-600 mt-2 p-2 bg-stone-50 rounded-lg border border-stone-200">
                  {testStatus}
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
