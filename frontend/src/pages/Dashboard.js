import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import {
  ShamrockIcon,
  HarpIcon,
  WavePattern,
  FourLeafClover
} from '../components/IrishVectors';
import { 
  GraduationCap, 
  Calendar, 
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Star,
  FileText,
  Bus,
  Shield,
  MessageCircle,
  Euro,
  MapPin,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, isPlusUser } = useAuth();
  const { t, language } = useLanguage();
  
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      fetchEnrollments();
    }
  }, [isAuthenticated, authLoading]);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(`${API}/enrollments`);
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (enrollment) => {
    setProcessingPayment(enrollment.id);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        enrollment_id: enrollment.id,
        origin_url: window.location.origin
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error creating payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: t('dashboard_status_pending'),
        className: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock
      },
      paid: {
        label: t('dashboard_status_paid'),
        className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle
      },
      confirmed: {
        label: t('dashboard_status_confirmed'),
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle
      },
      cancelled: {
        label: language === 'pt' ? 'Cancelado' : 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} gap-1 border`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const quickActions = [
    { icon: GraduationCap, label: language === 'pt' ? 'Escolas' : 'Schools', href: '/schools', color: 'from-emerald-500 to-emerald-600' },
    { icon: Bus, label: language === 'pt' ? 'Transporte' : 'Transport', href: '/transport', color: 'from-blue-500 to-blue-600' },
    { icon: FileText, label: language === 'pt' ? 'Documentos' : 'Documents', href: '/services', color: 'from-purple-500 to-purple-600' },
    { icon: MessageCircle, label: language === 'pt' ? 'Comunidade' : 'Community', href: '/chat', color: 'from-teal-500 to-teal-600' },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50" data-testid="dashboard-loading">
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Skeleton className="h-12 w-64 mb-4 bg-white/20" />
            <Skeleton className="h-6 w-96 bg-white/20" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="dashboard-page">
      {/* Hero Header - Ireland Theme */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <ShamrockIcon className="absolute -top-10 -left-10 w-48 h-48 text-emerald-700/20 rotate-12" />
          <ShamrockIcon className="absolute top-10 right-20 w-32 h-32 text-emerald-600/10 -rotate-12" />
          <FourLeafClover className="absolute bottom-20 right-10 w-24 h-24 text-amber-500/10" />
          <HarpIcon className="absolute bottom-10 left-20 w-20 h-28 text-amber-500/10" />
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 pb-24">
          <div className="flex items-center justify-between">
            <div>
              {/* Greeting */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-200 text-sm mb-4">
                <ShamrockIcon className="h-4 w-4" />
                {language === 'pt' ? 'Bem-vindo de volta!' : 'Welcome back!'}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2" data-testid="dashboard-title">
                {language === 'pt' ? 'Olá, ' : 'Hello, '}
                <span className="text-amber-400">{user?.name?.split(' ')[0]}!</span>
              </h1>
              <p className="text-emerald-100/90 text-lg">
                {language === 'pt' ? 'Gerencie suas matrículas e acompanhe sua jornada na Irlanda' : 'Manage your enrollments and track your journey in Ireland'}
              </p>

              {/* PLUS Badge */}
              {isPlusUser && (
                <div className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg">
                  <Star className="h-4 w-4 fill-white" />
                  STUFF PLUS
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Wave Transition */}
        <WavePattern className="absolute bottom-0 left-0 right-0 text-gray-50 h-16" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-white overflow-hidden group hover:-translate-y-1 transition-all" data-testid="stat-enrollments">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600" />
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{t('dashboard_enrollments')}</p>
                <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white overflow-hidden group hover:-translate-y-1 transition-all" data-testid="stat-pending">
            <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{language === 'pt' ? 'Pendentes' : 'Pending'}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'pending').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white overflow-hidden group hover:-translate-y-1 transition-all" data-testid="stat-paid">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{language === 'pt' ? 'Confirmados' : 'Confirmed'}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'paid' || e.status === 'confirmed').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShamrockIcon className="h-5 w-5 text-emerald-600" />
            {language === 'pt' ? 'Acesso Rápido' : 'Quick Access'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.href}>
                <Card className="border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* PLUS Promo (if not plus user) */}
        {!isPlusUser && (
          <Card className="border-0 shadow-xl mb-8 overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    STUFF PLUS
                    <Sparkles className="h-5 w-5" />
                  </h3>
                  <p className="text-amber-100">
                    {language === 'pt' 
                      ? 'Desbloqueie benefícios exclusivos por apenas €49,90' 
                      : 'Unlock exclusive benefits for just €49.90'}
                  </p>
                </div>
              </div>
              <Link to="/plus">
                <Button className="bg-white text-amber-600 hover:bg-amber-50 font-semibold shadow-lg">
                  {language === 'pt' ? 'Conhecer' : 'Learn More'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Enrollments List */}
        <Card className="border-0 shadow-xl overflow-hidden" data-testid="enrollments-card">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-white to-amber-500" />
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              {t('dashboard_enrollments')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {enrollments.length === 0 ? (
              <div className="text-center py-16" data-testid="no-enrollments">
                <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === 'pt' ? 'Nenhuma matrícula ainda' : 'No enrollments yet'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {language === 'pt' 
                    ? 'Comece sua jornada na Irlanda! Explore nossas escolas parceiras e encontre o curso ideal para você.'
                    : 'Start your journey in Ireland! Explore our partner schools and find the ideal course for you.'}
                </p>
                <Link to="/schools">
                  <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-200">
                    <ShamrockIcon className="h-5 w-5 mr-2" />
                    {t('hero_cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div 
                    key={enrollment.id}
                    className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 hover:shadow-md transition-all group"
                    data-testid={`enrollment-${enrollment.id}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{enrollment.course_name}</h3>
                          {getStatusBadge(enrollment.status)}
                        </div>
                        <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {enrollment.school_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Calendar className="h-4 w-4 text-emerald-600" />
                            <span>{language === 'pt' ? 'Início:' : 'Start:'}</span>
                            <strong>{new Date(enrollment.start_date).toLocaleDateString()}</strong>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Euro className="h-4 w-4 text-emerald-600" />
                            <strong>€{enrollment.price.toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>
                      
                      {enrollment.status === 'pending' && (
                        <Button 
                          onClick={() => handlePayment(enrollment)}
                          disabled={processingPayment === enrollment.id}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200"
                          data-testid={`pay-button-${enrollment.id}`}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {processingPayment === enrollment.id ? t('loading') : t('dashboard_pay_now')}
                        </Button>
                      )}
                      
                      {enrollment.status === 'paid' && (
                        <div className="text-right bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-emerald-700 font-medium mb-1">
                            <FileText className="h-4 w-4" />
                            {language === 'pt' ? 'Carta em processamento' : 'Letter in process'}
                          </div>
                          <p className="text-xs text-emerald-600">
                            {language === 'pt' ? 'Até 5 dias úteis' : 'Up to 5 business days'}
                          </p>
                        </div>
                      )}

                      {enrollment.status === 'confirmed' && (
                        <div className="text-right bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                            <CheckCircle className="h-4 w-4" />
                            {language === 'pt' ? 'Matrícula Confirmada!' : 'Enrollment Confirmed!'}
                          </div>
                          <p className="text-xs text-blue-600">
                            {language === 'pt' ? 'Carta enviada por email' : 'Letter sent by email'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
