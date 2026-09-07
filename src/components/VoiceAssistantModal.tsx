import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  Volume2,
} from 'lucide-react';
import { voiceService, QUICK_VOICE_COMMANDS } from '../services/voiceService';
import { rawMaterialService } from '../services/rawMaterialService';
import { VoiceCommandResult } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AssistantStage = 'idle' | 'listening' | 'understanding' | 'performing' | 'completed';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<AssistantStage>('idle');
  const [spokenText, setSpokenText] = useState('');
  const [commandResult, setCommandResult] = useState<VoiceCommandResult | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStage('idle');
      setSpokenText('');
      setCommandResult(null);

      // Check browser speech recognition support
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    setStage('listening');
    setSpokenText('');
    setCommandResult(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // English (India) with natural regional phonetics

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setSpokenText(transcript);
        };

        recognition.onend = () => {
          // If transcript received, process it
          if (spokenText) {
            processTranscript(spokenText);
          } else {
            // Fallback timeout
            setTimeout(() => {
              setStage('idle');
            }, 1000);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning:', event.error);
          // If speech error (mic denied/timeout), allow manual simulation
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Could not initialize speech recognition:', err);
      }
    } else {
      // Simulate speech listening in sandboxed environments
      setTimeout(() => {
        setSpokenText('What can I make with bamboo?');
      }, 1500);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  };

  const handleManualCommandSelect = (cmd: string) => {
    setSpokenText(cmd);
    processTranscript(cmd);
  };

  const processTranscript = (text: string) => {
    stopListening();
    setStage('understanding');

    setTimeout(() => {
      const result = voiceService.detectIntent(text);
      setCommandResult(result);
      setStage('performing');

      setTimeout(() => {
        executeApplicationAction(result);
        setStage('completed');
      }, 700);
    }, 600);
  };

  const executeApplicationAction = (result: VoiceCommandResult) => {
    switch (result.intent) {
      case 'ADD_PRODUCT':
        navigate('/add-product');
        break;

      case 'ADD_RAW_MATERIAL':
        // If material extracted, automatically add to inventory
        if (result.parameters.materialName) {
          rawMaterialService.saveRawMaterial({
            name: result.parameters.materialName,
            quantity: 5,
            unit: 'kg',
            category: 'Natural Material',
            notes: 'Added via Karigan Voice Assistant.',
          });
        }
        navigate('/raw-materials');
        break;

      case 'VIEW_PRODUCTS':
        navigate('/catalog');
        break;

      case 'VIEW_RAW_MATERIALS':
        navigate('/raw-materials');
        break;

      case 'GENERATE_PRODUCT_IDEAS':
        const mat = result.parameters.material;
        navigate(mat ? `/ideas?material=${encodeURIComponent(mat)}` : '/ideas');
        break;

      case 'FIND_TUTORIAL':
        const q = result.parameters.query;
        navigate(q ? `/learning?q=${encodeURIComponent(q)}` : '/learning');
        break;

      case 'CREATE_LISTING':
      case 'PUBLISH_PRODUCT':
      case 'VIEW_PUBLISHED_PRODUCTS':
        navigate('/marketplace');
        break;

      case 'SHOW_DASHBOARD':
        navigate('/dashboard');
        break;

      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-t sm:border border-stone-200 text-stone-900 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                Karigan Voice Assistant
              </h3>
              <p className="text-[11px] text-stone-500">
                Speak naturally • Hands-free business control
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Stage Visualizer */}
        <div className="text-center py-4 px-2 bg-stone-50 rounded-3xl border border-stone-200/80 space-y-3">
          {stage === 'idle' && (
            <>
              <button
                type="button"
                onClick={startListening}
                className="w-20 h-20 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Mic className="w-9 h-9" />
              </button>
              <p className="font-bold text-sm text-stone-900">
                Tap microphone and speak
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Example: "Add bamboo as a raw material" or "What can I make?"
              </p>
            </>
          )}

          {stage === 'listening' && (
            <>
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-600/30 animate-ping" />
                <button
                  type="button"
                  onClick={() => processTranscript(spokenText || 'What can I make with bamboo?')}
                  className="relative z-10 w-20 h-20 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-lg"
                >
                  <Mic className="w-9 h-9 animate-pulse" />
                </button>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  Listening...
                </span>
                <p className="text-sm font-semibold text-stone-800 px-4 min-h-[24px]">
                  {spokenText ? `"${spokenText}"` : 'Listening to your voice...'}
                </p>
              </div>
              {spokenText && (
                <button
                  type="button"
                  onClick={() => processTranscript(spokenText)}
                  className="text-xs font-bold text-amber-800 underline mt-1 cursor-pointer"
                >
                  Done Speaking → Execute Action
                </button>
              )}
            </>
          )}

          {stage === 'understanding' && (
            <>
              <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center mx-auto text-amber-800">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Understanding Intent...
              </span>
              <p className="text-sm font-semibold text-stone-800">
                "{spokenText}"
              </p>
            </>
          )}

          {stage === 'performing' && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-800">
                <ArrowRight className="w-8 h-8 animate-pulse" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                Performing Action...
              </span>
              <p className="text-xs font-medium text-stone-600">
                {commandResult?.feedbackMessage}
              </p>
            </>
          )}

          {stage === 'completed' && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Action Executed
                </span>
                <p className="text-sm font-bold text-stone-900 px-3">
                  {commandResult?.feedbackMessage}
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  View Result
                </button>
              </div>
            </>
          )}
        </div>

        {/* Quick Voice Command Chips (Feature 8) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Quick Voice Commands
            </span>
            <span className="text-[10px] text-stone-400">Tap to simulate</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {QUICK_VOICE_COMMANDS.map((cmd, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleManualCommandSelect(cmd)}
                className="text-xs font-semibold py-1.5 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
