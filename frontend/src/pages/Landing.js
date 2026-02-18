import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  GraduationCap, 
  CreditCard, 
  BookOpen, 
  HeadphonesIcon,
  ArrowRight,
  Star,
  MapPin,
  Bus,
  FileText,
  Shield,
  Building2,
  Euro,
  Mail,
  FileCheck,
  CheckCircle,
  Zap,
  Heart,
  Lock
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";
const HERO_IMAGE_URL = "https://customer-assets.emergentagent.com/job_dublin-exchange/artifacts/498i1soq_WhatsApp%20Image%202026-01-12%20at%2000.30.29.jpeg";

export const Landing = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: GraduationCap,
      title: t('feature_schools'),
      description: t('feature_schools_desc'),
    },
    {
      icon: CreditCard,
      title: t('feature_payment'),
      description: t('feature_payment_desc'),
    },
    {
      icon: BookOpen,
      title: t('feature_guides'),
      description: t('feature_guides_desc'),
    },
    {
      icon: HeadphonesIcon,
      title: t('feature_support'),
      description: t('feature_support_desc'),
    },
  ];

  const quickLinks = [
    {
      icon: GraduationCap,
      title: language === 'pt' ? 'Escolas' : 'Schools',
      desc: language === 'pt' ? 'Encontre sua escola ideal' : 'Find your ideal school',
      href: '/schools',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: Bus,
      title: language === 'pt' ? 'Transporte' : 'Transport',
      desc: language === 'pt' ? 'Rotas e horários' : 'Routes and schedules',
      href: '/transport',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: FileText,
      title: language === 'pt' ? 'Documentos' : 'Documents',
      desc: language === 'pt' ? 'PPS, GNIB e mais' : 'PPS, GNIB and more',
      href: '/services',
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: language === 'pt' ? 'Segurança absoluta' : 'Absolute security',
      desc: language === 'pt' ? 'Em todo o processo' : 'Throughout the process',
    },
    {
      icon: Building2,
      title: language === 'pt' ? 'Contato direto' : 'Direct contact',
      desc: language === 'pt' ? 'Com a escola, sem intermediários' : 'With the school, no middlemen',
    },
    {
      icon: Euro,
      title: language === 'pt' ? 'Preços reais' : 'Real prices',
      desc: language === 'pt' ? 'Diferenciados e exclusivos' : 'Differentiated and exclusive',
    },
    {
      icon: Lock,
      title: language === 'pt' ? 'Pagamento 100% seguro' : '100% secure payment',
      desc: language === 'pt' ? 'Direto pela plataforma' : 'Direct through platform',
    },
    {
      icon: Mail,
      title: language === 'pt' ? 'Confirmação imediata' : 'Immediate confirmation',
      desc: language === 'pt' ? 'Por e-mail após o pagamento' : 'By email after payment',
    },
    {
      icon: FileCheck,
      title: language === 'pt' ? 'Carta oficial' : 'Official letter',
      desc: language === 'pt' ? 'Em até 5 dias úteis' : 'Within 5 business days',
    },
  ];

  return (
    <div className="min-h-screen" data-testid="landing-page">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={HERO_IMAGE_URL} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 via-emerald-900/70 to-emerald-800/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="max-w-3xl">
            {/* Logo STUFF Intercâmbio */}
            <div className="mb-8 animate-fade-in">
              <img 
                src={LOGO_URL} 
                alt="STUFF Intercâmbio" 
                className="h-20 md:h-24 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-3"
                data-testid="hero-logo"
              />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in" data-testid="hero-title">
              {t('hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 leading-relaxed animate-fade-in stagger-1" data-testid="hero-subtitle">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-2 relative z-10">
              <Link to="/schools">
                <Button 
                  size="lg" 
                  className="bg-amber-600 hover:bg-amber-500 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  data-testid="hero-cta"
                >
                  {t('hero_cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
                  data-testid="hero-secondary-cta"
                >
                  {t('hero_secondary')}
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link to={link.href} key={index}>
                <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100" data-testid={`quick-link-${index}`}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${link.color}`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{link.title}</h3>
                      <p className="text-sm text-slate-500">{link.desc}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600 ml-auto transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 md:py-28 bg-white" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              {language === 'pt' ? 'Como Funciona' : 'How It Works'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              {language === 'pt' 
                ? 'O intercâmbio do jeito certo.' 
                : 'Exchange the right way.'}
              <br />
              <span className="text-emerald-700">
                {language === 'pt' ? 'Direto com a escola.' : 'Direct with the school.'}
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'pt'
                ? 'Chega de intermediários, agenciadores e taxas escondidas. Nosso aplicativo coloca você em contato direto com as escolas na Irlanda, de forma simples, segura e transparente.'
                : 'No more middlemen, agents or hidden fees. Our app puts you in direct contact with schools in Ireland, simply, safely and transparently.'}
            </p>
          </div>

          {/* Exclusive Access Card */}
          <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white border-none mb-16 overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/30 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-amber-400 font-medium">
                    {language === 'pt' ? 'Acesso Exclusivo' : 'Exclusive Access'}
                  </span>
                </div>
                <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-4xl">
                  {language === 'pt'
                    ? 'Aqui, você tem acesso exclusivo a escolas cadastradas e verificadas, com preços diferenciados, negociados diretamente para usuários da plataforma. Tudo isso sem comissões abusivas e sem terceiros envolvidos.'
                    : 'Here, you have exclusive access to registered and verified schools, with differentiated prices, negotiated directly for platform users. All without abusive commissions and without third parties involved.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Grid */}
          <div className="mb-16">
            <h3 className="font-serif text-2xl font-semibold text-slate-900 text-center mb-8">
              {language === 'pt' ? 'Por que usar nosso aplicativo?' : 'Why use our app?'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-slate-500">{benefit.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 mb-16">
            <h3 className="font-serif text-2xl font-semibold text-slate-900 text-center mb-8">
              {language === 'pt' ? 'Simples. Transparente. Confiável.' : 'Simple. Transparent. Reliable.'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: language === 'pt' ? 'Escolha a escola' : 'Choose the school',
                  desc: language === 'pt' ? 'Navegue pelas escolas verificadas' : 'Browse verified schools',
                  icon: Building2
                },
                {
                  step: '2',
                  title: language === 'pt' ? 'Veja o valor real' : 'See the real price',
                  desc: language === 'pt' ? 'Preços transparentes, sem surpresas' : 'Transparent prices, no surprises',
                  icon: Euro
                },
                {
                  step: '3',
                  title: language === 'pt' ? 'Pague com segurança' : 'Pay securely',
                  desc: language === 'pt' ? 'Pagamento protegido via Stripe' : 'Protected payment via Stripe',
                  icon: Lock
                },
                {
                  step: '4',
                  title: language === 'pt' ? 'Receba a confirmação' : 'Get confirmation',
                  desc: language === 'pt' ? 'Carta oficial em até 5 dias úteis' : 'Official letter within 5 days',
                  icon: FileCheck
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-emerald-900 rounded-2xl mb-4">
                    <item.icon className="h-7 w-7 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-6 text-center">
                <Zap className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                <h4 className="font-semibold text-emerald-900 mb-2">
                  {language === 'pt' ? 'Mais autonomia' : 'More autonomy'}
                </h4>
                <p className="text-sm text-emerald-700">
                  {language === 'pt' 
                    ? 'Você decide tudo, com controle total do processo' 
                    : 'You decide everything, with full control of the process'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-6 text-center">
                <Euro className="h-10 w-10 text-amber-600 mx-auto mb-4" />
                <h4 className="font-semibold text-amber-900 mb-2">
                  {language === 'pt' ? 'Mais economia' : 'More savings'}
                </h4>
                <p className="text-sm text-amber-700">
                  {language === 'pt' 
                    ? 'Sem taxas de intermediários ou custos extras' 
                    : 'No middleman fees or extra costs'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6 text-center">
                <Heart className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-blue-900 mb-2">
                  {language === 'pt' ? 'Mais confiança' : 'More trust'}
                </h4>
                <p className="text-sm text-blue-700">
                  {language === 'pt' 
                    ? 'Escolas verificadas e processo transparente' 
                    : 'Verified schools and transparent process'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Final Message */}
          <div className="text-center">
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              {language === 'pt'
                ? 'Nosso aplicativo foi criado para quem quer fazer intercâmbio com controle total, evitando surpresas, burocracias desnecessárias e custos extras.'
                : 'Our app was created for those who want to exchange with full control, avoiding surprises, unnecessary bureaucracy and extra costs.'}
            </p>
            <p className="text-xl font-semibold text-emerald-800 mb-8">
              {language === 'pt'
                ? 'Aqui, você decide. A escola confirma. E o seu intercâmbio acontece.'
                : 'Here, you decide. The school confirms. And your exchange happens.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                {language === 'pt' ? 'Sem atravessadores' : 'No middlemen'}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                {language === 'pt' ? 'Sem complicação' : 'No complications'}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                {language === 'pt' ? 'Sem risco' : 'No risk'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-slate-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-emerald-900 mb-4">
              {t('features_title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white border-none shadow-sm hover:shadow-lg transition-shadow"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-6">
                    <feature.icon className="h-7 w-7 text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ireland Exchange Rules Section */}
      <section id="regras-irlanda" className="py-20 md:py-28 bg-white" data-testid="ireland-rules-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              {language === 'pt' ? '📋 Guia Completo' : language === 'es' ? '📋 Guía Completa' : '📋 Complete Guide'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              {language === 'pt' 
                ? 'Regras do Intercâmbio na Irlanda' 
                : language === 'es'
                ? 'Reglas del Intercambio en Irlanda'
                : 'Ireland Exchange Rules'}
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'pt'
                ? 'Tudo que você precisa saber antes de embarcar. Valores, documentos, prazos e procedimentos oficiais.'
                : language === 'es'
                ? 'Todo lo que necesitas saber antes de viajar. Valores, documentos, plazos y procedimientos oficiales.'
                : 'Everything you need to know before you travel. Prices, documents, deadlines and official procedures.'}
            </p>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Visa Requirements */}
            <Card className="border-slate-200 overflow-hidden">
              <div className="bg-emerald-900 text-white p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {language === 'pt' ? 'Requisitos do Visto' : language === 'es' ? 'Requisitos de Visa' : 'Visa Requirements'}
                    </h3>
                    <p className="text-emerald-200 text-sm">Stamp 2 - Student Visa</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? 'Curso mínimo de 25 semanas' : language === 'es' ? 'Curso mínimo de 25 semanas' : 'Minimum 25-week course'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? '15 horas/semana em escola ACELS/QQI' : language === 'es' ? '15 horas/semana en escuela ACELS/QQI' : '15 hours/week at ACELS/QQI school'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? 'Comprovação financeira' : language === 'es' ? 'Comprobación financiera' : 'Financial proof'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? 'Mínimo €4.200 na conta bancária' : language === 'es' ? 'Mínimo €4.200 en cuenta bancaria' : 'Minimum €4,200 in bank account'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? 'Seguro saúde obrigatório' : language === 'es' ? 'Seguro de salud obligatorio' : 'Mandatory health insurance'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? 'Cobertura mínima de €25.000' : language === 'es' ? 'Cobertura mínima de €25.000' : 'Minimum coverage €25,000'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? 'Carta de matrícula da escola' : language === 'es' ? 'Carta de matrícula de la escuela' : 'School enrollment letter'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? 'Enrollment Letter oficial' : language === 'es' ? 'Enrollment Letter oficial' : 'Official Enrollment Letter'}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Work Rights */}
            <Card className="border-slate-200 overflow-hidden">
              <div className="bg-blue-900 text-white p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {language === 'pt' ? 'Direito de Trabalho' : language === 'es' ? 'Derecho al Trabajo' : 'Work Rights'}
                    </h3>
                    <p className="text-blue-200 text-sm">Stamp 2 - Student Work Permit</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? '20 horas/semana durante aulas' : language === 'es' ? '20 horas/semana durante clases' : '20 hours/week during term'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? 'Período letivo regular' : language === 'es' ? 'Período lectivo regular' : 'Regular academic period'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? '40 horas/semana nas férias' : language === 'es' ? '40 horas/semana en vacaciones' : '40 hours/week during holidays'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? 'Jun-Set e 15 Dez-15 Jan' : language === 'es' ? 'Jun-Sep y 15 Dic-15 Ene' : 'Jun-Sep and 15 Dec-15 Jan'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? 'Salário mínimo €12.70/hora' : language === 'es' ? 'Salario mínimo €12.70/hora' : 'Minimum wage €12.70/hour'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? 'Atualizado em 2024' : language === 'es' ? 'Actualizado en 2024' : 'Updated 2024'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {language === 'pt' ? 'PPS Number obrigatório' : language === 'es' ? 'PPS Number obligatorio' : 'PPS Number required'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {language === 'pt' ? 'Necessário para trabalhar legalmente' : language === 'es' ? 'Necesario para trabajar legalmente' : 'Required to work legally'}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Costs Breakdown */}
          <Card className="border-slate-200 mb-12 overflow-hidden" data-testid="costs-breakdown">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
              <div className="flex items-center gap-3">
                <Euro className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">
                    {language === 'pt' ? 'Custos Estimados do Intercâmbio' : language === 'es' ? 'Costos Estimados del Intercambio' : 'Estimated Exchange Costs'}
                  </h3>
                  <p className="text-amber-100 text-sm">
                    {language === 'pt' ? 'Valores médios para 8 meses (2 semestres)' : language === 'es' ? 'Valores medios para 8 meses (2 semestres)' : 'Average values for 8 months (2 semesters)'}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <GraduationCap className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-1">
                    {language === 'pt' ? 'Curso de Inglês' : language === 'es' ? 'Curso de Inglés' : 'English Course'}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">€2.500 - €4.500</p>
                  <p className="text-xs text-slate-400">25 semanas</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-1">
                    {language === 'pt' ? 'Acomodação' : language === 'es' ? 'Alojamiento' : 'Accommodation'}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">€600 - €1.200</p>
                  <p className="text-xs text-slate-400">{language === 'pt' ? 'por mês' : language === 'es' ? 'por mes' : 'per month'}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-1">
                    {language === 'pt' ? 'Seguro Saúde' : language === 'es' ? 'Seguro de Salud' : 'Health Insurance'}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">€150 - €300</p>
                  <p className="text-xs text-slate-400">{language === 'pt' ? 'por 8 meses' : language === 'es' ? 'por 8 meses' : 'for 8 months'}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <FileCheck className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-1">
                    {language === 'pt' ? 'Taxa IRP/GNIB' : language === 'es' ? 'Tasa IRP/GNIB' : 'IRP/GNIB Fee'}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">€300</p>
                  <p className="text-xs text-slate-400">{language === 'pt' ? 'taxa única' : language === 'es' ? 'tasa única' : 'one-time fee'}</p>
                </div>
              </div>
              
              {/* Total Estimate */}
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-emerald-800 font-medium">
                      {language === 'pt' ? 'Investimento Total Estimado (8 meses):' : language === 'es' ? 'Inversión Total Estimada (8 meses):' : 'Total Estimated Investment (8 months):'}
                    </p>
                    <p className="text-sm text-emerald-600">
                      {language === 'pt' ? 'Inclui curso, moradia, seguro e taxas' : language === 'es' ? 'Incluye curso, vivienda, seguro y tasas' : 'Includes course, housing, insurance and fees'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-700">€10.000 - €18.000</p>
                    <p className="text-xs text-emerald-600">
                      {language === 'pt' ? '(sem passagem aérea)' : language === 'es' ? '(sin pasaje aéreo)' : '(excluding airfare)'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step Process */}
          <Card className="border-slate-200 overflow-hidden" data-testid="step-by-step">
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center gap-3">
                <FileCheck className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">
                    {language === 'pt' ? 'Passo a Passo do Processo' : language === 'es' ? 'Paso a Paso del Proceso' : 'Step by Step Process'}
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {language === 'pt' ? 'Do início ao embarque' : language === 'es' ? 'Del inicio al embarque' : 'From start to departure'}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: language === 'pt' ? 'Escolha a escola e o curso' : language === 'es' ? 'Elige la escuela y el curso' : 'Choose school and course',
                    desc: language === 'pt' ? 'Pesquise escolas credenciadas (ACELS/QQI) com cursos de no mínimo 25 semanas' : language === 'es' ? 'Investiga escuelas acreditadas (ACELS/QQI) con cursos de mínimo 25 semanas' : 'Research accredited schools (ACELS/QQI) with minimum 25-week courses',
                    time: language === 'pt' ? '1-2 semanas' : language === 'es' ? '1-2 semanas' : '1-2 weeks'
                  },
                  {
                    step: '2',
                    title: language === 'pt' ? 'Faça a matrícula e pague' : language === 'es' ? 'Haz la matrícula y paga' : 'Enroll and pay',
                    desc: language === 'pt' ? 'Pague o curso pela plataforma e receba a Carta de Matrícula (Enrollment Letter)' : language === 'es' ? 'Paga el curso por la plataforma y recibe la Carta de Matrícula (Enrollment Letter)' : 'Pay for the course through the platform and receive the Enrollment Letter',
                    time: language === 'pt' ? '1-5 dias úteis' : language === 'es' ? '1-5 días hábiles' : '1-5 business days'
                  },
                  {
                    step: '3',
                    title: language === 'pt' ? 'Contrate o seguro saúde' : language === 'es' ? 'Contrata el seguro de salud' : 'Get health insurance',
                    desc: language === 'pt' ? 'Contrate um seguro com cobertura mínima de €25.000 válido na Irlanda' : language === 'es' ? 'Contrata un seguro con cobertura mínima de €25.000 válido en Irlanda' : 'Get insurance with minimum €25,000 coverage valid in Ireland',
                    time: language === 'pt' ? '1 dia' : language === 'es' ? '1 día' : '1 day'
                  },
                  {
                    step: '4',
                    title: language === 'pt' ? 'Comprove recursos financeiros' : language === 'es' ? 'Comprueba recursos financieros' : 'Prove financial resources',
                    desc: language === 'pt' ? 'Tenha no mínimo €4.200 em conta bancária (extrato dos últimos 6 meses)' : language === 'es' ? 'Ten como mínimo €4.200 en cuenta bancaria (extracto de los últimos 6 meses)' : 'Have minimum €4,200 in bank account (last 6 months statement)',
                    time: language === 'pt' ? 'Antes do embarque' : language === 'es' ? 'Antes del embarque' : 'Before departure'
                  },
                  {
                    step: '5',
                    title: language === 'pt' ? 'Compre a passagem aérea' : language === 'es' ? 'Compra el pasaje aéreo' : 'Buy your flight',
                    desc: language === 'pt' ? 'Brasileiros não precisam de visto prévio - entrada como turista (90 dias)' : language === 'es' ? 'Brasileños no necesitan visa previa - entrada como turista (90 días)' : 'Brazilians don\'t need prior visa - entry as tourist (90 days)',
                    time: language === 'pt' ? '2-4 semanas antes' : language === 'es' ? '2-4 semanas antes' : '2-4 weeks before'
                  },
                  {
                    step: '6',
                    title: language === 'pt' ? 'Chegue na Irlanda' : language === 'es' ? 'Llega a Irlanda' : 'Arrive in Ireland',
                    desc: language === 'pt' ? 'Apresente documentos na imigração: carta da escola, seguro, comprovante financeiro' : language === 'es' ? 'Presenta documentos en inmigración: carta de la escuela, seguro, comprobante financiero' : 'Present documents at immigration: school letter, insurance, financial proof',
                    time: language === 'pt' ? 'No aeroporto' : language === 'es' ? 'En el aeropuerto' : 'At the airport'
                  },
                  {
                    step: '7',
                    title: language === 'pt' ? 'Registre-se no IRP/GNIB' : language === 'es' ? 'Regístrate en el IRP/GNIB' : 'Register at IRP/GNIB',
                    desc: language === 'pt' ? 'Agende online em burghquayregistrationoffice.inis.gov.ie - Taxa de €300' : language === 'es' ? 'Agenda online en burghquayregistrationoffice.inis.gov.ie - Tasa de €300' : 'Book online at burghquayregistrationoffice.inis.gov.ie - Fee €300',
                    time: language === 'pt' ? 'Primeiras 4 semanas' : language === 'es' ? 'Primeras 4 semanas' : 'First 4 weeks'
                  },
                  {
                    step: '8',
                    title: language === 'pt' ? 'Obtenha o PPS Number' : language === 'es' ? 'Obtén el PPS Number' : 'Get your PPS Number',
                    desc: language === 'pt' ? 'Necessário para trabalhar - Agende em mywelfare.ie' : language === 'es' ? 'Necesario para trabajar - Agenda en mywelfare.ie' : 'Required to work - Book at mywelfare.ie',
                    time: language === 'pt' ? 'Após IRP' : language === 'es' ? 'Después del IRP' : 'After IRP'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                <Shield className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">
                  {language === 'pt' ? '⚠️ Informação Importante' : language === 'es' ? '⚠️ Información Importante' : '⚠️ Important Information'}
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {language === 'pt'
                    ? 'As regras de imigração podem mudar. Sempre consulte o site oficial do INIS (Irish Naturalisation and Immigration Service) em inis.gov.ie para informações atualizadas. O STUFF Intercâmbio facilita o processo, mas a responsabilidade pelo cumprimento dos requisitos é do estudante.'
                    : language === 'es'
                    ? 'Las reglas de inmigración pueden cambiar. Siempre consulta el sitio oficial del INIS (Irish Naturalisation and Immigration Service) en inis.gov.ie para información actualizada. STUFF Intercâmbio facilita el proceso, pero la responsabilidad de cumplir los requisitos es del estudiante.'
                    : 'Immigration rules may change. Always check the official INIS (Irish Naturalisation and Immigration Service) website at inis.gov.ie for updated information. STUFF Intercâmbio facilitates the process, but the responsibility for meeting requirements lies with the student.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-schools">
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">15+</div>
              <div className="text-emerald-200 text-sm">{language === 'pt' ? 'Escolas Parceiras' : 'Partner Schools'}</div>
            </div>
            <div data-testid="stat-students">
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">500+</div>
              <div className="text-emerald-200 text-sm">{language === 'pt' ? 'Estudantes' : 'Students'}</div>
            </div>
            <div data-testid="stat-rating">
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-1">
                4.9 <Star className="h-6 w-6 fill-amber-400" />
              </div>
              <div className="text-emerald-200 text-sm">{language === 'pt' ? 'Avaliação Média' : 'Average Rating'}</div>
            </div>
            <div data-testid="stat-support">
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">24/7</div>
              <div className="text-emerald-200 text-sm">{language === 'pt' ? 'Suporte' : 'Support'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-emerald-900 mb-4">
              {language === 'pt' ? 'Pronto para começar?' : 'Ready to start?'}
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              {language === 'pt' 
                ? 'Explore nossas escolas parceiras e encontre o curso perfeito para você.'
                : 'Explore our partner schools and find the perfect course for you.'}
            </p>
            <Link to="/schools">
              <Button 
                size="lg" 
                className="bg-emerald-900 hover:bg-emerald-800 rounded-full px-8 py-6 text-lg"
                data-testid="cta-button"
              >
                {t('hero_cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
