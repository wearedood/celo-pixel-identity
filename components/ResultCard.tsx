import React from 'react';
import { PixelArtResult } from '../types';

interface ResultCardProps {
  result: PixelArtResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  return (
    <div className="animate-fade-in-up w-full max-w-md mx-auto relative group">
        {/* Abstract shapes behind */}
        <div className="absolute -top-4 -right-4 w-full h-full bg-black rounded-none -z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"></div>
        
        <div className="bg-white border-2 border-black p-8 relative z-0">
            <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="font-serif italic text-2xl text-black">Identity Revealed</h3>
                    <div className="h-1 w-12 bg-[#FCFF52] mt-2"></div>
                 </div>
                 <div className="px-3 py-1 bg-[#FCFF52] border border-black rounded-full text-xs font-bold uppercase tracking-wider">
                    {result.cryptoName}
                 </div>
            </div>

            <div className="relative aspect-square w-full mb-8 border-2 border-black bg-neutral-100 overflow-hidden">
                <img 
                src={result.imageUrl} 
                alt={`Pixel art of ${result.cryptoName}`}
                className="w-full h-full object-contain pixelated-image scale-90"
                />
            </div>

            <div className="text-center mb-8">
                <h2 className="text-4xl font-serif font-medium text-black mb-2">
                    {result.cryptoName}
                </h2>
                <p className="font-mono text-sm text-neutral-600 uppercase tracking-widest">
                    {result.trait}
                </p>
            </div>

            <button 
                onClick={onReset}
                className="w-full py-4 bg-black text-[#FCFF52] font-bold text-lg hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2 group-hover:shadow-lg"
            >
                Start Over
                <span className="text-xl">→</span>
            </button>
      </div>
    </div>
  );
};

export default ResultCard;