import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, MapPin, Users, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { FadeIn, StaggerChildren, StaggerItem, HoverCard } from '../components/motion/AnimatedComponents';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="landing-page">
      {/* Navbar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img 
                src={LOGO_URL} 
                alt="ClickBarber" 
                className="h-12 w-auto object-contain"
                animate={{ 
                  rotate: [0, 0, 0, 0, 0],
                }}
                whileHover={{ 
                  rotate: [0, -5, 5, 0],
                  scale: 1.1
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/auth" className="text-zinc-400 hover:text-white transition-colors" data-testid="btn-nav-login">
                  {t('nav_login')}
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/auth" 
                  className="bg-amber-500 text-black font-heading uppercase tracking-wider px-6 py-2 hover:bg-amber-400 transition-colors"
                  data-testid="btn-nav-register"
                >
                  {t('nav_register')}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img 
            src="https://images.pexels.com/photos/20405694/pexels-photo-20405694.jpeg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p 
            className="font-mono text-amber-500 tracking-widest uppercase text-sm mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="hero-subtitle"
          >
            {t('hero_subtitle')}
          </motion.p>
          
          <motion.h1 
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tighter leading-none mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            data-testid="hero-title"
          >
            {t('hero_title_1')}<br />
            <motion.span 
              className="text-amber-500"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(245, 158, 11, 0.5)",
                  "0 0 40px rgba(245, 158, 11, 0.8)",
                  "0 0 20px rgba(245, 158, 11, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t('hero_title_2')}
            </motion.span><br />
            {t('hero_title_3')}
          </motion.h1>
          
          <motion.p 
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {t('hero_description')}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button 
              onClick={() => navigate('/auth')}
              className="relative bg-amber-500 text-black font-heading uppercase tracking-widest px-10 py-5 hover:bg-amber-400 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              data-testid="hero-cta-client"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative z-10">{t('hero_btn_client')}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="relative z-10"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
            
            <motion.button 
              onClick={() => navigate('/auth')}
              className="border border-zinc-700 text-zinc-300 font-heading uppercase tracking-widest px-10 py-5 hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05, borderColor: "#f59e0b" }}
              whileTap={{ scale: 0.95 }}
              data-testid="hero-cta-barber"
            >
              {t('hero_btn_barber')}
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Scissors className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div 
            className="w-px h-16 bg-gradient-to-b from-amber-500 to-transparent"
            animate={{ 
              scaleY: [1, 0.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-zinc-950" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up" className="text-center mb-16">
            <p className="font-mono text-amber-500 tracking-widest uppercase text-sm mb-4">{t('features_subtitle')}</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase">
              {t('features_title')}
            </h2>
          </FadeIn>

          <StaggerChildren className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              { icon: MapPin, title: t('feature_1_title'), desc: t('feature_1_desc'), testId: 'feature-1' },
              { icon: Users, title: t('feature_2_title'), desc: t('feature_2_desc'), testId: 'feature-2' },
              { icon: Zap, title: t('feature_3_title'), desc: t('feature_3_desc'), testId: 'feature-3' }
            ].map((feature, index) => (
              <StaggerItem key={index} direction="up">
                <HoverCard scale={1.03}>
                  <motion.div 
                    className="bg-zinc-900 border border-zinc-800 p-8 hover:border-amber-500/30 transition-all group h-full"
                    whileHover={{ borderColor: "rgba(245, 158, 11, 0.5)" }}
                    data-testid={feature.testId}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-12 h-12 text-amber-500 mb-6" />
                    </motion.div>
                    <h3 className="font-heading text-xl text-white uppercase mb-3">{feature.title}</h3>
                    <p className="text-zinc-500">{feature.desc}</p>
                  </motion.div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* For Barbers Section */}
      <section className="py-24 px-6" data-testid="barbers-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <p className="font-mono text-amber-500 tracking-widest uppercase text-sm mb-4">{t('barbers_subtitle')}</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase mb-6">
                {t('barbers_title')}
              </h2>
              <p className="text-zinc-400 text-lg mb-8">
                {t('barbers_desc')}
              </p>
              <ul className="space-y-4">
                {[
                  t('barbers_feature_1'),
                  t('barbers_feature_2'),
                  t('barbers_feature_3'),
                  t('barbers_feature_4')
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-3 text-zinc-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-amber-500"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </FadeIn>
            
            <FadeIn direction="right" delay={0.2}>
              <div className="relative overflow-hidden">
                <motion.img 
                  src="https://images.pexels.com/photos/12464841/pexels-photo-12464841.jpeg"
                  alt="Barber at work"
                  className="w-full h-[500px] object-cover"
                  initial={{ filter: "grayscale(100%)" }}
                  whileInView={{ filter: "grayscale(0%)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  whileHover={{ scale: 1.05 }}
                />
                <motion.div 
                  className="absolute inset-0 border border-amber-500/30"
                  whileHover={{ borderColor: "rgba(245, 158, 11, 0.8)" }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-amber-500 relative overflow-hidden" data-testid="cta-section">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #000 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn direction="up">
            <motion.h2 
              className="font-heading text-4xl md:text-6xl font-bold text-black uppercase mb-6"
              animate={{ 
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {t('cta_title')}
            </motion.h2>
            <p className="text-black/70 text-lg mb-10">
              {t('cta_desc')}
            </p>
            <motion.button 
              onClick={() => navigate('/auth')}
              className="relative bg-black text-white font-heading uppercase tracking-widest px-12 py-5 hover:bg-zinc-900 transition-colors overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              data-testid="cta-register"
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative z-10">{t('cta_btn')}</span>
            </motion.button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800" data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <img src={LOGO_URL} alt="ClickBarber" className="h-10 w-auto object-contain" />
            </motion.div>
            <motion.p 
              className="text-zinc-500 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © 2025 ClickBarber. {t('footer_rights')}
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
