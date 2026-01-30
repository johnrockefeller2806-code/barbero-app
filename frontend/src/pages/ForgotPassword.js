import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Phone, KeyRound, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const ForgotPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: phone, 2: code, 3: new password, 4: success
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Digite seu número de telefone');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.detail || 'Erro ao enviar código');
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), code })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message);
        setStep(3);
      } else {
        toast.error(data.detail || 'Código inválido');
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phone.trim(), 
          code, 
          new_password: newPassword 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message);
        setStep(4);
      } else {
        toast.error(data.detail || 'Erro ao alterar senha');
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full flex items-center justify-center">
            {step === 4 ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : step === 3 ? (
              <Lock className="w-8 h-8 text-white" />
            ) : step === 2 ? (
              <KeyRound className="w-8 h-8 text-white" />
            ) : (
              <Phone className="w-8 h-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {step === 4 ? 'Senha Alterada!' : 'Recuperar Senha'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Digite seu número de telefone cadastrado'}
            {step === 2 && 'Digite o código de 6 dígitos enviado por SMS'}
            {step === 3 && 'Crie uma nova senha para sua conta'}
            {step === 4 && 'Sua senha foi alterada com sucesso!'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex justify-center mb-6 gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    s <= step ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Phone */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (com DDD)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="text-lg"
                  data-testid="recovery-phone"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={loading}
                data-testid="send-code-btn"
              >
                {loading ? 'Enviando...' : 'Enviar Código SMS 📱'}
              </Button>
            </form>
          )}

          {/* Step 2: Code verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Verificação</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  data-testid="recovery-code"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={loading || code.length !== 6}
                data-testid="verify-code-btn"
              >
                {loading ? 'Verificando...' : 'Verificar Código ✅'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCode('');
                  setStep(1);
                }}
              >
                Reenviar código
              </Button>
            </form>
          )}

          {/* Step 3: New password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  data-testid="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  data-testid="confirm-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={loading}
                data-testid="reset-password-btn"
              >
                {loading ? 'Alterando...' : 'Alterar Senha 🔐'}
              </Button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="text-emerald-500 text-6xl">🎉</div>
              <p className="text-gray-600">
                Sua senha foi alterada com sucesso. Você já pode fazer login com a nova senha.
              </p>
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={() => navigate('/login')}
              >
                Ir para Login
              </Button>
            </div>
          )}

          {/* Back to login link */}
          {step < 4 && (
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
