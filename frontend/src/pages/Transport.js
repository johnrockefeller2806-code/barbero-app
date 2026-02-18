import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Bus, 
  Train, 
  Clock, 
  MapPin,
  Euro,
  Info,
  Bike,
  ExternalLink,
  CreditCard,
  Smartphone,
  MapPinned,
  CheckCircle
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";
const TRANSPORT_IMAGE_URL = "https://customer-assets.emergentagent.com/job_dublin-exchange/artifacts/nalcqm7v_WhatsApp%20Image%202026-01-12%20at%2003.09.13.jpeg";

export const Transport = () => {
  const { t, language } = useLanguage();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${API}/transport/routes`);
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const busRoutes = routes.filter(r => !r.route_number.includes('LUAS') && !r.route_number.includes('DART'));
  const tramRoutes = routes.filter(r => r.route_number.includes('LUAS'));
  const trainRoutes = routes.filter(r => r.route_number.includes('DART'));

  const RouteCard = ({ route }) => {
    const isTram = route.route_number.includes('LUAS');
    const isTrain = route.route_number.includes('DART');
    
    return (
      <Card className="border-slate-100 hover:shadow-lg transition-shadow" data-testid={`route-${route.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isTrain ? 'bg-green-100' : isTram ? 'bg-purple-100' : 'bg-blue-100'}`}>
                {isTrain ? (
                  <Train className={`h-6 w-6 ${isTrain ? 'text-green-700' : 'text-purple-700'}`} />
                ) : (
                  <Bus className={`h-6 w-6 ${isTram ? 'text-purple-700' : 'text-blue-700'}`} />
                )}
              </div>
              <div>
                <Badge className={`${isTrain ? 'bg-green-600' : isTram ? 'bg-purple-600' : 'bg-blue-600'} text-white`}>
                  {route.route_number}
                </Badge>
                <h3 className="font-semibold text-slate-900 mt-1">
                  {language === 'pt' ? route.name : route.name_en}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">{t('transport_fare')}</p>
              <p className="font-semibold text-emerald-700">€{route.fare.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{route.from_location} → {route.to_location}</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{language === 'pt' ? 'A cada' : 'Every'} {route.frequency_minutes} min</span>
              </div>
              <div>
                <span className="text-slate-400">{t('transport_first')}:</span> {route.first_bus}
              </div>
              <div>
                <span className="text-slate-400">{t('transport_last')}:</span> {route.last_bus}
              </div>
            </div>
            
            {route.popular_stops && route.popular_stops.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-2">
                  {language === 'pt' ? 'Paradas principais:' : 'Popular stops:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {route.popular_stops.map((stop, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {stop}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12" data-testid="transport-loading">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="transport-page">
      {/* Header */}
      <div className="relative bg-emerald-900 text-white py-16 overflow-hidden">
        {/* Background Image - Left Side */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-20">
          <img 
            src={TRANSPORT_IMAGE_URL}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-900" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="transport-title">
                {t('transport_title')}
              </h1>
              <p className="text-emerald-200 text-lg max-w-2xl">
                {t('transport_subtitle')}
              </p>
            </div>
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-16 md:h-20 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-xl p-2 hidden sm:block"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Leap Card Section */}
        <Card className="border-slate-100 bg-gradient-to-br from-emerald-600 to-teal-600 text-white mb-8 overflow-hidden" data-testid="leap-card-section">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left - Info */}
              <div className="flex-1 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Leap Card</h2>
                    <p className="text-emerald-100 text-sm">Transport for Ireland</p>
                  </div>
                </div>
                
                <p className="text-emerald-50 mb-6">
                  {language === 'pt' 
                    ? 'O Leap Card é o cartão de transporte obrigatório para Dublin. Oferece até 31% de desconto em todas as viagens de ônibus, Luas e DART.'
                    : language === 'es'
                    ? 'La Leap Card es la tarjeta de transporte obligatoria para Dublín. Ofrece hasta un 31% de descuento en todos los viajes en autobús, Luas y DART.'
                    : 'The Leap Card is Dublin\'s essential transport card. It offers up to 31% discount on all bus, Luas and DART journeys.'}
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-200" />
                    <span>{language === 'pt' ? 'Até 31% desconto' : language === 'es' ? 'Hasta 31% descuento' : 'Up to 31% discount'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-200" />
                    <span>{language === 'pt' ? 'Recarregável' : language === 'es' ? 'Recargable' : 'Rechargeable'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-200" />
                    <span>{language === 'pt' ? 'Todos transportes' : language === 'es' ? 'Todos transportes' : 'All transport'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-200" />
                    <span>{language === 'pt' ? 'Tarifa diária máxima' : language === 'es' ? 'Tarifa diaria máxima' : 'Daily fare cap'}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://about.leapcard.ie/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                    data-testid="leap-card-official-link"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {language === 'pt' ? 'Site Oficial' : language === 'es' ? 'Sitio Oficial' : 'Official Website'}
                  </a>
                  <a 
                    href="https://about.leapcard.ie/about/where-to-buy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                    data-testid="leap-card-buy-link"
                  >
                    <MapPinned className="h-4 w-4" />
                    {language === 'pt' ? 'Onde Comprar' : language === 'es' ? 'Dónde Comprar' : 'Where to Buy'}
                  </a>
                </div>
              </div>

              {/* Right - Where to Get */}
              <div className="lg:w-96 bg-white/10 backdrop-blur-sm p-6 lg:p-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {language === 'pt' ? 'Onde Conseguir' : language === 'es' ? 'Dónde Conseguir' : 'Where to Get'}
                </h3>
                
                <div className="space-y-4">
                  {/* Dublin Bus Office */}
                  <a 
                    href="https://maps.google.com/?q=Dublin+Bus+O'Connell+Street+Dublin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    data-testid="leap-card-dublin-bus"
                  >
                    <div className="flex items-start gap-3">
                      <Bus className="h-5 w-5 text-emerald-200 mt-0.5" />
                      <div>
                        <p className="font-medium">Dublin Bus Office</p>
                        <p className="text-sm text-emerald-200">59 O'Connell Street Upper, Dublin 1</p>
                        <p className="text-xs text-emerald-300 mt-1">
                          {language === 'pt' ? '📍 Clique para ver no mapa' : language === 'es' ? '📍 Clic para ver en mapa' : '📍 Click to view on map'}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Luas Stations */}
                  <a 
                    href="https://maps.google.com/?q=Luas+Abbey+Street+Dublin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    data-testid="leap-card-luas"
                  >
                    <div className="flex items-start gap-3">
                      <Train className="h-5 w-5 text-emerald-200 mt-0.5" />
                      <div>
                        <p className="font-medium">{language === 'pt' ? 'Estações do Luas' : language === 'es' ? 'Estaciones del Luas' : 'Luas Stations'}</p>
                        <p className="text-sm text-emerald-200">{language === 'pt' ? 'Todas as estações (máquinas de ticket)' : language === 'es' ? 'Todas las estaciones (máquinas de ticket)' : 'All stations (ticket machines)'}</p>
                      </div>
                    </div>
                  </a>

                  {/* Connolly Station */}
                  <a 
                    href="https://maps.google.com/?q=Connolly+Station+Dublin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    data-testid="leap-card-connolly"
                  >
                    <div className="flex items-start gap-3">
                      <Train className="h-5 w-5 text-emerald-200 mt-0.5" />
                      <div>
                        <p className="font-medium">Connolly Station</p>
                        <p className="text-sm text-emerald-200">Newsrail Shop, Connolly Station</p>
                        <p className="text-xs text-emerald-300 mt-1">
                          {language === 'pt' ? '📍 Clique para ver no mapa' : language === 'es' ? '📍 Clic para ver en mapa' : '📍 Click to view on map'}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Post Offices */}
                  <div className="p-3 bg-white/10 rounded-xl">
                    <div className="flex items-start gap-3">
                      <MapPinned className="h-5 w-5 text-emerald-200 mt-0.5" />
                      <div>
                        <p className="font-medium">{language === 'pt' ? 'Correios (Post Offices)' : language === 'es' ? 'Correos (Post Offices)' : 'Post Offices'}</p>
                        <p className="text-sm text-emerald-200">{language === 'pt' ? '+2.000 agentes em toda Irlanda' : language === 'es' ? '+2.000 agentes en toda Irlanda' : '+2,000 agents across Ireland'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-emerald-200 mb-2">
                    <Smartphone className="h-4 w-4 inline mr-1" />
                    {language === 'pt' ? 'Suporte:' : language === 'es' ? 'Soporte:' : 'Support:'} <strong>0818 824 824</strong>
                  </p>
                  <p className="text-xs text-emerald-300">
                    {language === 'pt' ? 'Seg-Sex 7h-19h, Sáb 9h-15h' : language === 'es' ? 'Lun-Vie 7h-19h, Sáb 9h-15h' : 'Mon-Fri 7am-7pm, Sat 9am-3pm'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-slate-100 p-1 h-auto flex-wrap">
            <TabsTrigger 
              value="all" 
              data-testid="tab-all"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200"
            >
              {language === 'pt' ? 'Todos' : 'All'}
            </TabsTrigger>
            <TabsTrigger 
              value="bus" 
              data-testid="tab-bus"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
            >
              <Bus className="h-4 w-4 mr-1" />
              Bus
            </TabsTrigger>
            <TabsTrigger 
              value="luas" 
              data-testid="tab-luas"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
            >
              <Train className="h-4 w-4 mr-1" />
              Luas
            </TabsTrigger>
            <TabsTrigger 
              value="dart" 
              data-testid="tab-dart"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-100 hover:text-green-700 transition-all duration-200"
            >
              <Train className="h-4 w-4 mr-1" />
              DART
            </TabsTrigger>
            <TabsTrigger 
              value="bikes" 
              data-testid="tab-bikes"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white hover:bg-teal-100 hover:text-teal-700 transition-all duration-200"
            >
              <Bike className="h-4 w-4 mr-1" />
              Bikes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bus">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {busRoutes.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="luas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tramRoutes.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dart">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainRoutes.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bikes" data-testid="bikes-content">
            {/* Dublin Bikes Hero Section */}
            <div className="mb-8">
              <Card className="border-slate-100 overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Bike className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Dublin Bikes</h2>
                      <p className="text-teal-100">
                        {language === 'pt' 
                          ? 'Sistema de bicicletas compartilhadas de Dublin'
                          : 'Dublin\'s bike sharing system'}
                      </p>
                    </div>
                  </div>
                  <p className="text-teal-50 text-lg max-w-2xl">
                    {language === 'pt'
                      ? 'Explore Dublin de bicicleta! Com mais de 100 estações espalhadas pela cidade, é uma forma econômica, ecológica e saudável de se locomover.'
                      : 'Explore Dublin by bike! With over 100 stations spread across the city, it\'s an economical, ecological and healthy way to get around.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Pricing Card */}
              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-teal-600" />
                    {language === 'pt' ? 'Preços' : 'Pricing'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {language === 'pt' ? 'Assinatura Anual' : 'Annual Subscription'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {language === 'pt' ? 'Melhor custo-benefício' : 'Best value'}
                        </p>
                      </div>
                      <Badge className="bg-teal-600 text-white text-lg px-3 py-1">€35</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {language === 'pt' ? '3 Dias' : '3 Days'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {language === 'pt' ? 'Para visitantes' : 'For visitors'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1">€5</Badge>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 flex items-start gap-1">
                        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {language === 'pt'
                          ? 'Primeiros 30 minutos grátis! Após isso, €0.50 por cada 30 min adicional.'
                          : 'First 30 minutes free! After that, €0.50 for each additional 30 min.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How to Use Card */}
              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone className="h-5 w-5 text-teal-600" />
                    {language === 'pt' ? 'Como Usar' : 'How to Use'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-teal-700 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {language === 'pt' ? 'Cadastre-se' : 'Register'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {language === 'pt' ? 'Online ou no terminal' : 'Online or at terminal'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-teal-700 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {language === 'pt' ? 'Retire a bike' : 'Pick up bike'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {language === 'pt' ? 'Use seu cartão ou app' : 'Use your card or app'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-teal-700 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {language === 'pt' ? 'Devolva em qualquer estação' : 'Return at any station'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {language === 'pt' ? '+100 estações pela cidade' : '100+ stations citywide'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-teal-600" />
                    {language === 'pt' ? 'Benefícios' : 'Benefits'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      language === 'pt' ? 'Econômico para estudantes' : 'Economical for students',
                      language === 'pt' ? 'Ecológico e sustentável' : 'Ecological and sustainable',
                      language === 'pt' ? 'Evita trânsito' : 'Avoids traffic',
                      language === 'pt' ? 'Exercício diário' : 'Daily exercise',
                      language === 'pt' ? 'Disponível 24/7' : 'Available 24/7',
                      language === 'pt' ? 'App com mapa das estações' : 'App with station map'
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Stations */}
            <Card className="border-slate-100 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-teal-600" />
                  {language === 'pt' ? 'Estações Populares' : 'Popular Stations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      City Centre
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• O'Connell Street</li>
                      <li>• Grafton Street</li>
                      <li>• Dame Street</li>
                      <li>• Temple Bar</li>
                      <li>• Trinity College</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      {language === 'pt' ? 'Áreas de Estudo' : 'Study Areas'}
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• UCD (Belfield)</li>
                      <li>• DCU (Glasnevin)</li>
                      <li>• TU Dublin</li>
                      <li>• RCSI</li>
                      <li>• Griffith College</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      {language === 'pt' ? 'Pontos Turísticos' : 'Tourist Spots'}
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• Phoenix Park</li>
                      <li>• St Stephen's Green</li>
                      <li>• Grand Canal</li>
                      <li>• Merrion Square</li>
                      <li>• Smithfield</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.dublinbikes.ie/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
                data-testid="dublin-bikes-register"
              >
                <Bike className="h-5 w-5" />
                {language === 'pt' ? 'Cadastrar no Dublin Bikes' : 'Register for Dublin Bikes'}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://www.visitdublin.com/dublin-bikes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-teal-600 text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
                data-testid="dublin-bikes-info"
              >
                <Info className="h-5 w-5" />
                {language === 'pt' ? 'Mais Informações' : 'More Information'}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Tips */}
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                💡 {language === 'pt' ? 'Dicas para Estudantes' : 'Tips for Students'}
              </h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {language === 'pt'
                    ? 'A assinatura anual de €35 compensa se você usar pelo menos 2x por semana!'
                    : 'The €35 annual subscription pays off if you use it at least 2x per week!'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {language === 'pt'
                    ? 'Devolva antes de 30 minutos para não pagar extra. Se precisar de mais tempo, devolva e retire outra bike!'
                    : 'Return before 30 minutes to avoid extra charges. If you need more time, return and pick up another bike!'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {language === 'pt'
                    ? 'Use o app "Dublin Bikes" para ver estações com bikes disponíveis em tempo real.'
                    : 'Use the "Dublin Bikes" app to see stations with available bikes in real time.'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {language === 'pt'
                    ? 'Sempre use capacete! Você pode comprar um barato em lojas como Decathlon ou Halfords.'
                    : 'Always wear a helmet! You can buy a cheap one at stores like Decathlon or Halfords.'}
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
