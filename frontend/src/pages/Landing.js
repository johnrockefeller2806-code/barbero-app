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
  Lock,
  Plane,
  Globe,
  Users,
  Clock,
  Award
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";
const HERO_IMAGE_URL = "https://customer-assets.emergentagent.com/job_dublin-exchange/artifacts/498i1soq_WhatsApp%20Image%202026-01-12%20at%2000.30.29.jpeg";

// SVG Vector Components - Ireland Theme
const ShamrockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 85c0 0-3-12-3-18c0-4 2-7 3-8c1 1 3 4 3 8c0 6-3 18-3 18z"/>
    <ellipse cx="35" cy="45" rx="18" ry="20" transform="rotate(-30 35 45)"/>
    <ellipse cx="65" cy="45" rx="18" ry="20" transform="rotate(30 65 45)"/>
    <ellipse cx="50" cy="30" rx="18" ry="20"/>
  </svg>
);

const CelticKnotBorder = ({ className }) => (
  <svg className={className} viewBox="0 0 200 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10" />
    <path d="M0 10 Q25 20 50 10 T100 10 T150 10 T200 10" />
  </svg>
);

const WavePattern = () => (
  <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
    <path d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 60C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H0Z" fill="white"/>
    <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 80 1380 80L1440 80V120H0Z" fill="white" fillOpacity="0.5"/>
  </svg>
);

const HarpIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 60 80" fill="currentColor">
    <path d="M30 5C15 5 5 25 5 45C5 55 10 65 20 70L20 75L40 75L40 70C50 65 55 55 55 45C55 25 45 5 30 5ZM30 15C35 15 40 30 40 45C40 50 38 55 35 58L35 65L25 65L25 58C22 55 20 50 20 45C20 30 25 15 30 15Z"/>
    <line x1="25" y1="25" x2="25" y2="60" stroke="currentColor" strokeWidth="1"/>
    <line x1="30" y1="20" x2="30" y2="62" stroke="currentColor" strokeWidth="1"/>
    <line x1="35" y1="25" x2="35" y2="60" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const DublinSkyline = ({ className }) => (
  <svg className={className} viewBox="0 0 400 100" fill="currentColor" opacity="0.1">
    {/* Spire */}
    <path d="M200 0L202 80H198L200 0Z"/>
    {/* Buildings */}
    <rect x="20" y="50" width="30" height="50"/>
    <rect x="55" y="40" width="25" height="60"/>
    <rect x="85" y="55" width="20" height="45"/>
    <rect x="110" y="35" width="35" height="65"/>
    <rect x="150" y="45" width="25" height="55"/>
    {/* Ha'penny Bridge */}
    <path d="M230 80 Q260 60 290 80" fill="none" stroke="currentColor" strokeWidth="3"/>
    {/* More buildings */}
    <rect x="300" y="40" width="30" height="60"/>
    <rect x="335" y="50" width="25" height="50"/>
    <rect x="365" y="35" width="35" height="65"/>
  </svg>
);

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
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      iconColor: 'text-white',
    },
    {
      icon: Bus,
      title: language === 'pt' ? 'Transporte' : 'Transport',
      desc: language === 'pt' ? 'Rotas Dublin Bus & Luas' : 'Dublin Bus & Luas routes',
      href: '/transport',
      color: 'bg-gradient-to-br from-amber-500 to-orange-500',
      iconColor: 'text-white',
    },
    {
      icon: FileText,
      title: language === 'pt' ? 'Documentos' : 'Documents',
      desc: language === 'pt' ? 'PPS, GNIB, IRP' : 'PPS, GNIB, IRP',
      href: '/services',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white',
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

  const cities = [
    { name: 'Dublin', emoji: '🏙️', students: '50,000+' },
    { name: 'Cork', emoji: '🏰', students: '15,000+' },
    { name: 'Galway', emoji: '🌊', students: '8,000+' },
    { name: 'Limerick', emoji: '🏛️', students: '5,000+' },
  ];

  return (
    <div className="min-h-screen" data-testid="landing-page">
      {/* Hero Section - Ireland Theme */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Shamrock Pattern - Top Left */}
          <ShamrockIcon className="absolute -top-10 -left-10 w-64 h-64 text-emerald-700/20 rotate-12" />
          <ShamrockIcon className="absolute top-1/4 left-10 w-32 h-32 text-emerald-600/10 -rotate-12" />
          
          {/* Shamrock Pattern - Top Right */}
          <ShamrockIcon className="absolute -top-5 -right-5 w-48 h-48 text-emerald-700/15 -rotate-12" />
          <ShamrockIcon className="absolute top-1/3 right-20 w-24 h-24 text-emerald-600/10 rotate-45" />
          
          {/* Celtic Harp - Decorative */}
          <HarpIcon className="absolute bottom-32 right-10 w-32 h-40 text-amber-500/20" />
          
          {/* Dublin Skyline - Bottom */}
          <DublinSkyline className="absolute bottom-0 left-0 w-full h-32 text-emerald-950" />
          
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left Content */}
            <div>
              {/* Logo */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <img 
                    src={LOGO_URL} 
                    alt="STUFF Intercâmbio" 
                    className="h-14 w-auto"
                    data-testid="hero-logo"
                  />
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <ShamrockIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-200 text-sm font-medium">
                  {language === 'pt' ? 'Sua jornada na Irlanda começa aqui' : 'Your journey to Ireland starts here'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
                {language === 'pt' ? (
                  <>
                    Estude na{' '}
                    <span className="relative">
                      <span className="text-amber-400">Irlanda</span>
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-500/50" viewBox="0 0 200 12" fill="currentColor">
                        <path d="M0 8 Q50 0 100 8 T200 8 V12 H0 Z" />
                      </svg>
                    </span>
                    <br />
                    com a <span className="text-emerald-400">STUFF</span>
                  </>
                ) : (
                  <>
                    Study in{' '}
                    <span className="relative">
                      <span className="text-amber-400">Ireland</span>
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-500/50" viewBox="0 0 200 12" fill="currentColor">
                        <path d="M0 8 Q50 0 100 8 T200 8 V12 H0 Z" />
                      </svg>
                    </span>
                    <br />
                    with <span className="text-emerald-400">STUFF</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-emerald-100/90 mb-8 leading-relaxed max-w-xl" data-testid="hero-subtitle">
                {language === 'pt' 
                  ? 'Conectamos você diretamente às melhores escolas de Dublin, Cork e Galway. Sem intermediários, sem taxas escondidas.'
                  : 'We connect you directly to the best schools in Dublin, Cork and Galway. No middlemen, no hidden fees.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/schools">
                  <Button 
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-400 text-emerald-900 font-semibold rounded-full px-8 py-6 text-lg shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all group"
                    data-testid="hero-cta"
                  >
                    <GraduationCap className="mr-2 h-5 w-5" />
                    {language === 'pt' ? 'Ver Escolas' : 'View Schools'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
                    data-testid="hero-secondary-cta"
                  >
                    {language === 'pt' ? 'Como Funciona' : 'How It Works'}
                  </Button>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-emerald-200/80">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">{language === 'pt' ? 'Escolas ACELS' : 'ACELS Schools'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200/80">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">{language === 'pt' ? 'Pagamento Seguro' : 'Secure Payment'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200/80">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">{language === 'pt' ? 'Suporte 24/7' : '24/7 Support'}</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Card */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                  {/* Ireland Flag Colors Bar */}
                  <div className="flex h-2 rounded-full overflow-hidden mb-6">
                    <div className="flex-1 bg-emerald-500"></div>
                    <div className="flex-1 bg-white"></div>
                    <div className="flex-1 bg-amber-500"></div>
                  </div>

                  <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-amber-400" />
                    {language === 'pt' ? 'Cidades Disponíveis' : 'Available Cities'}
                  </h3>

                  <div className="space-y-4">
                    {cities.map((city, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{city.emoji}</span>
                          <span className="text-white font-medium">{city.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-300 text-sm">{city.students}</span>
                          <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">15+</p>
                      <p className="text-emerald-200 text-xs">{language === 'pt' ? 'Escolas' : 'Schools'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">500+</p>
                      <p className="text-emerald-200 text-xs">{language === 'pt' ? 'Alunos' : 'Students'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">4.9★</p>
                      <p className="text-emerald-200 text-xs">{language === 'pt' ? 'Avaliação' : 'Rating'}</p>
                    </div>
                  </div>
                </div>

                {/* Floating Shamrock */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                  <ShamrockIcon className="w-10 h-10 text-white" />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{language === 'pt' ? 'Certificado' : 'Certified'}</p>
                      <p className="text-gray-500 text-xs">ACELS / QQI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Pattern */}
        <WavePattern />
      </section>

      {/* Quick Links Section */}
      <section className="py-8 -mt-4 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link to={link.href} key={index}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300" data-testid={`quick-link-${index}`}>
                  <CardContent className="p-0">
                    <div className={`${link.color} p-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <link.icon className={`h-7 w-7 ${link.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg">{link.title}</h3>
                            <p className="text-white/80 text-sm">{link.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-6 w-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 md:py-28 bg-white relative overflow-hidden" data-testid="how-it-works-section">
        {/* Decorative Shamrocks */}
        <ShamrockIcon className="absolute top-20 right-10 w-32 h-32 text-emerald-100 rotate-12" />
        <ShamrockIcon className="absolute bottom-20 left-10 w-24 h-24 text-emerald-50 -rotate-12" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
              <ShamrockIcon className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800 font-medium text-sm">
                {language === 'pt' ? 'Como Funciona' : 'How It Works'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {language === 'pt' 
                ? 'O intercâmbio do jeito certo.' 
                : 'Exchange the right way.'}
              <br />
              <span className="text-emerald-600">
                {language === 'pt' ? 'Direto com a escola.' : 'Direct with the school.'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'pt'
                ? 'Chega de intermediários, agenciadores e taxas escondidas. Nosso aplicativo coloca você em contato direto com as escolas na Irlanda.'
                : 'No more middlemen, agents or hidden fees. Our app puts you in direct contact with schools in Ireland.'}
            </p>
          </div>

          {/* Exclusive Card with Ireland Theme */}
          <Card className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white border-none mb-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <ShamrockIcon className="absolute -right-10 -bottom-10 w-48 h-48 text-emerald-600/20" />
            <CardContent className="p-8 md:p-12 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500 rounded-xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <span className="text-amber-400 font-semibold text-lg">
                  {language === 'pt' ? 'Acesso Exclusivo' : 'Exclusive Access'}
                </span>
              </div>
              <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-4xl">
                {language === 'pt'
                  ? 'Aqui, você tem acesso exclusivo a escolas cadastradas e verificadas, com preços diferenciados, negociados diretamente para usuários da plataforma. Tudo isso sem comissões abusivas e sem terceiros envolvidos.'
                  : 'Here, you have exclusive access to registered and verified schools, with differentiated prices, negotiated directly for platform users. All without abusive commissions and without third parties involved.'}
              </p>
            </CardContent>
          </Card>

          {/* Process Steps - Ireland Themed */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
            {/* Celtic Border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-white to-amber-500" />
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10 flex items-center justify-center gap-3">
              <ShamrockIcon className="w-8 h-8 text-emerald-600" />
              {language === 'pt' ? 'Simples. Transparente. Confiável.' : 'Simple. Transparent. Reliable.'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: language === 'pt' ? 'Escolha a escola' : 'Choose the school',
                  desc: language === 'pt' ? 'Navegue pelas escolas verificadas' : 'Browse verified schools',
                  icon: Building2,
                  color: 'bg-emerald-600'
                },
                {
                  step: '2',
                  title: language === 'pt' ? 'Veja o valor real' : 'See the real price',
                  desc: language === 'pt' ? 'Preços transparentes' : 'Transparent prices',
                  icon: Euro,
                  color: 'bg-teal-600'
                },
                {
                  step: '3',
                  title: language === 'pt' ? 'Pague com segurança' : 'Pay securely',
                  desc: language === 'pt' ? 'Via Stripe protegido' : 'Protected via Stripe',
                  icon: Lock,
                  color: 'bg-emerald-700'
                },
                {
                  step: '4',
                  title: language === 'pt' ? 'Receba a carta' : 'Get your letter',
                  desc: language === 'pt' ? 'Em até 5 dias úteis' : 'Within 5 business days',
                  icon: FileCheck,
                  color: 'bg-amber-500'
                }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative inline-block mb-4">
                    <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-9 w-9 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full text-emerald-900 text-sm font-bold flex items-center justify-center shadow-md">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {language === 'pt' ? 'Por que usar nosso aplicativo?' : 'Why use our app?'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                        <p className="text-sm text-gray-500">{benefit.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
              <CardContent className="p-8 text-center relative">
                <Zap className="h-12 w-12 text-white/90 mx-auto mb-4" />
                <h4 className="font-bold text-white text-xl mb-2">
                  {language === 'pt' ? 'Mais autonomia' : 'More autonomy'}
                </h4>
                <p className="text-emerald-100">
                  {language === 'pt' 
                    ? 'Você decide tudo, com controle total' 
                    : 'You decide everything, with full control'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
              <CardContent className="p-8 text-center relative">
                <Euro className="h-12 w-12 text-white/90 mx-auto mb-4" />
                <h4 className="font-bold text-white text-xl mb-2">
                  {language === 'pt' ? 'Mais economia' : 'More savings'}
                </h4>
                <p className="text-amber-100">
                  {language === 'pt' 
                    ? 'Sem taxas de intermediários' 
                    : 'No middleman fees'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
              <CardContent className="p-8 text-center relative">
                <Heart className="h-12 w-12 text-white/90 mx-auto mb-4" />
                <h4 className="font-bold text-white text-xl mb-2">
                  {language === 'pt' ? 'Mais confiança' : 'More trust'}
                </h4>
                <p className="text-teal-100">
                  {language === 'pt' 
                    ? 'Escolas verificadas e transparentes' 
                    : 'Verified and transparent schools'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden" data-testid="features-section">
        <ShamrockIcon className="absolute top-10 left-10 w-40 h-40 text-emerald-100/50 rotate-12" />
        <ShamrockIcon className="absolute bottom-10 right-10 w-32 h-32 text-emerald-100/50 -rotate-12" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features_title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-8 text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Ireland Themed */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <ShamrockIcon className="absolute top-10 left-20 w-32 h-32 text-emerald-600/20 rotate-12" />
          <ShamrockIcon className="absolute bottom-10 right-20 w-40 h-40 text-emerald-600/20 -rotate-12" />
          <HarpIcon className="absolute top-1/2 right-10 w-24 h-32 text-amber-500/10 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative">
          {/* Ireland Flag Colors Bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-12 max-w-xs mx-auto">
            <div className="flex-1 bg-emerald-400"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-amber-400"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-schools" className="group">
              <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform">15+</div>
              <div className="text-emerald-200">{language === 'pt' ? 'Escolas Parceiras' : 'Partner Schools'}</div>
            </div>
            <div data-testid="stat-students" className="group">
              <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-emerald-200">{language === 'pt' ? 'Estudantes' : 'Students'}</div>
            </div>
            <div data-testid="stat-rating" className="group">
              <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                4.9 <Star className="h-8 w-8 fill-amber-400" />
              </div>
              <div className="text-emerald-200">{language === 'pt' ? 'Avaliação Média' : 'Average Rating'}</div>
            </div>
            <div data-testid="stat-support" className="group">
              <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-emerald-200">{language === 'pt' ? 'Suporte' : 'Support'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decorative Shamrocks */}
            <ShamrockIcon className="absolute top-10 left-10 w-24 h-24 text-emerald-200 rotate-12" />
            <ShamrockIcon className="absolute bottom-10 right-10 w-32 h-32 text-emerald-200 -rotate-12" />
            
            {/* Ireland Flag Colors Bar */}
            <div className="flex h-1 rounded-full overflow-hidden mb-8 max-w-xs mx-auto">
              <div className="flex-1 bg-emerald-500"></div>
              <div className="flex-1 bg-white border"></div>
              <div className="flex-1 bg-amber-500"></div>
            </div>

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'pt' ? 'Pronto para começar?' : 'Ready to start?'}
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                {language === 'pt' 
                  ? 'Explore nossas escolas parceiras em Dublin, Cork e Galway. Sua aventura na Irlanda começa aqui!'
                  : 'Explore our partner schools in Dublin, Cork and Galway. Your adventure in Ireland starts here!'}
              </p>
              <Link to="/schools">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-10 py-7 text-lg font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all group"
                  data-testid="cta-button"
                >
                  <ShamrockIcon className="w-6 h-6 mr-2" />
                  {t('hero_cta')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
