import React, { useRef, useState } from 'react';
import { PixelArtResult } from '../types';
// @ts-ignore
import html2canvas from 'html2canvas';

interface ResultCardProps {
  result: PixelArtResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
        // Wait a moment for fonts to be fully ready if needed
        await document.fonts.ready;

        const canvas = await html2canvas(cardRef.current, {
            scale: 3, // High resolution for crisp text
            backgroundColor: '#ffffff',
            useCORS: true, // Helpful if we had external images, safe to have
            ignoreElements: (element: Element) => element.id === 'action-buttons-container'
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `celo-identity-${result.cryptoName.toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("Failed to generate image", err);
    } finally {
        setIsDownloading(false);
    }
  };

  const appUrl = "https://celo-pixel-identity-89706027518.us-west1.run.app/";

  // Text for X (Twitter) - Uses @ddtrvlr2
  const shareTextX = encodeURIComponent(
    `I just discovered my on-chain identity on @celo thanks to @ddtrvlr2 the builder!\n\nI'm ${result.cryptoName} - ${result.trait}. 👾✨\n\nIf you want to check it out, check it now :\n${appUrl}`
  );

  // Text for Farcaster - Uses @ddtrvlr
  const shareTextFarcaster = encodeURIComponent(
    `I just discovered my on-chain identity on @celo thanks to @ddtrvlr the builder!\n\nI'm ${result.cryptoName} - ${result.trait}. 👾✨\n\nIf you want to check it out, check it now :\n${appUrl}`
  );

  return (
    <div className="animate-fade-in-up w-full max-w-md mx-auto relative group">
        {/* Abstract shapes behind */}
        <div className="absolute -top-4 -right-4 w-full h-full bg-black rounded-none -z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"></div>
        
        {/* Main Card Container - Ref for screenshot */}
        <div ref={cardRef} className="bg-white border-2 border-black p-8 relative z-0 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="font-serif italic text-2xl text-black">Identity Revealed</h3>
                    <div className="h-1 w-12 bg-[#FCFF52] mt-2"></div>
                 </div>
                 <div className="px-3 py-1 bg-[#FCFF52] border border-black rounded-full text-xs font-bold uppercase tracking-wider">
                    {result.cryptoName}
                 </div>
            </div>

            <div className="relative aspect-square w-full mb-6 border-2 border-black bg-neutral-100 overflow-hidden group/image">
                <img 
                  src={result.imageUrl} 
                  alt={`Pixel art of ${result.cryptoName}`}
                  className="w-full h-full object-contain pixelated-image scale-90"
                />
            </div>

            <div className="text-center mb-6">
                <h2 className="text-4xl font-serif font-medium text-black mb-2">
                    {result.cryptoName}
                </h2>
                <p className="font-mono text-sm text-neutral-600 uppercase tracking-widest">
                    {result.trait}
                </p>
            </div>

            {/* Action Bar - Ignored during download via ID */}
            <div id="action-buttons-container" className="mt-auto pt-4 border-t border-dashed border-neutral-300">
                <div className="grid grid-cols-3 gap-2 mb-6">
                <button 
                    onClick={downloadImage}
                    disabled={isDownloading}
                    title="Save Card"
                    className="flex flex-col items-center justify-center p-3 border border-black hover:bg-[#FCFF52] transition-colors gap-1 group/btn disabled:opacity-50"
                >
                    {isDownloading ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    )}
                    <span className="text-[10px] font-bold uppercase">{isDownloading ? 'Saving...' : 'Save Card'}</span>
                </button>

                <a 
                    href={`https://twitter.com/intent/tweet?text=${shareTextX}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on X"
                    className="flex flex-col items-center justify-center p-3 border border-black hover:bg-black hover:text-white transition-colors gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase">Post</span>
                </a>

                <a 
                    href={`https://warpcast.com/~/compose?text=${shareTextFarcaster}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Farcaster"
                    className="flex flex-col items-center justify-center p-3 border border-black hover:bg-[#855DCD] hover:text-white transition-colors gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 4.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    <path d="M15.5 14c-1-1-2.5-1-3.5 0-1-1-2.5-1-3.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase">Cast</span>
                </a>
                </div>

                <div className="text-[10px] text-center text-neutral-500 mb-4 px-4">
                Tip: Save the card image to attach it to your post!
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
    </div>
  );
};

export default ResultCard;