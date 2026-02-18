import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle, Shield, Loader2, Upload, Fingerprint } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DailySelfieModal = ({ isOpen, onClose, onVerified }) => {
  const [stream, setStream] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [selfieData, setSelfieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [faceTecAvailable, setFaceTecAvailable] = useState(false);
  const [checkingFaceTec, setCheckingFaceTec] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Check if FaceTec is available
  useEffect(() => {
    const checkFaceTec = async () => {
      try {
        const res = await axios.get(`${API}/facetec/config`);
        setFaceTecAvailable(res.data.configured === true);
      } catch {
        setFaceTecAvailable(false);
      }
      setCheckingFaceTec(false);
    };
    
    if (isOpen) {
      checkFaceTec();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSelfiePreview(null);
      setSelfieData(null);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Não foi possível acessar a câmera. Por favor, permita o acesso.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // Mirror the image for selfie
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setSelfieData(dataUrl);
      setSelfiePreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfieData(reader.result);
        setSelfiePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selfieData) {
      setError('Por favor, tire uma selfie primeiro');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`${API}/verification/daily-selfie`, {
        selfie: selfieData
      });
      onVerified();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao verificar selfie');
    }
    
    setLoading(false);
  };

  const retake = () => {
    setSelfiePreview(null);
    setSelfieData(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-white font-bold">Verificação Diária</h3>
              <p className="text-zinc-500 text-xs">Confirme sua identidade</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <p className="text-zinc-400 text-sm text-center mb-6">
            Para garantir a segurança dos clientes, tire uma selfie antes de ficar online.
          </p>

          {/* Camera / Preview Area */}
          <div className="relative bg-zinc-800 rounded-xl overflow-hidden mb-6 aspect-[4/3]">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : selfiePreview ? (
              <img
                src={selfiePreview}
                alt="Selfie Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-zinc-600 mb-4" />
                <p className="text-zinc-500 text-sm">Câmera não iniciada</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Action Buttons */}
          {!cameraActive && !selfiePreview && (
            <div className="flex gap-3 mb-4">
              <button
                onClick={startCamera}
                className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                data-testid="start-camera-btn"
              >
                <Camera className="w-5 h-5" />
                Abrir Câmera
              </button>
              <label className="flex-1 bg-zinc-700 text-white font-bold py-3 rounded-lg hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-5 h-5" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          )}

          {cameraActive && (
            <button
              onClick={capturePhoto}
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 mb-4"
              data-testid="capture-selfie-btn"
            >
              <Camera className="w-5 h-5" />
              Tirar Foto
            </button>
          )}

          {selfiePreview && !cameraActive && (
            <div className="flex gap-3 mb-4">
              <button
                onClick={retake}
                className="flex-1 bg-zinc-700 text-white font-bold py-3 rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Tirar Outra
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="confirm-selfie-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirmar
                  </>
                )}
              </button>
            </div>
          )}

          {/* Info */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-zinc-500 text-xs text-center">
              {faceTecAvailable ? (
                <>
                  <span className="text-green-400 font-medium flex items-center justify-center gap-1 mb-1">
                    <Fingerprint className="w-3 h-3" />
                    FaceTec disponível
                  </span>
                  Verificação biométrica avançada com prova de vida.
                </>
              ) : (
                <>
                  Sua selfie será comparada com a foto do seu documento para verificar sua identidade. 
                  Esta verificação é necessária uma vez por dia.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySelfieModal;
