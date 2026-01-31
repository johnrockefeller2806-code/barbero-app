import React from 'react';
import { Share2, MessageCircle, Twitter, Facebook, Instagram, Copy, Check, Gift } from 'lucide-react';
import { useState } from 'react';

const ShareButton = ({ text, referralCode, onShare }) => {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const fullText = referralCode 
    ? `${text}\n\nUse meu código ${referralCode} e ganhe €5!`
    : text;

  const encodedText = encodeURIComponent(fullText);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    if (onShare) onShare(platform);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
        data-testid="share-button"
      >
        <Share2 className="w-4 h-4" />
        Compartilhar
      </button>

      {showOptions && (
        <div className="absolute top-full mt-2 right-0 bg-zinc-800 rounded-xl p-4 shadow-xl border border-zinc-700 z-50 min-w-[280px]">
          <div className="text-white text-sm mb-3 font-medium">Compartilhar nas redes</div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-green-600 hover:bg-green-500 transition-colors"
              data-testid="share-whatsapp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-[10px] text-white">WhatsApp</span>
            </button>
            
            <button
              onClick={() => handleShare('twitter')}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-sky-500 hover:bg-sky-400 transition-colors"
              data-testid="share-twitter"
            >
              <Twitter className="w-5 h-5 text-white" />
              <span className="text-[10px] text-white">Twitter</span>
            </button>
            
            <button
              onClick={() => handleShare('facebook')}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
              data-testid="share-facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
              <span className="text-[10px] text-white">Facebook</span>
            </button>
            
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
              data-testid="share-copy"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-white" />
              )}
              <span className="text-[10px] text-white">{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {referralCode && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-500 text-sm mb-1">
                <Gift className="w-4 h-4" />
                <span className="font-medium">Código de indicação</span>
              </div>
              <div className="text-white font-mono text-lg">{referralCode}</div>
              <div className="text-zinc-400 text-xs mt-1">
                Ganhe €5 para cada amigo que se cadastrar!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareButton;
