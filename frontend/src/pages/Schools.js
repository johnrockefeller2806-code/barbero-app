import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Star, MapPin, Search, Globe, Phone, Mail, 
  ExternalLink, Navigation, Clock, Euro, Users,
  GraduationCap, Building, ChevronRight, X, Award,
  CheckCircle, BookOpen, Wifi, Coffee, Monitor, Library,
  Filter, SlidersHorizontal, Heart, Share2, Calendar,
  TrendingUp, Shield, Sparkles, ArrowRight
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Informações das cidades com dados mais ricos
const cityInfo = {
  Dublin: {
    emoji: "🏙️",
    description: "Capital da Irlanda - Centro financeiro e tecnológico com vida noturna vibrante",
    description_en: "Capital of Ireland - Financial and tech hub with vibrant nightlife",
    students: "50,000+",
    avgPrice: "€180-280"
  },
  Cork: {
    emoji: "🏰",
    description: "Segunda maior cidade - Atmosfera universitária e custo acessível",
    description_en: "Second largest city - University atmosphere and affordable cost",
    students: "15,000+",
    avgPrice: "€150-220"
  },
  Galway: {
    emoji: "🌊",
    description: "Costa oeste - Cultura artística e paisagens deslumbrantes",
    description_en: "West coast - Artistic culture and stunning landscapes",
    students: "8,000+",
    avgPrice: "€160-230"
  },
  Limerick: {
    emoji: "🏛️",
    description: "Centro-oeste - Excelente custo-benefício e comunidade acolhedora",
    description_en: "Mid-west - Excellent value and welcoming community",
    students: "5,000+",
    avgPrice: "€140-200"
  },
  Drogheda: {
    emoji: "🏘️",
    description: "Nordeste - 30 min de Dublin, experiência autêntica irlandesa",
    description_en: "Northeast - 30 min from Dublin, authentic Irish experience",
    students: "2,000+",
    avgPrice: "€130-180"
  }
};

// Facility icons mapping
const facilityIcons = {
  'Wi-Fi': Wifi,
  'Biblioteca': Library,
  'Cafeteria': Coffee,
  'Computadores': Monitor,
  'Sala de estudos': BookOpen,
};

export const Schools = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isPlusUser } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchSchools();
    // Load favorites from localStorage
    const saved = localStorage.getItem('favoriteSchools');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${API}/schools`);
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = (schoolId) => {
    const newFavorites = favorites.includes(schoolId) 
      ? favorites.filter(id => id !== schoolId)
      : [...favorites, schoolId];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteSchools', JSON.stringify(newFavorites));
  };

  // Agrupar escolas por cidade
  const schoolsByCity = schools.reduce((acc, school) => {
    const city = school.city || 'Dublin';
    if (!acc[city]) acc[city] = [];
    acc[city].push(school);
    return acc;
  }, {});

  // Filtrar e ordenar escolas
  const filteredSchools = schools
    .filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.description && school.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCity = selectedCity === 'all' || school.city === selectedCity;
      return matchesSearch && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'reviews') return (b.reviews_count || 0) - (a.reviews_count || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Abrir Google Maps
  const openGoogleMaps = (school) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address + ', ' + school.city + ', Ireland')}`;
    window.open(url, '_blank');
  };

  // Abrir direções
  const openDirections = (school) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(school.address + ', ' + school.city + ', Ireland')}`;
    window.open(url, '_blank');
  };

  // Share school
  const shareSchool = (school) => {
    if (navigator.share) {
      navigator.share({
        title: school.name,
        text: `Confira a ${school.name} na plataforma STUFF Intercâmbio!`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Skeleton className="h-10 w-96 bg-white/20 mb-4" />
            <Skeleton className="h-6 w-64 bg-white/20 mb-8" />
            <Skeleton className="h-14 w-full max-w-2xl bg-white/20 rounded-2xl" />
          </div>
        </div>
        {/* Cards Skeleton */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-[420px] rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" data-testid="schools-page">
      {/* Hero Section - Premium Design */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-200 text-sm mb-6">
                <Sparkles className="h-4 w-4" />
                {language === 'pt' ? 'Todas as escolas certificadas ACELS' : 'All ACELS certified schools'}
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                {language === 'pt' ? (
                  <>Encontre a <span className="text-orange-400">escola perfeita</span> para seu intercâmbio</>
                ) : (
                  <>Find the <span className="text-orange-400">perfect school</span> for your exchange</>
                )}
              </h1>
              
              <p className="text-emerald-100 text-lg lg:text-xl mb-8 max-w-2xl">
                {language === 'pt' 
                  ? `Compare ${schools.length} escolas credenciadas em 5 cidades da Irlanda. Preços transparentes, sem intermediários.`
                  : `Compare ${schools.length} accredited schools in 5 cities in Ireland. Transparent prices, no middlemen.`}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-10">
                <div className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-white">{schools.length}</p>
                  <p className="text-emerald-200 text-sm">{language === 'pt' ? 'Escolas' : 'Schools'}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-white">5</p>
                  <p className="text-emerald-200 text-sm">{language === 'pt' ? 'Cidades' : 'Cities'}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-white">100%</p>
                  <p className="text-emerald-200 text-sm">{language === 'pt' ? 'Certificadas' : 'Certified'}</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <div className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 p-2">
                  <div className="flex-1 flex items-center px-4">
                    <Search className="h-5 w-5 text-gray-400 mr-3" />
                    <Input
                      type="text"
                      placeholder={language === 'pt' ? 'Buscar por nome ou cidade...' : 'Search by name or city...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 focus-visible:ring-0 text-gray-800 placeholder:text-gray-400 text-lg"
                      data-testid="search-input"
                    />
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-12 rounded-xl">
                    <Search className="h-5 w-5 mr-2" />
                    {language === 'pt' ? 'Buscar' : 'Search'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right - Featured Stats Card */}
            <div className="hidden lg:block w-80">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{language === 'pt' ? 'Mais Populares' : 'Most Popular'}</p>
                    <p className="text-emerald-200 text-sm">{language === 'pt' ? 'Esta semana' : 'This week'}</p>
                  </div>
                </div>
                {schools.slice(0, 3).map((school, idx) => (
                  <div key={school.id} className="flex items-center gap-3 py-3 border-t border-white/10">
                    <span className="text-2xl font-bold text-orange-400">#{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{school.name}</p>
                      <p className="text-emerald-200 text-sm">{school.city}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-semibold">{school.rating || '4.5'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 py-4 overflow-x-auto scrollbar-hide">
            {/* City Filters */}
            <button
              onClick={() => setSelectedCity('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCity === 'all'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🌍 {language === 'pt' ? 'Todas' : 'All'} ({schools.length})
            </button>
            
            {Object.entries(schoolsByCity).map(([city, citySchools]) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cityInfo[city]?.emoji || '📍'} {city} ({citySchools.length})
              </button>
            ))}

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300 mx-2"></div>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-full bg-gray-100 text-gray-600 font-medium border-0 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="rating">{language === 'pt' ? '⭐ Melhor Avaliação' : '⭐ Best Rated'}</option>
              <option value="reviews">{language === 'pt' ? '💬 Mais Reviews' : '💬 Most Reviews'}</option>
              <option value="name">{language === 'pt' ? '🔤 Nome A-Z' : '🔤 Name A-Z'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* City Info Banner */}
      {selectedCity !== 'all' && cityInfo[selectedCity] && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl">
                {cityInfo[selectedCity].emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCity}, Irlanda</h2>
                <p className="text-gray-600">
                  {language === 'pt' ? cityInfo[selectedCity].description : cityInfo[selectedCity].description_en}
                </p>
              </div>
              <div className="hidden md:flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{cityInfo[selectedCity].students}</p>
                  <p className="text-sm text-gray-500">{language === 'pt' ? 'Estudantes' : 'Students'}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{cityInfo[selectedCity].avgPrice}</p>
                  <p className="text-sm text-gray-500">{language === 'pt' ? '/semana' : '/week'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            {language === 'pt' 
              ? `${filteredSchools.length} escola${filteredSchools.length !== 1 ? 's' : ''} encontrada${filteredSchools.length !== 1 ? 's' : ''}`
              : `${filteredSchools.length} school${filteredSchools.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Schools Grid - Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school) => (
            <Card 
              key={school.id} 
              className="group overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
              onClick={() => setSelectedSchool(school)}
              data-testid={`school-card-${school.id}`}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={school.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'}
                  alt={school.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80';
                  }}
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className="bg-white/95 text-emerald-700 font-semibold shadow-lg">
                    {cityInfo[school.city]?.emoji || '📍'} {school.city}
                  </Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(school.id);
                    }}
                    className={`p-2.5 rounded-full backdrop-blur-sm transition-all ${
                      favorites.includes(school.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(school.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    {school.rating && (
                      <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-800">{school.rating}</span>
                        <span className="text-gray-500 text-sm">({school.reviews_count || 0})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* School Name */}
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {school.name}
                </h3>

                {/* Address */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{school.address}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {language === 'pt' ? school.description : school.description_en}
                </p>

                {/* Accreditations */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {school.accreditation?.slice(0, 3).map((acc, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {acc}
                    </Badge>
                  ))}
                </div>

                {/* Facilities Preview */}
                <div className="flex items-center gap-3 mb-5 text-gray-400">
                  {school.facilities?.slice(0, 4).map((facility, idx) => {
                    const Icon = facilityIcons[facility] || Building;
                    return (
                      <div key={idx} className="flex items-center" title={facility}>
                        <Icon className="h-4 w-4" />
                      </div>
                    );
                  })}
                  {school.facilities?.length > 4 && (
                    <span className="text-xs">+{school.facilities.length - 4}</span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 -ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSchool(school);
                      }}
                    >
                      {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-full border-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          openGoogleMaps(school);
                        }}
                      >
                        <MapPin className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-full border-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareSchool(school);
                        }}
                      >
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSchools.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {language === 'pt' ? 'Nenhuma escola encontrada' : 'No schools found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'pt' ? 'Tente ajustar seus filtros de busca' : 'Try adjusting your search filters'}
            </p>
            <Button 
              onClick={() => { setSearchTerm(''); setSelectedCity('all'); }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {language === 'pt' ? 'Limpar Filtros' : 'Clear Filters'}
            </Button>
          </div>
        )}
      </div>

      {/* School Detail Modal - Premium Design */}
      {selectedSchool && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSchool(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Image */}
            <div className="relative h-72 lg:h-80">
              <img
                src={selectedSchool.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'}
                alt={selectedSchool.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedSchool(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Share & Favorite */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={() => toggleFavorite(selectedSchool.id)}
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    favorites.includes(selectedSchool.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/40'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(selectedSchool.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => shareSchool(selectedSchool)}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* School Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-emerald-500 text-white text-sm px-3 py-1">
                    {cityInfo[selectedSchool.city]?.emoji} {selectedSchool.city}
                  </Badge>
                  {selectedSchool.rating && (
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-semibold">{selectedSchool.rating}</span>
                      <span className="text-white/70 text-sm">({selectedSchool.reviews_count} reviews)</span>
                    </div>
                  )}
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">{selectedSchool.name}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-20rem)] p-6 lg:p-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-2xl text-center">
                  <Award className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-700">{selectedSchool.accreditation?.length || 3}</p>
                  <p className="text-sm text-emerald-600">{language === 'pt' ? 'Certificações' : 'Certifications'}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">{selectedSchool.reviews_count || 100}+</p>
                  <p className="text-sm text-blue-600">{language === 'pt' ? 'Avaliações' : 'Reviews'}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl text-center">
                  <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">{selectedSchool.facilities?.length || 5}</p>
                  <p className="text-sm text-purple-600">{language === 'pt' ? 'Instalações' : 'Facilities'}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl text-center">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-700">ACELS</p>
                  <p className="text-sm text-orange-600">{language === 'pt' ? 'Certificada' : 'Certified'}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Sobre a Escola' : 'About the School'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'pt' ? selectedSchool.description : selectedSchool.description_en}
                </p>
              </div>

              {/* Location & Contact */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Localização e Contato' : 'Location & Contact'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{language === 'pt' ? 'Endereço' : 'Address'}</p>
                      <p className="text-gray-600">{selectedSchool.address}</p>
                    </div>
                  </div>
                  {selectedSchool.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{language === 'pt' ? 'Telefone' : 'Phone'}</p>
                        <a href={`tel:${selectedSchool.phone}`} className="text-blue-600 hover:underline">
                          {selectedSchool.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedSchool.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Email</p>
                        <a href={`mailto:${selectedSchool.email}`} className="text-purple-600 hover:underline">
                          {selectedSchool.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedSchool.website && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Globe className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Website</p>
                        <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                          {language === 'pt' ? 'Visitar site' : 'Visit website'}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Facilities */}
              {selectedSchool.facilities && selectedSchool.facilities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-emerald-600" />
                    {language === 'pt' ? 'Instalações' : 'Facilities'}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedSchool.facilities.map((facility, idx) => {
                      const Icon = facilityIcons[facility] || CheckCircle;
                      return (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl"
                        >
                          <Icon className="h-5 w-5 text-emerald-600" />
                          <span className="font-medium text-gray-700">{facility}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Accreditations */}
              {selectedSchool.accreditation && selectedSchool.accreditation.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    {language === 'pt' ? 'Certificações e Acreditações' : 'Certifications & Accreditations'}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedSchool.accreditation.map((acc, idx) => (
                      <Badge 
                        key={idx} 
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {acc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg rounded-xl"
                  onClick={() => navigate(`/schools/${selectedSchool.id}`)}
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {language === 'pt' ? 'Ver Cursos Disponíveis' : 'View Available Courses'}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-14 text-lg rounded-xl"
                  onClick={() => openGoogleMaps(selectedSchool)}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  {language === 'pt' ? 'Ver no Mapa' : 'View on Map'}
                </Button>
                <Button
                  variant="outline"
                  className="sm:w-14 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 h-14 rounded-xl"
                  onClick={() => openDirections(selectedSchool)}
                >
                  <Navigation className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
