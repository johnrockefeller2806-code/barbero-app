import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, RotateCcw } from 'lucide-react';

const SignatureCanvas = ({ onSignatureComplete, width = 400, height = 200 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.strokeStyle = '#F59E0B'; // Amber color
      context.lineWidth = 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      setCtx(context);
      
      // Fill with dark background
      context.fillStyle = '#18181B';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault();
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctx.fillStyle = '#18181B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#F59E0B';
    setHasSignature(false);
    onSignatureComplete(null);
  };

  const saveSignature = () => {
    if (!hasSignature) return;
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    onSignatureComplete(signatureData);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full border-2 border-zinc-700 rounded-lg cursor-crosshair touch-none"
          style={{ maxWidth: '100%', height: 'auto', aspectRatio: `${width}/${height}` }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          data-testid="signature-canvas"
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-zinc-500 text-sm">Assine aqui com o dedo ou mouse</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button
          type="button"
          onClick={clearCanvas}
          className="flex-1 bg-zinc-800 text-zinc-300 py-3 rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
          data-testid="clear-signature-btn"
        >
          <RotateCcw className="w-4 h-4" />
          Limpar
        </button>
        <button
          type="button"
          onClick={saveSignature}
          disabled={!hasSignature}
          className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          data-testid="confirm-signature-btn"
        >
          <Check className="w-4 h-4" />
          Confirmar Assinatura
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
