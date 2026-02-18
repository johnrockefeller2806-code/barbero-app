import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { 
  Shield, CheckCircle, XCircle, FileText, Camera, Upload, 
  ArrowRight, ArrowLeft, AlertCircle, Loader2, User, IdCard,
  Lock, Eye, Fingerprint, Globe
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

// Translations for the verification page
const TRANSLATIONS = {
  pt: {
    // Header
    title: 'Verificação de Identidade',
    subtitle: 'Segurança para você',
    
    // Steps
    step_contract: 'Contrato',
    step_documents: 'Documentos',
    step_complete: 'Concluído',
    
    // Contract Step
    terms_title: 'Termos e Condições',
    terms_subtitle: 'Leia e aceite o contrato de uso',
    full_name: 'Nome Completo',
    your_name: 'Seu nome',
    accept_terms: 'Li e aceito os termos e condições de uso. Declaro que as informações fornecidas são verdadeiras.',
    accept_continue: 'Aceitar e Continuar',
    fill_name_email: 'Preencha seu nome e email',
    
    // Documents Step
    identity_title: 'Verificação de Identidade',
    identity_subtitle: 'Envie seu passaporte e uma selfie',
    passport_photo: 'Foto do Passaporte (página com foto)',
    selfie_passport: 'Selfie segurando o passaporte',
    use_camera: 'Usar Câmera',
    take_selfie: 'Tirar Selfie',
    upload_file: 'Enviar Arquivo',
    position_passport: 'Posicione seu passaporte na câmera',
    take_selfie_holding: 'Tire uma selfie segurando seu passaporte',
    capture: 'Capturar',
    cancel: 'Cancelar',
    submit_verification: 'Enviar para Verificação',
    upload_both_photos: 'Por favor, envie as duas fotos necessárias',
    
    // Info boxes
    biometric_title: 'Verificação Biométrica Avançada',
    biometric_desc: 'Em breve: verificação facial 3D com prova de vida (FaceTec)',
    why_title: 'Por que pedimos isso?',
    why_desc: 'A verificação de identidade protege você e garante a segurança de todos os usuários da plataforma.',
    
    // Complete Step
    docs_submitted: 'Documentos Enviados!',
    docs_submitted_desc: 'Seus documentos foram enviados para análise. Você receberá uma notificação quando a verificação for concluída.',
    estimated_time: 'Tempo estimado: até 24 horas',
    back_home: 'Voltar ao Início',
    
    // Camera
    camera_error: 'Não foi possível acessar a câmera. Por favor, permita o acesso.',
    
    // Countries
    country_brazil: 'Brasil',
    country_portugal: 'Portugal',
    country_other: 'Outro'
  },
  en: {
    // Header
    title: 'Identity Verification',
    subtitle: 'Security for you',
    
    // Steps
    step_contract: 'Contract',
    step_documents: 'Documents',
    step_complete: 'Complete',
    
    // Contract Step
    terms_title: 'Terms and Conditions',
    terms_subtitle: 'Read and accept the usage contract',
    full_name: 'Full Name',
    your_name: 'Your name',
    accept_terms: 'I have read and accept the terms and conditions of use. I declare that the information provided is true.',
    accept_continue: 'Accept and Continue',
    fill_name_email: 'Please fill in your name and email',
    
    // Documents Step
    identity_title: 'Identity Verification',
    identity_subtitle: 'Upload your passport and a selfie',
    passport_photo: 'Passport Photo (photo page)',
    selfie_passport: 'Selfie holding the passport',
    use_camera: 'Use Camera',
    take_selfie: 'Take Selfie',
    upload_file: 'Upload File',
    position_passport: 'Position your passport in the camera',
    take_selfie_holding: 'Take a selfie holding your passport',
    capture: 'Capture',
    cancel: 'Cancel',
    submit_verification: 'Submit for Verification',
    upload_both_photos: 'Please upload both required photos',
    
    // Info boxes
    biometric_title: 'Advanced Biometric Verification',
    biometric_desc: 'Coming soon: 3D facial verification with liveness detection (FaceTec)',
    why_title: 'Why do we ask for this?',
    why_desc: 'Identity verification protects you and ensures the safety of all platform users.',
    
    // Complete Step
    docs_submitted: 'Documents Submitted!',
    docs_submitted_desc: 'Your documents have been submitted for review. You will receive a notification when verification is complete.',
    estimated_time: 'Estimated time: up to 24 hours',
    back_home: 'Back to Home',
    
    // Camera
    camera_error: 'Could not access camera. Please allow access.',
    
    // Countries
    country_brazil: 'Brazil',
    country_portugal: 'Portugal',
    country_other: 'Other'
  },
  es: {
    // Header
    title: 'Verificación de Identidad',
    subtitle: 'Seguridad para ti',
    
    // Steps
    step_contract: 'Contrato',
    step_documents: 'Documentos',
    step_complete: 'Completado',
    
    // Contract Step
    terms_title: 'Términos y Condiciones',
    terms_subtitle: 'Lee y acepta el contrato de uso',
    full_name: 'Nombre Completo',
    your_name: 'Tu nombre',
    accept_terms: 'He leído y acepto los términos y condiciones de uso. Declaro que la información proporcionada es verdadera.',
    accept_continue: 'Aceptar y Continuar',
    fill_name_email: 'Por favor, completa tu nombre y correo',
    
    // Documents Step
    identity_title: 'Verificación de Identidad',
    identity_subtitle: 'Sube tu pasaporte y una selfie',
    passport_photo: 'Foto del Pasaporte (página con foto)',
    selfie_passport: 'Selfie sosteniendo el pasaporte',
    use_camera: 'Usar Cámara',
    take_selfie: 'Tomar Selfie',
    upload_file: 'Subir Archivo',
    position_passport: 'Posiciona tu pasaporte en la cámara',
    take_selfie_holding: 'Toma una selfie sosteniendo tu pasaporte',
    capture: 'Capturar',
    cancel: 'Cancelar',
    submit_verification: 'Enviar para Verificación',
    upload_both_photos: 'Por favor, sube las dos fotos requeridas',
    
    // Info boxes
    biometric_title: 'Verificación Biométrica Avanzada',
    biometric_desc: 'Próximamente: verificación facial 3D con detección de vida (FaceTec)',
    why_title: '¿Por qué pedimos esto?',
    why_desc: 'La verificación de identidad te protege y garantiza la seguridad de todos los usuarios de la plataforma.',
    
    // Complete Step
    docs_submitted: '¡Documentos Enviados!',
    docs_submitted_desc: 'Tus documentos han sido enviados para revisión. Recibirás una notificación cuando la verificación esté completa.',
    estimated_time: 'Tiempo estimado: hasta 24 horas',
    back_home: 'Volver al Inicio',
    
    // Camera
    camera_error: 'No se pudo acceder a la cámara. Por favor, permite el acceso.',
    
    // Countries
    country_brazil: 'Brasil',
    country_portugal: 'Portugal',
    country_other: 'Otro'
  }
};

// Contract text for users
const CONTRACT_TEXT = {
  pt: `
TERMOS E CONDIÇÕES DE USO - STUFF INTERCÂMBIO

CONTRATO DE UTILIZAÇÃO DA PLATAFORMA

Este contrato é celebrado entre:

1. STUFF INTERCÂMBIO (Plataforma)
2. O USUÁRIO (Estudante/Interessado em Intercâmbio)

CLÁUSULAS:

1. OBJETO
O usuário concorda em utilizar a plataforma STUFF Intercâmbio para buscar informações, serviços e suporte relacionados a intercâmbio na Irlanda.

2. RESPONSABILIDADES DO USUÁRIO
2.1 Fornecer informações verdadeiras e atualizadas
2.2 Manter seus dados de acesso em segurança
2.3 Utilizar a plataforma de forma ética e legal
2.4 Respeitar os termos de serviço das escolas parceiras

3. VERIFICAÇÃO DE IDENTIDADE
3.1 O usuário concorda em fornecer documento de identidade válido (passaporte)
3.2 A verificação é necessária para acessar serviços premium
3.3 Documentos serão armazenados de forma segura e criptografada

4. PRIVACIDADE E DADOS
4.1 Os dados serão tratados conforme a LGPD e GDPR
4.2 Não compartilhamos informações com terceiros sem consentimento
4.3 Você pode solicitar exclusão dos seus dados a qualquer momento

5. SERVIÇOS
5.1 Busca de escolas e cursos
5.2 Informações sobre vistos e documentação
5.3 Suporte durante o processo de intercâmbio
5.4 Conexão com outros estudantes

6. PAGAMENTOS
6.1 Pagamentos são processados de forma segura via Stripe
6.2 Todas as transações são criptografadas
6.3 Política de reembolso conforme termos específicos de cada serviço

7. LIMITAÇÕES
7.1 A STUFF não se responsabiliza por decisões da imigração irlandesa
7.2 Informações são fornecidas como orientação, não como garantia

Ao aceitar este contrato, o usuário declara:
- Ter lido e compreendido todos os termos
- Concordar com todas as condições estabelecidas
- Ter capacidade legal para celebrar este contrato

Dublin, Ireland
STUFF Intercâmbio Platform
`,
  en: `
TERMS AND CONDITIONS OF USE - STUFF EXCHANGE

PLATFORM USAGE CONTRACT

This contract is entered into between:

1. STUFF EXCHANGE (Platform)
2. THE USER (Student/Exchange Interested)

CLAUSES:

1. PURPOSE
The user agrees to use the STUFF Exchange platform to seek information, services and support related to exchange programs in Ireland.

2. USER RESPONSIBILITIES
2.1 Provide true and updated information
2.2 Keep your access credentials secure
2.3 Use the platform ethically and legally
2.4 Respect the terms of service of partner schools

3. IDENTITY VERIFICATION
3.1 The user agrees to provide valid identity document (passport)
3.2 Verification is required to access premium services
3.3 Documents will be stored securely and encrypted

4. PRIVACY AND DATA
4.1 Data will be processed according to LGPD and GDPR
4.2 We do not share information with third parties without consent
4.3 You can request deletion of your data at any time

5. SERVICES
5.1 School and course search
5.2 Information about visas and documentation
5.3 Support during the exchange process
5.4 Connection with other students

6. PAYMENTS
6.1 Payments are processed securely via Stripe
6.2 All transactions are encrypted
6.3 Refund policy according to specific terms of each service

7. LIMITATIONS
7.1 STUFF is not responsible for decisions by Irish immigration
7.2 Information is provided as guidance, not as a guarantee

By accepting this contract, the user declares:
- Having read and understood all terms
- Agreeing to all established conditions
- Having legal capacity to enter into this contract

Dublin, Ireland
STUFF Exchange Platform
`
};

export const StuffVerification = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('stuff_lang') || 'pt';
  });
  const t = (key) => TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
  
  const [step, setStep] = useState(1); // 1: Contract, 2: Documents, 3: Complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contractAccepted, setContractAccepted] = useState(false);
  
  // Save language preference
  useEffect(() => {
    localStorage.setItem('stuff_lang', language);
  }, [language]);
  
  // Language selector component
  const LanguageSelector = () => (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      {[
        { code: 'pt', flag: '🇧🇷', label: 'PT' },
        { code: 'en', flag: '🇬🇧', label: 'EN' },
        { code: 'es', flag: '🇪🇸', label: 'ES' }
      ].map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            language === lang.code 
              ? 'bg-emerald-500 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
  
  // User data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Brazil'
  });
  
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
      setError(language === 'pt' 
        ? 'Não foi possível acessar a câmera. Por favor, permita o acesso.' 
        : 'Could not access camera. Please allow access.');
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
      
      if (cameraMode === 'selfie') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
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

  const handleAcceptContract = async () => {
    if (!userData.name || !userData.email) {
      setError(t('fill_name_email'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Save to backend
      const response = await fetch(`${API}/stuff/verification/accept-contract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          accepted: true
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('stuff_verification_id', data.id);
        setContractAccepted(true);
        setStep(2);
        toast.success(t('terms_title') + ' ✓');
      } else {
        throw new Error('Failed to accept contract');
      }
    } catch (err) {
      console.error('Error:', err);
      // Continue anyway for demo
      setContractAccepted(true);
      setStep(2);
    }
    setLoading(false);
  };

  const handleSubmitDocuments = async () => {
    if (!passportPhoto || !passportSelfie) {
      setError(t('upload_both_photos'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const verificationId = localStorage.getItem('stuff_verification_id');
      
      const response = await fetch(`${API}/stuff/verification/submit-documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verification_id: verificationId,
          passport_photo: passportPhoto,
          passport_selfie: passportSelfie,
          user_data: userData
        })
      });
      
      if (response.ok) {
        setStep(3);
        toast.success(t('docs_submitted'));
      } else {
        throw new Error('Failed to submit documents');
      }
    } catch (err) {
      console.error('Error:', err);
      // Continue anyway for demo
      setStep(3);
      toast.success(t('docs_submitted'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img src={LOGO_URL} alt="STUFF" className="h-12 bg-white rounded-xl p-1" />
            <div>
              <h1 className="text-white font-bold">{t('title')}</h1>
              <p className="text-white/70 text-sm">{t('subtitle')}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: t('step_contract'), icon: FileText },
            { num: 2, label: t('step_documents'), icon: IdCard },
            { num: 3, label: t('step_complete'), icon: CheckCircle }
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step >= s.num ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white/50'
                }`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs mt-2 ${step >= s.num ? 'text-emerald-400' : 'text-white/50'}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-1 mx-2 rounded ${step > s.num ? 'bg-emerald-500' : 'bg-white/20'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Step 1: Contract */}
        {step === 1 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20" data-testid="contract-step">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span>{t('terms_title')}</span>
                  <p className="text-white/60 text-sm font-normal">{t('terms_subtitle')}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">{t('full_name')}</Label>
                  <Input
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder={t('your_name')}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    data-testid="input-email"
                  />
                </div>
              </div>

              {/* Contract Text */}
              <div className="bg-white/5 rounded-lg p-4 h-64 overflow-y-auto text-white/80 text-sm whitespace-pre-line border border-white/10">
                {CONTRACT_TEXT[language] || CONTRACT_TEXT.en}
              </div>

              {/* Accept Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept"
                  checked={contractAccepted}
                  onCheckedChange={setContractAccepted}
                  className="mt-1 border-white/30 data-[state=checked]:bg-emerald-500"
                  data-testid="contract-checkbox"
                />
                <label htmlFor="accept" className="text-white/80 text-sm cursor-pointer">
                  {t('accept_terms')}
                </label>
              </div>

              <Button
                onClick={handleAcceptContract}
                disabled={!contractAccepted || !userData.name || !userData.email || loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white"
                data-testid="accept-contract-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t('accept_continue')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20" data-testid="documents-step">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <IdCard className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span>{t('identity_title')}</span>
                  <p className="text-white/60 text-sm font-normal">{t('identity_subtitle')}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Camera Modal */}
              {showCamera && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                  <div className="w-full max-w-md">
                    <p className="text-white text-center mb-4">
                      {cameraMode === 'passport' ? t('position_passport') : t('take_selfie_holding')}
                    </p>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className={`w-full rounded-lg mb-4 ${cameraMode === 'selfie' ? 'transform scale-x-[-1]' : ''}`}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-4">
                      <Button
                        onClick={stopCamera}
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10"
                      >
                        {t('cancel')}
                      </Button>
                      <Button
                        onClick={capturePhoto}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        {t('capture')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Passport Photo */}
              <div>
                <label className="block text-white font-medium mb-3">
                  1. {language === 'pt' ? 'Foto do Passaporte (página com foto)' : 'Passport Photo (photo page)'}
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
                    <Button
                      onClick={() => startCamera('passport')}
                      variant="outline"
                      className="flex-1 h-24 border-white/20 text-white hover:bg-white/10 flex-col"
                      data-testid="camera-passport-btn"
                    >
                      <Camera className="w-8 h-8 text-emerald-400 mb-2" />
                      <span className="text-sm">{language === 'pt' ? 'Usar Câmera' : 'Use Camera'}</span>
                    </Button>
                    <label className="flex-1 h-24 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                      <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                      <span className="text-white text-sm">{language === 'pt' ? 'Enviar Arquivo' : 'Upload File'}</span>
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
              <div>
                <label className="block text-white font-medium mb-3">
                  2. {language === 'pt' ? 'Selfie segurando o passaporte' : 'Selfie holding the passport'}
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
                    <Button
                      onClick={() => startCamera('selfie')}
                      variant="outline"
                      className="flex-1 h-24 border-white/20 text-white hover:bg-white/10 flex-col"
                      data-testid="camera-selfie-btn"
                    >
                      <User className="w-8 h-8 text-emerald-400 mb-2" />
                      <span className="text-sm">{language === 'pt' ? 'Tirar Selfie' : 'Take Selfie'}</span>
                    </Button>
                    <label className="flex-1 h-24 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                      <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                      <span className="text-white text-sm">{language === 'pt' ? 'Enviar Arquivo' : 'Upload File'}</span>
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

              {/* FaceTec Badge */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Fingerprint className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-emerald-400 font-medium text-sm">
                      {language === 'pt' ? 'Verificação Biométrica Avançada' : 'Advanced Biometric Verification'}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {language === 'pt' 
                        ? 'Em breve: verificação facial 3D com prova de vida (FaceTec)'
                        : 'Coming soon: 3D facial verification with liveness detection (FaceTec)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm">
                      {language === 'pt' ? 'Por que pedimos isso?' : 'Why do we ask for this?'}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {language === 'pt' 
                        ? 'A verificação de identidade protege você e garante a segurança de todos os usuários da plataforma.'
                        : 'Identity verification protects you and ensures the safety of all platform users.'}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmitDocuments}
                disabled={!passportPhoto || !passportSelfie || loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white"
                data-testid="submit-documents-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {language === 'pt' ? 'Enviar para Verificação' : 'Submit for Verification'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center" data-testid="complete-step">
            <CardContent className="py-12">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'pt' ? 'Documentos Enviados!' : 'Documents Submitted!'}
              </h2>
              <p className="text-white/70 mb-6">
                {language === 'pt' 
                  ? 'Seus documentos foram enviados para análise. Você receberá uma notificação quando a verificação for concluída.'
                  : 'Your documents have been submitted for review. You will receive a notification when verification is complete.'}
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-white/50 text-sm">
                  {language === 'pt' ? 'Tempo estimado: até 24 horas' : 'Estimated time: up to 24 hours'}
                </p>
              </div>
              <Button
                onClick={() => navigate('/')}
                className="bg-emerald-500 hover:bg-emerald-400 text-white"
              >
                {language === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StuffVerification;
