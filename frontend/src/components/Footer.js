import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Mail, Phone } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={LOGO_URL} 
                alt="ClickBarber" 
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {language === 'pt' 
                ? 'Encontre barbeiros disponíveis em tempo real. Agende seu corte em segundos.'
                : 'Find available barbers in real time. Book your cut in seconds.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-500">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  {t('nav_login')}
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  {t('nav_register')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-500">Serviços</h4>
            <ul className="space-y-2">
              <li className="text-zinc-400 text-sm">Corte de Cabelo</li>
              <li className="text-zinc-400 text-sm">Barba</li>
              <li className="text-zinc-400 text-sm">Combo</li>
              <li className="text-zinc-400 text-sm">Degradê</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-500">{t('footer_contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-zinc-400 text-sm">
                <MapPin className="h-4 w-4 text-amber-500" />
                Dublin, Ireland
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm">
                <Mail className="h-4 w-4 text-amber-500" />
                contato@clickbarber.ie
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm">
                <Phone className="h-4 w-4 text-amber-500" />
                +353 1 234 5678
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © 2025 ClickBarber. {t('footer_rights')}.
          </p>
          <div className="flex gap-6">
            <Link to="/terms-of-service" className="text-zinc-500 hover:text-white text-sm transition-colors">
              {t('footer_terms')}
            </Link>
            <Link to="/privacy-policy" className="text-zinc-500 hover:text-white text-sm transition-colors">
              {t('footer_privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
