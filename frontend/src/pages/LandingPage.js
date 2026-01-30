import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, MapPin, Users, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="landing-page">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-8 h-8 text-amber-500" />
              <span className="font-heading text-2xl font-bold text-white">BARBER<span className="text-amber-500">X</span></span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Link to="/auth" className="text-zinc-400 hover:text-white transition-colors" data-testid="btn-nav-login">
                {t('nav_login')}
              </Link>
              <Link 
                to="/auth" 
                className="bg-amber-500 text-black font-heading uppercase tracking-wider px-6 py-2 hover:bg-amber-400 transition-colors"
                data-testid="btn-nav-register"
              >
                {t('nav_register')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/20405694/pexels-photo-20405694.jpeg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-mono text-amber-500 tracking-widest uppercase text-sm mb-4" data-testid="hero-subtitle">
            {t('hero_subtitle')}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tighter leading-none mb-6" data-testid="hero-title">
            {t('hero_title_1')}<br />
            <span className="text-amber-500">{t('hero_title_2')}</span><br />
            {t('hero_title_3')}
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {t('hero_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/auth')}
              className="bg-amber-500 text-black font-heading uppercase tracking-widest px-10 py-5 hover:bg-amber-400 transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
              data-testid="hero-cta-client"
            >
              {t('hero_btn_client')}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="border border-zinc-700 text-zinc-300 font-heading uppercase tracking-widest px-10 py-5 hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-3"
              data-testid="hero-cta-barber"
            >
              {t('hero_btn_barber')}
              <Scissors className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-amber-500 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-zinc-950" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-amber-500 tracking-widest uppercase text-sm mb-4">{t('features_subtitle')}</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase">
              {t('features_title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-amber-500/30 transition-all group" data-testid="feature-1">
              <MapPin className="w-12 h-12 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl text-white uppercase mb-3">{t('feature_1_title')}</h3>
              <p className="text-zinc-500">{t('feature_1_desc')}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-amber-500/30 transition-all group" data-testid="feature-2">
              <Users className="w-12 h-12 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl text-white uppercase mb-3">{t('feature_2_title')}</h3>
              <p className="text-zinc-500">{t('feature_2_desc')}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-amber-500/30 transition-all group" data-testid="feature-3">
              <Zap className="w-12 h-12 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl text-white uppercase mb-3">{t('feature_3_title')}</h3>
              <p className="text-zinc-500">{t('feature_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Barbers Section */}
      <section className="py-24 px-6" data-testid="barbers-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono text-amber-500 tracking-widest uppercase text-sm mb-4">{t('barbers_subtitle')}</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase mb-6">
                {t('barbers_title')}
              </h2>
              <p className="text-zinc-400 text-lg mb-8">
                {t('barbers_desc')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="w-2 h-2 bg-amber-500"></div>
                  {t('barbers_feature_1')}
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="w-2 h-2 bg-amber-500"></div>
                  {t('barbers_feature_2')}
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="w-2 h-2 bg-amber-500"></div>
                  {t('barbers_feature_3')}
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="w-2 h-2 bg-amber-500"></div>
                  {t('barbers_feature_4')}
                </li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/12464841/pexels-photo-12464841.jpeg"
                alt="Barber at work"
                className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 border border-amber-500/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-amber-500" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-black uppercase mb-6">
            {t('cta_title')}
          </h2>
          <p className="text-black/70 text-lg mb-10">
            {t('cta_desc')}
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-black text-white font-heading uppercase tracking-widest px-12 py-5 hover:bg-zinc-900 transition-colors"
            data-testid="cta-register"
          >
            {t('cta_btn')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800" data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Scissors className="w-6 h-6 text-amber-500" />
              <span className="font-heading text-xl font-bold text-white">BARBER<span className="text-amber-500">X</span></span>
            </div>
            <p className="text-zinc-500 text-sm">© 2024 BarberX. {t('footer_rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
