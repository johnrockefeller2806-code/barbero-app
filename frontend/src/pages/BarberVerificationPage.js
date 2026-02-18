import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Shield, CheckCircle, XCircle, FileText, Camera, Upload, 
  ArrowRight, AlertCircle, Loader2, User, IdCard, PenTool, Mail
} from 'lucide-react';
import SignatureCanvas from '../components/SignatureCanvas';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

const BarberVerificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Contract, 2: Signature, 3: Documents, 4: Complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [contractText, setContractText] = useState('');
  const [contractRead, setContractRead] = useState(false);
  const [signature, setSignature] = useState(null);
  const [signerName, setSignerName] = useState('');
  
  // Document uploads
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [passportSelfie, setPassportSelfie] = useState(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState(null);
  const [passportSelfiePreview, setPassportSelfiePreview] = useState(null);
  
  // Camera refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState(null);
  const [stream, setStream] = useState(null);

  // Fetch verification status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API}/verification/status`);
        setVerificationStatus(res.data);
        
        // Determine step based on status
        if (res.data.contract_accepted && res.data.documents_submitted) {
          setStep(4);
        } else if (res.data.contract_accepted) {
          setStep(3);
        }
      } catch (err) {
        console.error('Error fetching status:', err);
      }
    };
    fetchStatus();
  }, []);

  // Set signer name from user
  useEffect(() => {
    if (user?.name) {
      setSignerName(user.name);
    }
  }, [user]);

  // Fetch contract text
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await axios.get(`${API}/verification/contract`);
        setContractText(res.data.contract_text);
      } catch (err) {
        console.error('Error fetching contract:', err);
      }
    };
    fetchContract();
  }, []);

  // Clean up camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async (mode) => {
    try {
      setCameraMode(mode);
      setShowCamera(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode === 'selfie' ? 'user' : 'environment', width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Não foi possível acessar a câmera. Por favor, permita o acesso.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      if (cameraMode === 'passport') {
        setPassportPhoto(dataUrl);
        setPassportPhotoPreview(dataUrl);
      } else {
        setPassportSelfie(dataUrl);
        setPassportSelfiePreview(dataUrl);
      }
      
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraMode(null);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'passport') {
          setPassportPhoto(reader.result);
          setPassportPhotoPreview(reader.result);
        } else {
          setPassportSelfie(reader.result);
          setPassportSelfiePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignContract = async () => {
    if (!signature) {
      setError('Por favor, assine o contrato antes de continuar');
      return;
    }
    if (!signerName.trim()) {
      setError('Por favor, digite seu nome completo');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/verification/accept-contract`, { 
        accepted: true,
        signature: signature,
        signer_name: signerName
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao assinar contrato');
    }
    setLoading(false);
  };

  const handleSubmitDocuments = async () => {
    if (!passportPhoto || !passportSelfie) {
      setError('Por favor, envie as duas fotos necessárias');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/verification/submit-documents`, {
        passport_photo: passportPhoto,
        passport_selfie: passportSelfie
      });
      setStep(4);
      // Refresh status
      const res = await axios.get(`${API}/verification/status`);
      setVerificationStatus(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao enviar documentos');
    }
    setLoading(false);
  };

  // Redirect if already verified
  if (verificationStatus?.status === 'verified') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Você está Verificado!</h2>
          <p className="text-zinc-400 mb-6">Sua conta foi verificada com sucesso. Você pode acessar o dashboard.</p>
          <button
            onClick={() => navigate('/barber')}
            className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition-colors"
            data-testid="go-to-dashboard-btn"
          >
            Ir para Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show rejected status
  if (verificationStatus?.status === 'rejected') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verificação Rejeitada</h2>
          <p className="text-zinc-400 mb-4">Infelizmente sua verificação foi rejeitada.</p>
          {verificationStatus.verification_notes && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{verificationStatus.verification_notes}</p>
            </div>
          )}
          <p className="text-zinc-500 text-sm mb-6">Entre em contato com o suporte para mais informações.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-zinc-700 text-white font-bold py-4 rounded-lg hover:bg-zinc-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <img src={LOGO_URL} alt="ClickBarber" className="h-10" />
          <div>
            <h1 className="text-white font-bold">Verificação de Barbeiro</h1>
            <p className="text-zinc-500 text-sm">Segurança para você e seus clientes</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: 'Contrato', icon: FileText },
            { num: 2, label: 'Assinatura', icon: PenTool },
            { num: 3, label: 'Documentos', icon: IdCard },
            { num: 4, label: 'Concluído', icon: CheckCircle }
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                  step >= s.num ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${step >= s.num ? 'text-amber-500' : 'text-zinc-500'}`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded ${step > s.num ? 'bg-amber-500' : 'bg-zinc-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Step 1: Read Contract */}
        {step === 1 && (
          <div className="bg-zinc-900 rounded-2xl p-6" data-testid="contract-step">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Contrato de Serviço</h2>
                <p className="text-zinc-500 text-sm">Leia o contrato antes de assinar</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 h-80 overflow-y-auto mb-6 text-zinc-300 text-sm whitespace-pre-line">
              {contractText}
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={contractRead}
                onChange={(e) => setContractRead(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                data-testid="contract-read-checkbox"
              />
              <span className="text-zinc-300 text-sm">
                Li e compreendi todos os termos e condições do contrato de prestação de serviços.
              </span>
            </label>

            <button
              onClick={() => setStep(2)}
              disabled={!contractRead}
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="proceed-to-signature-btn"
            >
              Continuar para Assinatura
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Electronic Signature */}
        {step === 2 && (
          <div className="bg-zinc-900 rounded-2xl p-6" data-testid="signature-step">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <PenTool className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Assinatura Eletrônica</h2>
                <p className="text-zinc-500 text-sm">Assine digitalmente o contrato</p>
              </div>
            </div>

            {/* Signer Name Input */}
            <div className="mb-6">
              <label className="block text-zinc-300 font-medium mb-2">
                Nome Completo (como no documento)
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500"
                data-testid="signer-name-input"
              />
            </div>

            {/* Signature Canvas */}
            <div className="mb-6">
              <label className="block text-zinc-300 font-medium mb-3">
                Sua Assinatura
              </label>
              <SignatureCanvas 
                onSignatureComplete={(sig) => setSignature(sig)}
                width={400}
                height={180}
              />
            </div>

            {/* Signature Preview */}
            {signature && (
              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <p className="text-zinc-500 text-sm mb-2">Prévia da assinatura:</p>
                <div className="bg-zinc-900 p-3 rounded-lg inline-block">
                  <img src={signature} alt="Assinatura" className="max-h-20" />
                </div>
              </div>
            )}

            {/* Legal Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-amber-500 font-medium text-sm">Validade Legal</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    Sua assinatura eletrônica tem validade legal conforme o Regulamento eIDAS da União Europeia. 
                    Registramos a data, hora e endereço IP para garantir a autenticidade.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Notice */}
            <div className="bg-zinc-800 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
              <p className="text-zinc-400 text-sm">
                Após assinar, você receberá uma cópia do contrato assinado no email <strong className="text-white">{user?.email}</strong>
              </p>
            </div>

            <button
              onClick={handleSignContract}
              disabled={!signature || !signerName.trim() || loading}
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="sign-contract-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Assinar Contrato
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="bg-zinc-900 rounded-2xl p-6" data-testid="documents-step">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <IdCard className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Verificação de Identidade</h2>
                <p className="text-zinc-500 text-sm">Envie seu passaporte e uma selfie</p>
              </div>
            </div>

            {/* Success Message for Contract */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-400 text-sm">
                  Contrato assinado com sucesso! Uma cópia foi enviada para seu email.
                </p>
              </div>
            </div>

            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                  <p className="text-white text-center mb-4">
                    {cameraMode === 'passport' 
                      ? 'Posicione seu passaporte na câmera'
                      : 'Tire uma selfie segurando seu passaporte'}
                  </p>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg mb-4"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-4">
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-zinc-700 text-white py-3 rounded-lg hover:bg-zinc-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-amber-500 text-black py-3 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Capturar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Passport Photo */}
            <div className="mb-6">
              <label className="block text-zinc-300 font-medium mb-3">
                1. Foto do Passaporte (página com foto)
              </label>
              {passportPhotoPreview ? (
                <div className="relative">
                  <img
                    src={passportPhotoPreview}
                    alt="Passport"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => { setPassportPhoto(null); setPassportPhotoPreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => startCamera('passport')}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-6 text-center hover:border-amber-500 transition-colors"
                    data-testid="camera-passport-btn"
                  >
                    <Camera className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <span className="text-zinc-300 text-sm">Usar Câmera</span>
                  </button>
                  <label className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-6 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <span className="text-zinc-300 text-sm">Enviar Arquivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'passport')}
                      data-testid="upload-passport-input"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Selfie with Passport */}
            <div className="mb-6">
              <label className="block text-zinc-300 font-medium mb-3">
                2. Selfie segurando o passaporte
              </label>
              {passportSelfiePreview ? (
                <div className="relative">
                  <img
                    src={passportSelfiePreview}
                    alt="Selfie with Passport"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => { setPassportSelfie(null); setPassportSelfiePreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => startCamera('selfie')}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-6 text-center hover:border-amber-500 transition-colors"
                    data-testid="camera-selfie-btn"
                  >
                    <User className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <span className="text-zinc-300 text-sm">Tirar Selfie</span>
                  </button>
                  <label className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-6 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <span className="text-zinc-300 text-sm">Enviar Arquivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'selfie')}
                      data-testid="upload-selfie-input"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-amber-500 font-medium text-sm">Por que pedimos isso?</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    A verificação de identidade protege você e seus clientes, especialmente em atendimentos domiciliares. Seus documentos são armazenados de forma segura.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitDocuments}
              disabled={!passportPhoto || !passportSelfie || loading}
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="submit-documents-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enviar para Verificação
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 4: Under Review / Complete */}
        {step === 4 && (
          <div className="bg-zinc-900 rounded-2xl p-6 text-center" data-testid="review-step">
            {verificationStatus?.status === 'under_review' ? (
              <>
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Em Análise</h2>
                <p className="text-zinc-400 mb-6">
                  Seus documentos foram enviados e estão sendo analisados. 
                  Você receberá um email quando a verificação for concluída.
                </p>
                <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                  <p className="text-zinc-500 text-sm">Tempo estimado: até 24 horas</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5 text-amber-500" />
                    <p className="text-amber-500 text-sm">
                      Enviamos um email de confirmação para {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/barber')}
                  className="w-full bg-zinc-700 text-white font-bold py-4 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Voltar ao Dashboard
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verificação Concluída!</h2>
                <p className="text-zinc-400 mb-6">
                  Parabéns! Sua conta foi verificada com sucesso. 
                  Você agora pode atender clientes em domicílio.
                </p>
                <button
                  onClick={() => navigate('/barber')}
                  className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Ir para Dashboard
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberVerificationPage;
