import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPWA = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    
    if (isStandalone) {
      return; // Already installed
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt for iOS after delay
    if (isIOSDevice) {
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-zinc-900 border border-amber-500/50 rounded-lg shadow-2xl z-50 animate-slide-up">
        <div className="p-4">
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-white font-bold">Instalar ClickBarber</h3>
              <p className="text-zinc-400 text-sm">Acesso rápido pelo celular</p>
            </div>
          </div>
          
          <button
            onClick={handleInstall}
            className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
          >
            <Download className="w-5 h-5" />
            {isIOS ? 'Como Instalar' : 'Instalar App'}
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-t-2xl w-full max-w-md p-6 animate-slide-up">
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Instalar no iPhone/iPad
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                <p className="text-zinc-300">Toque no ícone <span className="text-amber-500 font-bold">Compartilhar</span> (quadrado com seta)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">2</div>
                <p className="text-zinc-300">Role e toque em <span className="text-amber-500 font-bold">"Adicionar à Tela de Início"</span></p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">3</div>
                <p className="text-zinc-300">Toque em <span className="text-amber-500 font-bold">"Adicionar"</span> no canto superior direito</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full bg-zinc-800 text-white py-3 rounded-lg mt-6 hover:bg-zinc-700 transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default InstallPWA;
