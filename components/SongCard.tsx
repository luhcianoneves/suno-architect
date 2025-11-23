import React, { useState } from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  index: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);

  const copyToClipboard = async (text: string, type: 'prompt' | 'lyrics') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'prompt') {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      } else {
        setCopiedLyrics(true);
        setTimeout(() => setCopiedLyrics(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-lg hover:shadow-suno-500/10 transition-all duration-300 flex flex-col h-full group">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-700 to-dark-800 p-4 border-b border-dark-700 flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-suno-600 flex items-center justify-center text-white font-bold font-mono shadow-md shadow-suno-900/50">
          {index + 1}
        </div>
        <h3 className="text-lg font-bold text-white truncate w-full" title={song.title}>
          {song.title}
        </h3>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        
        {/* Lyrics Section (Main Focus) */}
        <div className="flex-1 flex flex-col min-h-[250px]">
           <div className="flex justify-between items-center mb-2">
            <label className="text-xs uppercase tracking-wider text-suno-300 font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Letra Formatada
            </label>
             <button
              onClick={() => copyToClipboard(song.lyrics, 'lyrics')}
              className={`text-xs px-4 py-1.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                copiedLyrics
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                  : 'bg-dark-700 hover:bg-suno-600 text-gray-200 hover:text-white border border-dark-600 hover:border-suno-500'
              }`}
            >
              {copiedLyrics ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  Copiar Letra
                </>
              )}
            </button>
          </div>
          <div className="bg-dark-900/80 rounded-lg p-4 h-64 overflow-y-auto border border-dark-700 text-sm text-gray-300 whitespace-pre-line font-medium leading-relaxed shadow-inner scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-transparent hover:scrollbar-thumb-dark-500">
            {song.lyrics}
          </div>
        </div>

        {/* Suno Prompt Section (Secondary but Critical) */}
        <div className="bg-dark-900 rounded-lg p-3 border border-dark-700 relative group/prompt">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              Ritmo / Estilo
            </label>
            <button
              onClick={() => copyToClipboard(song.stylePrompt, 'prompt')}
              className={`text-xs px-4 py-1.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                copiedPrompt 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-purple-500/20 shadow-md'
              }`}
            >
              {copiedPrompt ? (
                 <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  Copiar Ritmo
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-suno-100 font-mono leading-relaxed break-words bg-dark-800/50 p-2 rounded border border-dark-700/50">
            {song.stylePrompt}
          </p>
        </div>

      </div>
    </div>
  );
};

export default SongCard;