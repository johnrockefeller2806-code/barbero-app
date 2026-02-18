import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStuffLanguage, StuffLanguageSelector } from '../contexts/StuffLanguageContext';
import { getFAQs } from '../i18n/stuffFAQs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { 
  MessageCircle, 
  Send, 
  CheckCircle,
  GraduationCap,
  CreditCard,
  FileText,
  Plane,
  Home,
  Briefcase,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

// Map icon strings to components
const ICON_MAP = {
  GraduationCap,
  CreditCard,
  FileText,
  Plane,
  Home,
  Briefcase
};

export const StuffDuvidas = () => {
  const navigate = useNavigate();
  const { language, t } = useStuffLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get translated FAQs
  const faqs = useMemo(() => getFAQs(language), [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setSubmitted(true);
      toast.success(t('contact_success'));
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="duvidas-page">
      {/* Header with Logo */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('back')}
            </button>
            <StuffLanguageSelector />
          </div>
          <div className="flex flex-col items-center text-center">
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-24 md:h-32 w-auto object-contain bg-white rounded-2xl p-3 shadow-xl mb-6"
              data-testid="duvidas-logo"
            />
            <h1 className="text-3xl font-bold mb-2">{t('faq_title')}</h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
              {t('faq_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-8">
            {faqs.map((section, sectionIndex) => {
              const IconComponent = ICON_MAP[section.icon] || GraduationCap;
              return (
                <Card key={sectionIndex} className="border-slate-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-serif flex items-center gap-2 text-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-700" />
                      </div>
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {section.questions.map((item, index) => (
                        <AccordionItem key={index} value={`item-${sectionIndex}-${index}`}>
                          <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-600 text-sm whitespace-pre-line">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-slate-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    {t('faq_not_found')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {t('contact_success')}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4">
                        {t('contact_response')}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', subject: '', message: '' });
                        }}
                      >
                        {t('back')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact_name')}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-10"
                          data-testid="contact-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact_email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-10"
                          data-testid="contact-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t('contact_subject')}</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="h-10"
                          data-testid="contact-subject"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t('contact_message')}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          data-testid="contact-message"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-500"
                        disabled={loading}
                        data-testid="contact-submit"
                      >
                        {loading ? (
                          t('contact_sending')
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t('contact_send')}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="border-slate-100 mt-4">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500 mb-2">
                    {t('contact_urgent')}
                  </p>
                  <a 
                    href="mailto:contato@stuffintercambio.com"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    contato@stuffintercambio.com
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StuffDuvidas;
