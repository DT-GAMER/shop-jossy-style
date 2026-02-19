// components/MediaRenderer.tsx
import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface MediaRendererProps {
  src: string;
  type?: 'IMAGE' | 'VIDEO';
  alt?: string;
  className?: string;
  showControls?: boolean;
}

export default function MediaRenderer({ 
  src, 
  type = 'IMAGE', 
  alt = '', 
  className = '',
  showControls = true
}: MediaRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (type === 'VIDEO') {
    return (
      <div className="relative w-full h-full group">
        <video
          ref={videoRef}
          src={src}
          className={className}
          loop
          playsInline
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Custom play/pause button overlay */}
        {showControls && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="rounded-full bg-white/90 p-4 shadow-lg transform transition-transform hover:scale-110">
              {isPlaying ? (
                <Pause className="h-8 w-8 text-primary" />
              ) : (
                <Play className="h-8 w-8 text-primary fill-primary" />
              )}
            </div>
          </button>
        )}
      </div>
    );
  }

  // Default to image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}