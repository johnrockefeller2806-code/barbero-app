import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ShamrockIcon, 
  HarpIcon, 
  DublinSkyline, 
  WavePattern,
  IrishFlagBar,
  HapennyBridge
} from '../components/IrishVectors';
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
  CheckCircle,
  ArrowRight,
  Ticket
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

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
      <Card className="border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group" data-testid={`route-${route.id}`}>
        <div className={`h-2 ${isTrain ? 'bg-gradient-to-r from-green-500 to-green-600' : isTram ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl shadow-lg ${isTrain ? 'bg-gradient-to-br from-green-500 to-green-600' : isTram ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} group-hover:scale-110 transition-transform`}>
                {isTrain ? (
                  <Train className="h-6 w-6 text-white" />
                ) : (
                  <Bus className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <Badge className={`${isTrain ? 'bg-green-600' : isTram ? 'bg-purple-600' : 'bg-blue-600'} text-white text-sm px-3`}>
                  {route.route_number}
                </Badge>
                <h3 className="font-bold text-gray-900 mt-1">
                  {language === 'pt' ? route.name : route.name_en}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{t('transport_fare')}</p>
              <p className="font-bold text-emerald-600 text-lg">€{route.fare.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">{route.from_location}</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{route.to_location}</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>{language === 'pt' ? 'A cada' : 'Every'} <strong>{route.frequency_minutes}</strong> min</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{t('transport_first')}:</span>
                <strong>{route.first_bus}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{t('transport_last')}:</span>
                <strong>{route.last_bus}</strong>
              </div>
            </div>
            
            {route.popular_stops && route.popular_stops.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">
                  {language === 'pt' ? 'Paradas principais:' : 'Popular stops:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {route.popular_stops.map((stop, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-white">
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
      <div className="min-h-screen bg-gray-50" data-testid="transport-loading">
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Skeleton className="h-12 w-64 mb-4 bg-white/20" />
            <Skeleton className="h-6 w-96 bg-white/20" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12">
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
    <div className="min-h-screen bg-gray-50" data-testid="transport-page">
      {/* Hero Header - Ireland Theme */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <ShamrockIcon className="absolute -top-10 -left-10 w-48 h-48 text-emerald-700/20 rotate-12" />
          <ShamrockIcon className="absolute top-20 right-20 w-32 h-32 text-emerald-600/10 -rotate-12" />
          <HapennyBridge className="absolute bottom-20 right-10 w-48 h-32 text-amber-500/10" />
          <DublinSkyline className="absolute bottom-0 left-0 w-full h-24 text-emerald-950/50" />
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 lg:py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-200 text-sm mb-6">
            <Bus className="h-4 w-4" />
            {language === 'pt' ? 'Transporte Público Dublin' : 'Dublin Public Transport'}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="transport-title">
                {language === 'pt' ? (
                  <>
                    Locomova-se por{' '}
                    <span className="text-amber-400">Dublin</span>
                  </>
                ) : (
                  <>
                    Get around{' '}
                    <span className="text-amber-400">Dublin</span>
                  </>
                )}
              </h1>
              <p className="text-emerald-100/90 text-lg max-w-2xl">
                {language === 'pt' 
                  ? 'Dublin Bus, Luas, DART e Dublin Bikes - todas as opções para você explorar a cidade!'
                  : 'Dublin Bus, Luas, DART and Dublin Bikes - all options for you to explore the city!'}
              </p>
            </div>
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-16 md:h-20 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-3 hidden lg:block"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Bus className="h-5 w-5 text-blue-400" />
              <span className="text-white font-semibold">{busRoutes.length} Bus</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Train className="h-5 w-5 text-purple-400" />
              <span className="text-white font-semibold">{tramRoutes.length} Luas</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Train className="h-5 w-5 text-green-400" />
              <span className="text-white font-semibold">{trainRoutes.length} DART</span>
            </div>
          </div>
        </div>

        {/* Wave Transition */}
        <WavePattern className="absolute bottom-0 left-0 right-0 text-gray-50 h-16" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Leap Card Info - Ireland Theme */}
        <Card className="border-0 shadow-lg mb-8 overflow-hidden" data-testid="transport-info">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Ticket className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ShamrockIcon className="w-5 h-5 text-emerald-200" />
                  <h3 className="font-bold text-white text-xl">
                    {language === 'pt' ? 'Dica: Use o Leap Card!' : 'Tip: Use Leap Card!'}
                  </h3>
                </div>
                <p className="text-emerald-100 mb-4">
                  {language === 'pt' 
                    ? 'O Leap Card é um cartão recarregável que oferece tarifas mais baratas em todos os transportes públicos de Dublin. Economize até 30%!'
                    : 'The Leap Card is a rechargeable card that offers cheaper fares on all Dublin public transport. Save up to 30%!'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://www.leapcard.ie" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                    data-testid="leap-card-link"
                  >
                    🎫 {language === 'pt' ? 'Comprar Leap Card' : 'Buy Leap Card'}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <div className="flex items-center gap-2 text-emerald-100 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    {language === 'pt' ? 'Estudantes: €10/semana ilimitado' : 'Students: €10/week unlimited'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs - Styled */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border-0 shadow-md p-2 h-auto flex-wrap rounded-2xl">
            <TabsTrigger 
              value="all" 
              data-testid="tab-all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-semibold transition-all"
            >
              <ShamrockIcon className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Todos' : 'All'}
            </TabsTrigger>
            <TabsTrigger 
              value="bus" 
              data-testid="tab-bus"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-semibold transition-all"
            >
              <Bus className="h-4 w-4 mr-2" />
              Dublin Bus
            </TabsTrigger>
            <TabsTrigger 
              value="luas" 
              data-testid="tab-luas"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-semibold transition-all"
            >
              <Train className="h-4 w-4 mr-2" />
              Luas
            </TabsTrigger>
            <TabsTrigger 
              value="dart" 
              data-testid="tab-dart"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-semibold transition-all"
            >
              <Train className="h-4 w-4 mr-2" />
              DART
            </TabsTrigger>
            <TabsTrigger 
              value="bikes" 
              data-testid="tab-bikes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-semibold transition-all"
            >
              <Bike className="h-4 w-4 mr-2" />
              Dublin Bikes
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
            {/* Dublin Bikes Hero */}
            <Card className="border-0 shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 p-8 relative overflow-hidden">
                <ShamrockIcon className="absolute -right-10 -top-10 w-48 h-48 text-teal-400/20 rotate-12" />
                <div className="relative flex items-center gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl">
                    <Bike className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Dublin Bikes</h2>
                    <p className="text-teal-100 text-lg">
                      {language === 'pt' 
                        ? 'Explore Dublin de bicicleta! +100 estações pela cidade 🚴'
                        : 'Explore Dublin by bike! 100+ stations citywide 🚴'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Pricing Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-teal-600" />
                    {language === 'pt' ? 'Preços' : 'Pricing'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                      <div>
                        <p className="font-bold text-gray-900">
                          {language === 'pt' ? 'Assinatura Anual' : 'Annual Subscription'}
                        </p>
                        <p className="text-sm text-teal-600 font-medium">
                          {language === 'pt' ? '⭐ Melhor custo-benefício' : '⭐ Best value'}
                        </p>
                      </div>
                      <Badge className="bg-teal-600 text-white text-xl px-4 py-2">€35</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-bold text-gray-900">
                          {language === 'pt' ? '3 Dias' : '3 Days'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === 'pt' ? 'Para visitantes' : 'For visitors'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">€5</Badge>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">
                        {language === 'pt'
                          ? 'Primeiros 30 minutos grátis! Após: €0.50/30min'
                          : 'First 30 min free! After: €0.50/30min'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How to Use Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone className="h-5 w-5 text-emerald-600" />
                    {language === 'pt' ? 'Como Usar' : 'How to Use'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { num: '1', title: language === 'pt' ? 'Cadastre-se' : 'Register', desc: language === 'pt' ? 'Online ou no terminal' : 'Online or at terminal' },
                      { num: '2', title: language === 'pt' ? 'Retire a bike' : 'Pick up bike', desc: language === 'pt' ? 'Use seu cartão ou app' : 'Use your card or app' },
                      { num: '3', title: language === 'pt' ? 'Devolva' : 'Return', desc: language === 'pt' ? 'Em qualquer estação' : 'At any station' }
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white text-sm font-bold">{step.num}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{step.title}</p>
                          <p className="text-sm text-gray-500">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShamrockIcon className="h-5 w-5 text-emerald-600" />
                    {language === 'pt' ? 'Benefícios' : 'Benefits'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      language === 'pt' ? '💰 Econômico para estudantes' : '💰 Economical for students',
                      language === 'pt' ? '🌱 Ecológico e sustentável' : '🌱 Ecological and sustainable',
                      language === 'pt' ? '🚗 Evita trânsito' : '🚗 Avoids traffic',
                      language === 'pt' ? '💪 Exercício diário' : '💪 Daily exercise',
                      language === 'pt' ? '🕐 Disponível 24/7' : '🕐 Available 24/7',
                      language === 'pt' ? '📱 App com mapa' : '📱 App with map'
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Stations */}
            <Card className="border-0 shadow-lg mb-8 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-white to-amber-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Estações Populares' : 'Popular Stations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'City Centre', icon: '🏙️', stops: ["O'Connell Street", 'Grafton Street', 'Dame Street', 'Temple Bar', 'Trinity College'] },
                    { title: language === 'pt' ? 'Áreas de Estudo' : 'Study Areas', icon: '🎓', stops: ['UCD (Belfield)', 'DCU (Glasnevin)', 'TU Dublin', 'RCSI', 'Griffith College'] },
                    { title: language === 'pt' ? 'Pontos Turísticos' : 'Tourist Spots', icon: '📸', stops: ['Phoenix Park', "St Stephen's Green", 'Grand Canal', 'Merrion Square', 'Smithfield'] }
                  ].map((area, i) => (
                    <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">{area.icon}</span>
                        {area.title}
                      </h4>
                      <ul className="space-y-1.5">
                        {area.stops.map((stop, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            {stop}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.dublinbikes.ie/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                data-testid="dublin-bikes-register"
              >
                <Bike className="h-5 w-5" />
                {language === 'pt' ? 'Cadastrar no Dublin Bikes' : 'Register for Dublin Bikes'}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
