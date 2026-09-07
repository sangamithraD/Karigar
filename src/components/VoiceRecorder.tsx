import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Volume2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface VoiceRecorderProps {
  onAudioReady: (blob: Blob, url: string) => void;
  existingAudioUrl?: string | null;
  onContinue: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onAudioReady,
  existingAudioUrl,
  onContinue,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [activeSample, setActiveSample] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl && !existingAudioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, existingAudioUrl]);

  // Handle live microphone recording
  const startRecording = async () => {
    audioChunksRef.current = [];
    setMicPermissionDenied(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady(audioBlob, url);
        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or unavailable in environment', err);
      setMicPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  // Quick fallback pre-recorded artisan voice sample generator
  const useArtisanVoiceSample = async (sampleType: 'hindi' | 'bilingual' | 'clay') => {
    // Generate an audio blob using synthesized web audio tone buffer or mock blob
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 4;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      // gentle acoustic voice-like frequency
      data[i] = Math.sin(i / 18) * 0.1 * Math.exp(-i / (sampleRate * 4));
    }

    // Convert buffer to wave blob
    const wavBlob = await audioBufferToWavBlob(buffer);
    const url = URL.createObjectURL(wavBlob);
    setAudioUrl(url);
    setRecordDuration(duration);
    setActiveSample(sampleType);
    onAudioReady(wavBlob, url);
    setMicPermissionDenied(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="voice-recorder-component" className="w-full flex flex-col items-center">
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Main Microphone Interaction Circle */}
      <div className="my-6 relative flex flex-col items-center">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
        )}

        {!audioUrl ? (
          <div className="flex flex-col items-center gap-3">
            <button
              id="record-toggle-btn"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95 ${
                isRecording
                  ? 'bg-red-600 text-white hover:bg-red-700 ring-8 ring-red-100'
                  : 'bg-amber-600 text-white hover:bg-amber-700 ring-8 ring-amber-100 hover:scale-105'
              }`}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {isRecording ? (
                <Square className="w-10 h-10 fill-current" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>

            <span className="font-semibold text-stone-700 text-sm">
              {isRecording ? (
                <span className="text-red-600 flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  Recording: {formatTimer(recordDuration)} (Tap to stop)
                </span>
              ) : (
                'Tap mic to speak'
              )}
            </span>
          </div>
        ) : (
          /* Recorded Audio Review Card */
          <div className="w-full max-w-sm bg-stone-50 border-2 border-stone-200 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Voice recorded ({formatTimer(recordDuration)})</span>
            </div>

            {/* Play/Pause Button */}
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                id="play-voice-btn"
                onClick={togglePlayback}
                className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center hover:bg-amber-800 transition-colors shadow-xs active:scale-95"
                title={isPlaying ? 'Pause' : 'Play voice audio'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                id="re-record-btn"
                onClick={() => {
                  setAudioUrl(null);
                  setActiveSample(null);
                  setRecordDuration(0);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm flex items-center gap-1.5 hover:bg-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Record Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mic permission prompt or demo fallback */}
      {micPermissionDenied && (
        <div className="w-full max-w-sm mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Microphone not accessible</p>
            <p className="text-stone-600 mt-0.5">
              Select one of the sample artisan voice recordings below to test without mic access:
            </p>
          </div>
        </div>
      )}

      {/* Quick Demo Voice Samples (Essential for instant testing in all environments) */}
      <div className="w-full max-w-sm mt-1 pt-3 border-t border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            Quick Demo Voice Samples:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => useArtisanVoiceSample('hindi')}
            className={`text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              activeSample === 'hindi'
                ? 'border-amber-600 bg-amber-50/60 font-semibold text-amber-900'
                : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <span className="font-bold block text-stone-900">Palm Basket (Hindi)</span>
            <span className="text-[11px] text-stone-500">हाथ से बुनी ताड़ डलिया</span>
          </button>

          <button
            type="button"
            onClick={() => useArtisanVoiceSample('clay')}
            className={`text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              activeSample === 'clay'
                ? 'border-amber-600 bg-amber-50/60 font-semibold text-amber-900'
                : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <span className="font-bold block text-stone-900">Clay Pot (Natural)</span>
            <span className="text-[11px] text-stone-500">नदी की लाल मिट्टी मटका</span>
          </button>
        </div>
      </div>

      {/* Continue Action */}
      <div className="w-full max-w-sm mt-6">
        <Button
          id="continue-after-voice-btn"
          onClick={onContinue}
          variant="warm"
          fullWidth
          size="lg"
          icon={<Sparkles className="w-5 h-5" />}
          disabled={!audioUrl && !activeSample}
        >
          {audioUrl ? 'Process with AI' : 'Record voice to continue'}
        </Button>
      </div>
    </div>
  );
};

// Utility to create audio wav blob from AudioBuffer
async function audioBufferToWavBlob(buffer: AudioBuffer): Promise<Blob> {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: any) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: any) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  setUint32(0x46464952);
  // file length minus RIFF identifier & length
  setUint32(length - 8);
  // RIFF type & format
  setUint32(0x45564157);
  setUint32(0x20746d66);
  // format chunk length
  setUint32(16);
  // sample format (raw)
  setUint16(1);
  // channel count
  setUint16(numOfChan);
  // sample rate
  setUint32(sampleRate);
  // byte rate (sample rate * block align)
  setUint32(sampleRate * 2 * numOfChan);
  // block align (channel count * bytes per sample)
  setUint16(numOfChan * 2);
  // bits per sample
  setUint16(16);
  // data chunk identifier
  setUint32(0x61746164);
  // data chunk length
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}
