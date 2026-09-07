import React from 'react';
import { Play, Clock, ExternalLink } from 'lucide-react';
import { TutorialVideo } from '../types';

interface TutorialCardProps {
  tutorial: TutorialVideo;
  onWatch?: (tutorial: TutorialVideo) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onWatch }) => {
  const handleOpenVideo = () => {
    if (onWatch) {
      onWatch(tutorial);
    } else {
      window.open(tutorial.youtubeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border-2 border-stone-200/90 shadow-xs space-y-3">
      {/* Video Thumbnail with Play Overlay */}
      <div
        onClick={handleOpenVideo}
        className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-stone-900 group cursor-pointer border border-stone-200"
      >
        <img
          src={tutorial.thumbnailUrl}
          alt={tutorial.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
        />

        <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-amber-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-stone-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-stone-300" />
          <span>{tutorial.duration}</span>
        </div>

        {/* Craft type badge */}
        {tutorial.craftType && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
            {tutorial.craftType}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
          <span>{tutorial.materialCategory}</span>
          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
            {tutorial.difficulty}
          </span>
        </div>

        <h3
          onClick={handleOpenVideo}
          className="font-bold text-sm text-stone-900 leading-snug hover:text-amber-800 transition-colors cursor-pointer line-clamp-2"
        >
          {tutorial.title}
        </h3>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-stone-500 text-[11px]">
            Language: <strong className="text-stone-700">{tutorial.language}</strong>
          </span>

          <button
            type="button"
            onClick={handleOpenVideo}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
