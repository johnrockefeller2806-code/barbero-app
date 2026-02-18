import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  FadeIn, 
  StaggerChildren, 
  StaggerItem,
  HoverCard,
  FloatingElement
} from '../components/motion/AnimatedComponents';
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
      title: language === 'pt' ? 'Escolas' : language === 'es' ? 'Escuelas' : 'Schools',
      desc: language === 'pt' ? 'Encontre sua escola ideal' : language === 'es' ? 'Encuentra tu escuela ideal' : 'Find your ideal school',
      href: '/schools',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: Bus,
      title: language === 'pt' ? 'Transporte' : language === 'es' ? 'Transporte' : 'Transport',
      desc: language === 'pt' ? 'Rotas e horários' : language === 'es' ? 'Rutas y horarios' : 'Routes and schedules',
      href: '/transport',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: FileText,
      title: language === 'pt' ? 'Documentos' : language === 'es' ? 'Documentos' : 'Documents',
      desc: language === 'pt' ? 'PPS, GNIB e mais' : language === 'es' ? 'PPS, GNIB y más' : 'PPS, GNIB and more',
      href: '/services',
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: language === 'pt' ? 'Segurança absoluta' : language === 'es' ? 'Seguridad absoluta' : 'Absolute security',
      desc: language === 'pt' ? 'Em todo o processo' : language === 'es' ? 'En todo el proceso' : 'Throughout the process',
    },
    {
      icon: Building2,
      title: language === 'pt' ? 'Contato direto' : language === 'es' ? 'Contacto directo' : 'Direct contact',
      desc: language === 'pt' ? 'Com a escola, sem intermediários' : language === 'es' ? 'Con la escuela, sin intermediarios' : 'With the school, no middlemen',
    },
    {
      icon: Euro,
      title: language === 'pt' ? 'Preços reais' : language === 'es' ? 'Precios reales' : 'Real prices',
      desc: language === 'pt' ? 'Diferenciados e exclusivos' : language === 'es' ? 'Diferenciados y exclusivos' : 'Differentiated and exclusive',
    },
    {
      icon: Lock,
      title: language === 'pt' ? 'Pagamento 100% seguro' : language === 'es' ? 'Pago 100% seguro' : '100% secure payment',
      desc: language === 'pt' ? 'Direto pela plataforma' : language === 'es' ? 'Directo por la plataforma' : 'Direct through platform',
    },
    {
      icon: Mail,
      title: language === 'pt' ? 'Confirmação imediata' : language === 'es' ? 'Confirmación inmediata' : 'Immediate confirmation',
      desc: language === 'pt' ? 'Por e-mail após o pagamento' : language === 'es' ? 'Por e-mail después del pago' : 'By email after payment',
    },
    {
      icon: FileCheck,
      title: language === 'pt' ? 'Carta oficial' : language === 'es' ? 'Carta oficial' : 'Official letter',
      desc: language === 'pt' ? 'Em até 5 dias úteis' : language === 'es' ? 'En hasta 5 días hábiles' : 'Within 5 business days',
    },
  ];

  return (
    <div className="min-h-screen" data-testid="landing-page">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <motion.img 
            src={HERO_IMAGE_URL} 
            alt="" 
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 via-emerald-900/70 to-emerald-800/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="max-w-3xl">
            {/* Logo STUFF Intercâmbio */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.img 
                src={LOGO_URL} 
                alt="STUFF Intercâmbio" 
                className="h-20 md:h-24 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-3"
                data-testid="hero-logo"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -3, 3, -3, 0],
                  boxShadow: "0 0 30px rgba(255,255,255,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
            </motion.div>
            
            <motion.h1 
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              data-testid="hero-title"
            >
              {t('hero_title')}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-emerald-100 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              data-testid="hero-subtitle"
            >
              {t('hero_subtitle')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/schools">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(217, 119, 6, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden rounded-full"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <Button 
                    size="lg" 
                    className="bg-amber-600 hover:bg-amber-500 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg transition-all relative"
                    data-testid="hero-cta"
                  >
                    {t('hero_cta')}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              <a href="#como-funciona">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.15)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
                    data-testid="hero-secondary-cta"
                  >
                    {t('hero_secondary')}
                  </Button>
                </motion.div>
              </a>
            </motion.div>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <FloatingElement className="absolute top-20 right-20 hidden lg:block" duration={4} distance={15}>
          <div className="w-16 h-16 bg-amber-500/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-40 right-40 hidden lg:block" duration={5} distance={20}>
          <div className="w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
        </FloatingElement>
        
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
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4" staggerDelay={0.1}>
            {quickLinks.map((link, index) => (
              <StaggerItem key={index} direction="up">
                <Link to={link.href}>
                  <HoverCard scale={1.03}>
                    <Card className="group hover:shadow-xl transition-all duration-300 border-slate-100" data-testid={`quick-link-${index}`}>
                      <CardContent className="p-6 flex items-center gap-4">
                        <motion.div 
                          className={`p-3 rounded-xl ${link.color}`}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <link.icon className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{link.title}</h3>
                          <p className="text-sm text-slate-500">{link.desc}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600 ml-auto transition-colors" />
                      </CardContent>
                    </Card>
                  </HoverCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 md:py-28 bg-white" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          {/* Header */}
          <FadeIn direction="up" className="text-center mb-16">
            <motion.span 
              className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              {language === 'pt' ? 'Como Funciona' : language === 'es' ? 'Cómo Funciona' : 'How It Works'}
            </motion.span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              {language === 'pt' 
                ? 'O intercâmbio do jeito certo.' 
                : language === 'es'
                ? 'El intercambio de la forma correcta.'
                : 'Exchange the right way.'}
              <br />
              <span className="text-emerald-700">
                {language === 'pt' ? 'Direto com a escola.' : language === 'es' ? 'Directo con la escuela.' : 'Direct with the school.'}
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'pt'
                ? 'Chega de intermediários, agenciadores e taxas escondidas. Nosso aplicativo coloca você em contato direto com as escolas na Irlanda, de forma simples, segura e transparente.'
                : language === 'es'
                ? 'Basta de intermediarios, agentes y tarifas ocultas. Nuestra aplicación te pone en contacto directo con las escuelas en Irlanda, de forma simple, segura y transparente.'
                : 'No more middlemen, agents or hidden fees. Our app puts you in direct contact with schools in Ireland, simply, safely and transparently.'}
            </p>
          </FadeIn>

          {/* Exclusive Access Card */}
          <FadeIn direction="up" delay={0.2}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white border-none mb-16 overflow-hidden">
                <CardContent className="p-8 md:p-12 relative">
                  <motion.div 
                    className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/30 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        className="p-2 bg-amber-500 rounded-lg"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="h-5 w-5 text-white" />
                      </motion.div>
                      <span className="text-amber-400 font-medium">
                        {language === 'pt' ? 'Acesso Exclusivo' : language === 'es' ? 'Acceso Exclusivo' : 'Exclusive Access'}
                      </span>
                    </div>
                    <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-4xl">
                      {language === 'pt'
                        ? 'Aqui, você tem acesso exclusivo a escolas cadastradas e verificadas, com preços diferenciados, negociados diretamente para usuários da plataforma. Tudo isso sem comissões abusivas e sem terceiros envolvidos.'
                        : language === 'es'
                        ? 'Aquí, tienes acceso exclusivo a escuelas registradas y verificadas, con precios diferenciados, negociados directamente para usuarios de la plataforma. Todo esto sin comisiones abusivas y sin terceros involucrados.'
                        : 'Here, you have exclusive access to registered and verified schools, with differentiated prices, negotiated directly for platform users. All without abusive commissions and without third parties involved.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>

          {/* Benefits Grid */}
          <div className="mb-16">
            <FadeIn direction="up">
              <h3 className="font-serif text-2xl font-semibold text-slate-900 text-center mb-8">
                {language === 'pt' ? 'Por que usar nosso aplicativo?' : language === 'es' ? '¿Por qué usar nuestra aplicación?' : 'Why use our app?'}
              </h3>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
              {benefits.map((benefit, index) => (
                <StaggerItem key={index} direction="up">
                  <HoverCard scale={1.03}>
                    <Card className="border-slate-100 hover:shadow-lg transition-all duration-300 h-full">
                      <CardContent className="p-6 flex items-start gap-4">
                        <motion.div 
                          className="p-3 bg-emerald-100 rounded-xl flex-shrink-0"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <benefit.icon className="h-6 w-6 text-emerald-700" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-slate-500">{benefit.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Process Steps */}
          <FadeIn direction="up" delay={0.2}>
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 mb-16">
              <h3 className="font-serif text-2xl font-semibold text-slate-900 text-center mb-8">
                {language === 'pt' ? 'Simples. Transparente. Confiável.' : language === 'es' ? 'Simple. Transparente. Confiable.' : 'Simple. Transparent. Reliable.'}
              </h3>
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-4 gap-6" staggerDelay={0.1}>
                {[
                  {
                    step: '1',
                    title: language === 'pt' ? 'Escolha a escola' : language === 'es' ? 'Elige la escuela' : 'Choose the school',
                    desc: language === 'pt' ? 'Navegue pelas escolas verificadas' : language === 'es' ? 'Navega por las escuelas verificadas' : 'Browse verified schools',
                    icon: Building2
                  },
                  {
                    step: '2',
                    title: language === 'pt' ? 'Veja o valor real' : language === 'es' ? 'Ve el valor real' : 'See the real price',
                    desc: language === 'pt' ? 'Preços transparentes, sem surpresas' : language === 'es' ? 'Precios transparentes, sin sorpresas' : 'Transparent prices, no surprises',
                    icon: Euro
                  },
                  {
                    step: '3',
                    title: language === 'pt' ? 'Pague com segurança' : language === 'es' ? 'Paga con seguridad' : 'Pay securely',
                    desc: language === 'pt' ? 'Pagamento protegido via Stripe' : language === 'es' ? 'Pago protegido vía Stripe' : 'Protected payment via Stripe',
                    icon: Lock
                  },
                  {
                    step: '4',
                    title: language === 'pt' ? 'Receba a confirmação' : language === 'es' ? 'Recibe la confirmación' : 'Get confirmation',
                    desc: language === 'pt' ? 'Carta oficial em até 5 dias úteis' : language === 'es' ? 'Carta oficial en hasta 5 días hábiles' : 'Official letter within 5 days',
                    icon: FileCheck
                  }
                ].map((item, index) => (
                  <StaggerItem key={index} direction="up">
                    <motion.div 
                      className="text-center"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="relative inline-flex items-center justify-center w-16 h-16 bg-emerald-900 rounded-2xl mb-4"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="h-7 w-7 text-white" />
                        <motion.span 
                          className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full text-white text-sm font-bold flex items-center justify-center"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                        >
                          {item.step}
                        </motion.span>
                      </motion.div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </FadeIn>

          {/* Value Propositions */}
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" staggerDelay={0.1}>
            <StaggerItem direction="left">
              <HoverCard scale={1.05}>
                <Card className="bg-emerald-50 border-emerald-100 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="font-semibold text-emerald-900 mb-2">
                      {language === 'pt' ? 'Mais autonomia' : language === 'es' ? 'Más autonomía' : 'More autonomy'}
                    </h4>
                    <p className="text-sm text-emerald-700">
                      {language === 'pt' 
                        ? 'Você decide tudo, com controle total do processo' 
                        : language === 'es'
                        ? 'Tú decides todo, con control total del proceso'
                        : 'You decide everything, with full control of the process'}
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
            <StaggerItem direction="up">
              <HoverCard scale={1.05}>
                <Card className="bg-amber-50 border-amber-100 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Euro className="h-10 w-10 text-amber-600 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="font-semibold text-amber-900 mb-2">
                      {language === 'pt' ? 'Mais economia' : language === 'es' ? 'Más ahorro' : 'More savings'}
                    </h4>
                    <p className="text-sm text-amber-700">
                      {language === 'pt' 
                        ? 'Sem taxas de intermediários ou custos extras' 
                        : language === 'es'
                        ? 'Sin tarifas de intermediarios o costos extras'
                        : 'No middleman fees or extra costs'}
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
            <StaggerItem direction="right">
              <HoverCard scale={1.05}>
                <Card className="bg-blue-50 border-blue-100 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {language === 'pt' ? 'Mais confiança' : language === 'es' ? 'Más confianza' : 'More trust'}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {language === 'pt' 
                        ? 'Escolas verificadas e processo transparente' 
                        : language === 'es'
                        ? 'Escuelas verificadas y proceso transparente'
                        : 'Verified schools and transparent process'}
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          </StaggerChildren>

          {/* Final Message */}
          <FadeIn direction="up" delay={0.3}>
            <div className="text-center">
              <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                {language === 'pt'
                  ? 'Nosso aplicativo foi criado para quem quer fazer intercâmbio com controle total, evitando surpresas, burocracias desnecessárias e custos extras.'
                  : language === 'es'
                  ? 'Nuestra aplicación fue creada para quienes quieren hacer intercambio con control total, evitando sorpresas, burocracias innecesarias y costos extras.'
                  : 'Our app was created for those who want to exchange with full control, avoiding surprises, unnecessary bureaucracy and extra costs.'}
              </p>
              <p className="text-xl font-semibold text-emerald-800 mb-8">
                {language === 'pt'
                  ? 'Aqui, você decide. A escola confirma. E o seu intercâmbio acontece.'
                  : language === 'es'
                  ? 'Aquí, tú decides. La escuela confirma. Y tu intercambio sucede.'
                  : 'Here, you decide. The school confirms. And your exchange happens.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                {[
                  { text: language === 'pt' ? 'Sem atravessadores' : language === 'es' ? 'Sin intermediarios' : 'No middlemen' },
                  { text: language === 'pt' ? 'Sem complicação' : language === 'es' ? 'Sin complicaciones' : 'No complications' },
                  { text: language === 'pt' ? 'Sem risco' : language === 'es' ? 'Sin riesgo' : 'No risk' }
                ].map((item, index) => (
                  <motion.span 
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    {item.text}
                  </motion.span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-slate-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-emerald-900 mb-4">
              {t('features_title')}
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
            {features.map((feature, index) => (
              <StaggerItem key={index} direction="up">
                <HoverCard scale={1.05}>
                  <Card 
                    className="bg-white border-none shadow-sm hover:shadow-lg transition-shadow h-full"
                    data-testid={`feature-card-${index}`}
                  >
                    <CardContent className="p-8 text-center">
                      <motion.div 
                        className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-6"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="h-7 w-7 text-emerald-700" />
                      </motion.div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Ireland Exchange Rules Section */}
      <section id="regras-irlanda" className="py-20 md:py-28 bg-white" data-testid="ireland-rules-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          {/* Header */}
          <FadeIn direction="up" className="text-center mb-16">
            <motion.span 
              className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {language === 'pt' ? 'Guia Completo' : language === 'es' ? 'Guía Completa' : 'Complete Guide'}
            </motion.span>
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
          </FadeIn>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Visa Requirements */}
            <FadeIn direction="left" delay={0.1}>
              <HoverCard>
                <Card className="border-slate-200 overflow-hidden h-full">
                  <motion.div 
                    className="bg-emerald-900 text-white p-6"
                    whileHover={{ backgroundColor: '#064e3b' }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <FileText className="h-8 w-8" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Requisitos do Visto' : language === 'es' ? 'Requisitos de Visa' : 'Visa Requirements'}
                        </h3>
                        <p className="text-emerald-200 text-sm">Stamp 2 - Student Visa</p>
                      </div>
                    </div>
                  </motion.div>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {[
                        {
                          title: language === 'pt' ? 'Curso mínimo de 25 semanas' : language === 'es' ? 'Curso mínimo de 25 semanas' : 'Minimum 25-week course',
                          desc: language === 'pt' ? '15 horas/semana em escola ACELS/QQI' : language === 'es' ? '15 horas/semana en escuela ACELS/QQI' : '15 hours/week at ACELS/QQI school'
                        },
                        {
                          title: language === 'pt' ? 'Comprovação financeira' : language === 'es' ? 'Comprobación financiera' : 'Financial proof',
                          desc: language === 'pt' ? 'Mínimo €4.200 na conta bancária' : language === 'es' ? 'Mínimo €4.200 en cuenta bancaria' : 'Minimum €4,200 in bank account'
                        },
                        {
                          title: language === 'pt' ? 'Seguro saúde obrigatório' : language === 'es' ? 'Seguro de salud obligatorio' : 'Mandatory health insurance',
                          desc: language === 'pt' ? 'Cobertura mínima de €25.000' : language === 'es' ? 'Cobertura mínima de €25.000' : 'Minimum coverage €25,000'
                        },
                        {
                          title: language === 'pt' ? 'Carta de matrícula da escola' : language === 'es' ? 'Carta de matrícula de la escuela' : 'School enrollment letter',
                          desc: language === 'pt' ? 'Enrollment Letter oficial' : language === 'es' ? 'Enrollment Letter oficial' : 'Official Enrollment Letter'
                        }
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </HoverCard>
            </FadeIn>

            {/* Work Rights */}
            <FadeIn direction="right" delay={0.2}>
              <HoverCard>
                <Card className="border-slate-200 overflow-hidden h-full">
                  <motion.div 
                    className="bg-blue-900 text-white p-6"
                    whileHover={{ backgroundColor: '#1e3a8a' }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Building2 className="h-8 w-8" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold">
                          {language === 'pt' ? 'Direito de Trabalho' : language === 'es' ? 'Derecho al Trabajo' : 'Work Rights'}
                        </h3>
                        <p className="text-blue-200 text-sm">Stamp 2 - Student Work Permit</p>
                      </div>
                    </div>
                  </motion.div>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {[
                        {
                          title: language === 'pt' ? '20 horas/semana durante aulas' : language === 'es' ? '20 horas/semana durante clases' : '20 hours/week during term',
                          desc: language === 'pt' ? 'Período letivo regular' : language === 'es' ? 'Período lectivo regular' : 'Regular academic period'
                        },
                        {
                          title: language === 'pt' ? '40 horas/semana nas férias' : language === 'es' ? '40 horas/semana en vacaciones' : '40 hours/week during holidays',
                          desc: language === 'pt' ? 'Jun-Set e 15 Dez-15 Jan' : language === 'es' ? 'Jun-Sep y 15 Dic-15 Ene' : 'Jun-Sep and 15 Dec-15 Jan'
                        },
                        {
                          title: language === 'pt' ? 'Salário mínimo €12.70/hora' : language === 'es' ? 'Salario mínimo €12.70/hora' : 'Minimum wage €12.70/hour',
                          desc: language === 'pt' ? 'Atualizado em 2024' : language === 'es' ? 'Actualizado en 2024' : 'Updated 2024'
                        },
                        {
                          title: language === 'pt' ? 'PPS Number obrigatório' : language === 'es' ? 'PPS Number obligatorio' : 'PPS Number required',
                          desc: language === 'pt' ? 'Necessário para trabalhar legalmente' : language === 'es' ? 'Necesario para trabajar legalmente' : 'Required to work legally'
                        }
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </HoverCard>
            </FadeIn>
          </div>

          {/* Costs Breakdown */}
          <FadeIn direction="up" delay={0.2}>
            <HoverCard>
              <Card className="border-slate-200 mb-12 overflow-hidden" data-testid="costs-breakdown">
                <motion.div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6"
                  whileHover={{ backgroundPosition: '100% 0%' }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <Euro className="h-8 w-8" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {language === 'pt' ? 'Custos Estimados do Intercâmbio' : language === 'es' ? 'Costos Estimados del Intercambio' : 'Estimated Exchange Costs'}
                      </h3>
                      <p className="text-amber-100 text-sm">
                        {language === 'pt' ? 'Valores médios para 8 meses (2 semestres)' : language === 'es' ? 'Valores medios para 8 meses (2 semestres)' : 'Average values for 8 months (2 semesters)'}
                      </p>
                    </div>
                  </div>
                </motion.div>
                <CardContent className="p-6">
                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
                    {[
                      { icon: GraduationCap, color: 'text-emerald-600', label: language === 'pt' ? 'Curso de Inglês' : language === 'es' ? 'Curso de Inglés' : 'English Course', value: '€2.500 - €4.500', sub: '25 semanas' },
                      { icon: MapPin, color: 'text-blue-600', label: language === 'pt' ? 'Acomodação' : language === 'es' ? 'Alojamiento' : 'Accommodation', value: '€600 - €1.200', sub: language === 'pt' ? 'por mês' : language === 'es' ? 'por mes' : 'per month' },
                      { icon: Shield, color: 'text-purple-600', label: language === 'pt' ? 'Seguro Saúde' : language === 'es' ? 'Seguro de Salud' : 'Health Insurance', value: '€150 - €300', sub: language === 'pt' ? 'por 8 meses' : language === 'es' ? 'por 8 meses' : 'for 8 months' },
                      { icon: FileCheck, color: 'text-amber-600', label: language === 'pt' ? 'Taxa IRP/GNIB' : language === 'es' ? 'Tasa IRP/GNIB' : 'IRP/GNIB Fee', value: '€300', sub: language === 'pt' ? 'taxa única' : language === 'es' ? 'tasa única' : 'one-time fee' }
                    ].map((item, index) => (
                      <StaggerItem key={index} direction="scale">
                        <motion.div 
                          className="text-center p-4 bg-slate-50 rounded-xl"
                          whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
                        >
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          >
                            <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2`} />
                          </motion.div>
                          <p className="text-sm text-slate-500 mb-1">{item.label}</p>
                          <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                          <p className="text-xs text-slate-400">{item.sub}</p>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                  
                  {/* Total Estimate */}
                  <motion.div 
                    className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
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
                        <motion.p 
                          className="text-3xl font-bold text-emerald-700"
                          initial={{ scale: 0.5 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          €10.000 - €18.000
                        </motion.p>
                        <p className="text-xs text-emerald-600">
                          {language === 'pt' ? '(sem passagem aérea)' : language === 'es' ? '(sin pasaje aéreo)' : '(excluding airfare)'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </HoverCard>
          </FadeIn>

          {/* Step by Step Process */}
          <FadeIn direction="up" delay={0.2}>
            <Card className="border-slate-200 overflow-hidden" data-testid="step-by-step">
              <motion.div 
                className="bg-slate-900 text-white p-6"
                whileHover={{ backgroundColor: '#0f172a' }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <FileCheck className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {language === 'pt' ? 'Passo a Passo do Processo' : language === 'es' ? 'Paso a Paso del Proceso' : 'Step by Step Process'}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {language === 'pt' ? 'Do início ao embarque' : language === 'es' ? 'Del inicio al embarque' : 'From start to departure'}
                    </p>
                  </div>
                </div>
              </motion.div>
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
                    <motion.div 
                      key={index} 
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <motion.div 
                          className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.step}
                        </motion.div>
                      </div>
                      <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-slate-900">{item.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                          </div>
                          <motion.span 
                            className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full whitespace-nowrap"
                            whileHover={{ scale: 1.1 }}
                          >
                            {item.time}
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Important Notice */}
          <FadeIn direction="up" delay={0.3}>
            <motion.div 
              className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-2 bg-amber-100 rounded-lg flex-shrink-0"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="h-6 w-6 text-amber-700" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">
                    {language === 'pt' ? 'Informação Importante' : language === 'es' ? 'Información Importante' : 'Important Information'}
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
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" staggerDelay={0.15}>
            {[
              { value: '15+', label: language === 'pt' ? 'Escolas Parceiras' : language === 'es' ? 'Escuelas Asociadas' : 'Partner Schools', testId: 'stat-schools' },
              { value: '500+', label: language === 'pt' ? 'Estudantes' : language === 'es' ? 'Estudiantes' : 'Students', testId: 'stat-students' },
              { value: '4.9', label: language === 'pt' ? 'Avaliação Média' : language === 'es' ? 'Calificación Media' : 'Average Rating', testId: 'stat-rating', hasStar: true },
              { value: '24/7', label: language === 'pt' ? 'Suporte' : language === 'es' ? 'Soporte' : 'Support', testId: 'stat-support' }
            ].map((stat, index) => (
              <StaggerItem key={index} direction="up">
                <motion.div 
                  data-testid={stat.testId}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                    {stat.hasStar && <Star className="h-6 w-6 fill-amber-400" />}
                  </motion.div>
                  <div className="text-emerald-200 text-sm">{stat.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <FadeIn direction="up">
            <motion.div 
              className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative elements */}
              <FloatingElement className="absolute top-10 left-10" duration={4} distance={20}>
                <div className="w-20 h-20 bg-emerald-200/50 rounded-full blur-2xl" />
              </FloatingElement>
              <FloatingElement className="absolute bottom-10 right-10" duration={5} distance={15}>
                <div className="w-32 h-32 bg-amber-200/30 rounded-full blur-2xl" />
              </FloatingElement>
              
              <div className="relative z-10">
                <motion.h2 
                  className="font-serif text-3xl md:text-4xl font-semibold text-emerald-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {language === 'pt' ? 'Pronto para começar?' : language === 'es' ? '¿Listo para empezar?' : 'Ready to start?'}
                </motion.h2>
                <motion.p 
                  className="text-slate-600 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  {language === 'pt' 
                    ? 'Explore nossas escolas parceiras e encontre o curso perfeito para você.'
                    : language === 'es'
                    ? 'Explora nuestras escuelas asociadas y encuentra el curso perfecto para ti.'
                    : 'Explore our partner schools and find the perfect course for you.'}
                </motion.p>
                <Link to="/schools">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Button 
                      size="lg" 
                      className="bg-emerald-900 hover:bg-emerald-800 rounded-full px-8 py-6 text-lg"
                      data-testid="cta-button"
                    >
                      {t('hero_cta')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
