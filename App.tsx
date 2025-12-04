import React, { useState, useEffect } from 'react';
import { connectWallet, switchToCeloNetwork, sendInteractionTransaction } from './services/web3Service';
import { generatePixelArtIdentity } from './services/geminiService';
import { AppStatus, PixelArtResult, TARGET_CONTRACT_ADDRESS } from './types';
import Button from './components/Button';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [result, setResult] = useState<PixelArtResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setStatus(AppStatus.CONNECTING);
      const address = await connectWallet();
      setWalletAddress(address);
      await switchToCeloNetwork();
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleInteraction = async () => {
    if (!walletAddress) {
      handleConnect();
      return;
    }

    setErrorMsg(null);

    try {
      // 1. Blockchain Interaction
      setStatus(AppStatus.INTERACTING);
      
      // Ensure we are on Celo
      await switchToCeloNetwork();
      
      const txHash = await sendInteractionTransaction(walletAddress);
      console.log("Transaction sent:", txHash);

      // 2. Generate Content (We start this after tx is submitted to keep user engaged)
      setStatus(AppStatus.GENERATING);
      
      const artResult = await generatePixelArtIdentity();
      setResult(artResult);
      setStatus(AppStatus.SUCCESS);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during the interaction.");
      setStatus(AppStatus.ERROR);
    }
  };

  const resetFlow = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay opacity-50 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply opacity-20 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* Header */}
      <header className="w-full px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-1">
          {/* Celo Logo Approximation */}
          <div className="flex gap-0.5">
            <div className="w-6 h-6 rounded-full border-4 border-black"></div>
            <div className="w-6 h-6 rounded-full bg-black -ml-3 mix-blend-multiply"></div>
          </div>
          <span className="font-bold text-xl ml-2 tracking-tight">Pixel<span className="font-serif italic">Identity</span></span>
        </div>
        <div>
          {walletAddress ? (
            <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-bold text-black transition-transform hover:-translate-y-0.5">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              className="text-sm font-bold text-black hover:text-neutral-600 transition-colors underline decoration-2 underline-offset-4 decoration-black"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 z-10">
        
        {status === AppStatus.SUCCESS && result ? (
          <ResultCard result={result} onReset={resetFlow} />
        ) : (
          <div className="max-w-4xl w-full text-center space-y-12">
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-serif text-black leading-[0.9] tracking-tighter">
                Which <span className="italic">Crypto</span> <br/> are you?
              </h1>
              <p className="text-black font-medium text-lg md:text-xl max-w-lg mx-auto leading-relaxed border-l-2 border-black pl-6 text-left md:ml-[35%]">
                Interact with the Celo blockchain to discover your on-chain soulmate, beautifully rendered in 8-bit.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <Button 
                onClick={handleInteraction}
                isLoading={status === AppStatus.INTERACTING || status === AppStatus.GENERATING}
                className="text-xl px-16 py-6"
              >
                {status === AppStatus.INTERACTING ? 'Confirming...' : 
                 status === AppStatus.GENERATING ? 'Dreaming...' : 
                 'Reveal Identity'}
              </Button>
              
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-600">
                <span>Contract</span>
                <span className="w-4 h-px bg-black"></span>
                <span className="bg-white px-2 py-0.5 border border-black rounded-sm">
                   {TARGET_CONTRACT_ADDRESS.slice(0, 6)}...{TARGET_CONTRACT_ADDRESS.slice(-4)}
                </span>
              </div>
            </div>

            {status === AppStatus.ERROR && (
              <div className="mt-8 p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black text-sm max-w-md mx-auto relative">
                 <div className="absolute -top-3 -left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold uppercase transform -rotate-3">Error</div>
                <p className="font-bold mb-1">Oops, something broke.</p>
                <p>{errorMsg}</p>
                <button onClick={resetFlow} className="mt-4 text-xs font-bold uppercase border-b border-black pb-0.5 hover:text-neutral-600">Try Again</button>
              </div>
            )}
            
            {(status === AppStatus.INTERACTING || status === AppStatus.GENERATING) && (
              <div className="mt-8 flex justify-center">
                 <div className="bg-white border border-black px-6 py-2 rounded-full flex items-center gap-3 shadow-lg">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></div>
                 </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-black/10">
         <div className="flex justify-center items-center gap-8 text-sm font-medium">
            <span className="hover:italic cursor-pointer">Celo Foundation</span>
            <span className="w-1 h-1 bg-black rounded-full"></span>
            <span className="hover:italic cursor-pointer">Builders</span>
            <span className="w-1 h-1 bg-black rounded-full"></span>
            <span className="hover:italic cursor-pointer">Ecosystem</span>
         </div>
         <p className="text-[10px] text-neutral-500 mt-4 uppercase tracking-widest">Powered by Dood</p>
      </footer>
    </div>
  );
};

export default App;