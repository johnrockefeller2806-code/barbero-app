import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  pt: {
    // Navigation
    nav_home: 'Início',
    nav_schools: 'Escolas',
    nav_transport: 'Transporte',
    nav_services: 'Serviços',
    nav_login: 'Entrar',
    nav_register: 'Cadastrar',
    nav_dashboard: 'Minha Área',
    nav_logout: 'Sair',
    
    // Hero
    hero_title: 'Sua jornada para Dublin começa aqui',
    hero_subtitle: 'Conectamos você diretamente às melhores escolas de inglês da Irlanda. Sem intermediários, com preços transparentes.',
    hero_cta: 'Encontrar Escolas',
    hero_secondary: 'Como funciona',
    
    // Features
    features_title: 'Tudo que você precisa para seu intercâmbio',
    feature_schools: 'Escolas Credenciadas',
    feature_schools_desc: 'Acesso direto às melhores escolas de Dublin, com preços transparentes.',
    feature_payment: 'Pagamento Seguro',
    feature_payment_desc: 'Pague online com segurança e receba sua carta de matrícula.',
    feature_guides: 'Guias Completos',
    feature_guides_desc: 'PPS, GNIB, transporte e tudo mais para sua adaptação.',
    feature_support: 'Suporte Bilíngue',
    feature_support_desc: 'Atendimento em português e inglês para todas as suas dúvidas.',
    
    // Schools
    schools_title: 'Escolas em Dublin',
    schools_subtitle: 'Encontre a escola perfeita para seu intercâmbio',
    schools_filter_all: 'Todas',
    schools_view_details: 'Ver Detalhes',
    schools_from: 'A partir de',
    schools_week: 'semana',
    
    // Course
    course_duration: 'Duração',
    course_weeks: 'semanas',
    course_hours: 'horas/semana',
    course_level: 'Nível',
    course_price: 'Valor',
    course_enroll: 'Matricular-se',
    course_requirements: 'Requisitos',
    course_includes: 'Incluso',
    course_start_dates: 'Datas de início',
    course_spots: 'vagas disponíveis',
    
    // Dashboard
    dashboard_title: 'Minha Área',
    dashboard_enrollments: 'Minhas Matrículas',
    dashboard_no_enrollments: 'Você ainda não tem matrículas',
    dashboard_status_pending: 'Pendente',
    dashboard_status_paid: 'Pago',
    dashboard_status_confirmed: 'Confirmado',
    dashboard_pay_now: 'Pagar Agora',
    
    // Transport
    transport_title: 'Transporte em Dublin',
    transport_subtitle: 'Guia completo de transporte público',
    transport_route: 'Rota',
    transport_frequency: 'Frequência',
    transport_fare: 'Tarifa',
    transport_first: 'Primeiro',
    transport_last: 'Último',
    
    // Services
    services_title: 'Serviços e Documentos',
    services_subtitle: 'Guias para sua vida na Irlanda',
    services_pps: 'PPS Number',
    services_pps_desc: 'Número essencial para trabalhar na Irlanda',
    services_gnib: 'GNIB/IRP',
    services_gnib_desc: 'Registro de imigração obrigatório',
    services_passport: 'Passaporte',
    services_passport_desc: 'Como tirar ou renovar seu passaporte brasileiro',
    services_agencies: 'Órgãos Públicos',
    services_agencies_desc: 'Lista de agências e serviços',
    
    // Auth
    auth_login_title: 'Bem-vindo de volta',
    auth_login_subtitle: 'Entre na sua conta',
    auth_register_title: 'Criar conta',
    auth_register_subtitle: 'Comece sua jornada para Dublin',
    auth_email: 'E-mail',
    auth_password: 'Senha',
    auth_name: 'Nome completo',
    auth_login_btn: 'Entrar',
    auth_register_btn: 'Criar conta',
    auth_no_account: 'Não tem conta?',
    auth_has_account: 'Já tem conta?',
    
    // Payment
    payment_success: 'Pagamento Confirmado!',
    payment_success_msg: 'Sua matrícula foi confirmada. Você receberá a carta da escola em até 5 dias úteis.',
    payment_processing: 'Processando pagamento...',
    payment_return: 'Voltar ao Dashboard',
    
    // Footer
    footer_about: 'Sobre nós',
    footer_contact: 'Contato',
    footer_terms: 'Termos de uso',
    footer_privacy: 'Privacidade',
    footer_rights: 'Todos os direitos reservados',
    
    // Common
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    see_more: 'Ver mais',
    learn_more: 'Saiba mais',
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_schools: 'Schools',
    nav_transport: 'Transport',
    nav_services: 'Services',
    nav_login: 'Login',
    nav_register: 'Sign Up',
    nav_dashboard: 'Dashboard',
    nav_logout: 'Logout',
    
    // Hero
    hero_title: 'Your journey to Dublin starts here',
    hero_subtitle: 'We connect you directly to the best English schools in Ireland. No middlemen, transparent pricing.',
    hero_cta: 'Find Schools',
    hero_secondary: 'How it works',
    
    // Features
    features_title: 'Everything you need for your exchange',
    feature_schools: 'Accredited Schools',
    feature_schools_desc: 'Direct access to the best schools in Dublin with transparent pricing.',
    feature_payment: 'Secure Payment',
    feature_payment_desc: 'Pay online securely and receive your enrollment letter.',
    feature_guides: 'Complete Guides',
    feature_guides_desc: 'PPS, GNIB, transport and everything for your adaptation.',
    feature_support: 'Bilingual Support',
    feature_support_desc: 'Support in Portuguese and English for all your questions.',
    
    // Schools
    schools_title: 'Schools in Dublin',
    schools_subtitle: 'Find the perfect school for your exchange',
    schools_filter_all: 'All',
    schools_view_details: 'View Details',
    schools_from: 'From',
    schools_week: 'week',
    
    // Course
    course_duration: 'Duration',
    course_weeks: 'weeks',
    course_hours: 'hours/week',
    course_level: 'Level',
    course_price: 'Price',
    course_enroll: 'Enroll Now',
    course_requirements: 'Requirements',
    course_includes: 'Includes',
    course_start_dates: 'Start dates',
    course_spots: 'spots available',
    
    // Dashboard
    dashboard_title: 'Dashboard',
    dashboard_enrollments: 'My Enrollments',
    dashboard_no_enrollments: 'You have no enrollments yet',
    dashboard_status_pending: 'Pending',
    dashboard_status_paid: 'Paid',
    dashboard_status_confirmed: 'Confirmed',
    dashboard_pay_now: 'Pay Now',
    
    // Transport
    transport_title: 'Dublin Transport',
    transport_subtitle: 'Complete public transport guide',
    transport_route: 'Route',
    transport_frequency: 'Frequency',
    transport_fare: 'Fare',
    transport_first: 'First',
    transport_last: 'Last',
    
    // Services
    services_title: 'Services & Documents',
    services_subtitle: 'Guides for your life in Ireland',
    services_pps: 'PPS Number',
    services_pps_desc: 'Essential number to work in Ireland',
    services_gnib: 'GNIB/IRP',
    services_gnib_desc: 'Mandatory immigration registration',
    services_passport: 'Passport',
    services_passport_desc: 'How to get or renew your Brazilian passport',
    services_agencies: 'Public Agencies',
    services_agencies_desc: 'List of agencies and services',
    
    // Auth
    auth_login_title: 'Welcome back',
    auth_login_subtitle: 'Sign in to your account',
    auth_register_title: 'Create account',
    auth_register_subtitle: 'Start your journey to Dublin',
    auth_email: 'Email',
    auth_password: 'Password',
    auth_name: 'Full name',
    auth_login_btn: 'Sign In',
    auth_register_btn: 'Create Account',
    auth_no_account: "Don't have an account?",
    auth_has_account: 'Already have an account?',
    
    // Payment
    payment_success: 'Payment Confirmed!',
    payment_success_msg: 'Your enrollment is confirmed. You will receive the school letter within 5 business days.',
    payment_processing: 'Processing payment...',
    payment_return: 'Return to Dashboard',
    
    // Footer
    footer_about: 'About us',
    footer_contact: 'Contact',
    footer_terms: 'Terms of use',
    footer_privacy: 'Privacy',
    footer_rights: 'All rights reserved',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    see_more: 'See more',
    learn_more: 'Learn more',
  },
  es: {
    // Navigation
    nav_home: 'Inicio',
    nav_schools: 'Escuelas',
    nav_transport: 'Transporte',
    nav_services: 'Servicios',
    nav_login: 'Entrar',
    nav_register: 'Registrarse',
    nav_dashboard: 'Mi Área',
    nav_logout: 'Salir',
    
    // Hero
    hero_title: 'Tu viaje a Dublín comienza aquí',
    hero_subtitle: 'Te conectamos directamente con las mejores escuelas de inglés de Irlanda. Sin intermediarios, con precios transparentes.',
    hero_cta: 'Encontrar Escuelas',
    hero_secondary: 'Cómo funciona',
    
    // Features
    features_title: 'Todo lo que necesitas para tu intercambio',
    feature_schools: 'Escuelas Acreditadas',
    feature_schools_desc: 'Acceso directo a las mejores escuelas de Dublín, con precios transparentes.',
    feature_payment: 'Pago Seguro',
    feature_payment_desc: 'Paga en línea con seguridad y recibe tu carta de matrícula.',
    feature_guides: 'Guías Completas',
    feature_guides_desc: 'PPS, GNIB, transporte y todo lo demás para tu adaptación.',
    feature_support: 'Soporte Bilingüe',
    feature_support_desc: 'Atención en portugués e inglés para todas tus dudas.',
    
    // Schools
    schools_title: 'Escuelas en Dublín',
    schools_subtitle: 'Encuentra la escuela perfecta para tu intercambio',
    schools_filter_all: 'Todas',
    schools_view_details: 'Ver Detalles',
    schools_from: 'Desde',
    schools_week: 'semana',
    
    // Course
    course_duration: 'Duración',
    course_weeks: 'semanas',
    course_hours: 'horas/semana',
    course_level: 'Nivel',
    course_price: 'Precio',
    course_enroll: 'Matricularse',
    course_requirements: 'Requisitos',
    course_includes: 'Incluido',
    course_start_dates: 'Fechas de inicio',
    course_spots: 'plazas disponibles',
    
    // Dashboard
    dashboard_title: 'Mi Área',
    dashboard_enrollments: 'Mis Matrículas',
    dashboard_no_enrollments: 'Aún no tienes matrículas',
    dashboard_status_pending: 'Pendiente',
    dashboard_status_paid: 'Pagado',
    dashboard_status_confirmed: 'Confirmado',
    dashboard_pay_now: 'Pagar Ahora',
    
    // Transport
    transport_title: 'Transporte en Dublín',
    transport_subtitle: 'Guía completa de transporte público',
    transport_route: 'Ruta',
    transport_frequency: 'Frecuencia',
    transport_fare: 'Tarifa',
    transport_first: 'Primero',
    transport_last: 'Último',
    
    // Services
    services_title: 'Servicios y Documentos',
    services_subtitle: 'Guías para tu vida en Irlanda',
    services_pps: 'Número PPS',
    services_pps_desc: 'Número esencial para trabajar en Irlanda',
    services_gnib: 'GNIB/IRP',
    services_gnib_desc: 'Registro de inmigración obligatorio',
    services_passport: 'Pasaporte',
    services_passport_desc: 'Cómo obtener o renovar tu pasaporte',
    services_agencies: 'Organismos Públicos',
    services_agencies_desc: 'Lista de agencias y servicios',
    
    // Auth
    auth_login_title: 'Bienvenido de nuevo',
    auth_login_subtitle: 'Inicia sesión en tu cuenta',
    auth_register_title: 'Crear cuenta',
    auth_register_subtitle: 'Comienza tu viaje a Dublín',
    auth_email: 'Correo electrónico',
    auth_password: 'Contraseña',
    auth_name: 'Nombre completo',
    auth_login_btn: 'Entrar',
    auth_register_btn: 'Crear cuenta',
    auth_no_account: '¿No tienes cuenta?',
    auth_has_account: '¿Ya tienes cuenta?',
    
    // Payment
    payment_success: '¡Pago Confirmado!',
    payment_success_msg: 'Tu matrícula ha sido confirmada. Recibirás la carta de la escuela en hasta 5 días hábiles.',
    payment_processing: 'Procesando pago...',
    payment_return: 'Volver al Dashboard',
    
    // Footer
    footer_about: 'Sobre nosotros',
    footer_contact: 'Contacto',
    footer_terms: 'Términos de uso',
    footer_privacy: 'Privacidad',
    footer_rights: 'Todos los derechos reservados',
    
    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Volver',
    next: 'Siguiente',
    see_more: 'Ver más',
    learn_more: 'Saber más',
  }
};

// Language labels and flags
export const languageOptions = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const toggleLanguage = () => {
    // Cycle through: pt -> en -> es -> pt
    setLanguage(prev => {
      if (prev === 'pt') return 'en';
      if (prev === 'en') return 'es';
      return 'pt';
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, languageOptions }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
