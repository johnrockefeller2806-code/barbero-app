import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  GraduationCap, 
  BookOpen,
  Users,
  Euro,
  Plus,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  FileText,
  CreditCard,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const SchoolDashboard = () => {
  const navigate = useNavigate();
  const { user, isSchool, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Course dialog
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    duration_weeks: 25,
    hours_per_week: 15,
    level: 'all_levels',
    price: 0,
    requirements: [],
    includes: [],
    start_dates: [],
    available_spots: 20
  });
  
  // Letter dialog
  const [letterDialogOpen, setLetterDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [letterUrl, setLetterUrl] = useState('');
  
  // Stripe Connect state
  const [stripeStatus, setStripeStatus] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    if (!authLoading && !isSchool) {
      navigate('/');
      return;
    }
    if (isSchool) {
      fetchData();
    }
  }, [isSchool, authLoading]);

  const fetchData = async () => {
    try {
      const [dashboardRes, coursesRes, enrollmentsRes, stripeRes, earningsRes] = await Promise.all([
        axios.get(`${API}/school/dashboard`),
        axios.get(`${API}/school/courses`),
        axios.get(`${API}/school/enrollments`),
        axios.get(`${API}/school/stripe/status`).catch(() => ({ data: null })),
        axios.get(`${API}/school/earnings`).catch(() => ({ data: null }))
      ]);
      setDashboard(dashboardRes.data);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
      setStripeStatus(stripeRes.data);
      setEarnings(earningsRes.data);
    } catch (error) {
      console.error('Error fetching school data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      name: '',
      name_en: '',
      description: '',
      description_en: '',
      duration_weeks: 25,
      hours_per_week: 15,
      level: 'all_levels',
      price: 0,
      requirements: [],
      includes: [],
      start_dates: [],
      available_spots: 20
    });
    setCourseDialogOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      name: course.name,
      name_en: course.name_en,
      description: course.description,
      description_en: course.description_en,
      duration_weeks: course.duration_weeks,
      hours_per_week: course.hours_per_week,
      level: course.level,
      price: course.price,
      requirements: course.requirements || [],
      includes: course.includes || [],
      start_dates: course.start_dates || [],
      available_spots: course.available_spots
    });
    setCourseDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        await axios.put(`${API}/school/courses/${editingCourse.id}`, courseForm);
        toast.success('Curso atualizado!');
      } else {
        await axios.post(`${API}/school/courses`, courseForm);
        toast.success('Curso criado!');
      }
      setCourseDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar curso');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    try {
      await axios.delete(`${API}/school/courses/${courseId}`);
      toast.success('Curso excluído');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir curso');
    }
  };

  const handleSendLetter = async () => {
    if (!selectedEnrollment || !letterUrl) return;
    try {
      await axios.put(
        `${API}/school/enrollments/${selectedEnrollment.id}/send-letter?letter_url=${encodeURIComponent(letterUrl)}`
      );
      toast.success('Carta enviada com sucesso!');
      setLetterDialogOpen(false);
      setLetterUrl('');
      setSelectedEnrollment(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao enviar carta');
    }
  };

  const openLetterDialog = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setLetterUrl('');
    setLetterDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-800', icon: Clock },
      paid: { label: 'Pago', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      approved: { label: 'Aprovado', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      active: { label: 'Ativo', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      inactive: { label: 'Inativo', className: 'bg-slate-100 text-slate-800', icon: Clock },
    };
    const c = config[status] || config.pending;
    return (
      <Badge className={`${c.className} gap-1`}>
        <c.icon className="h-3 w-3" />
        {c.label}
      </Badge>
    );
  };

  const getLevelLabel = (level) => {
    const labels = {
      all_levels: 'Todos os níveis',
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
    };
    return labels[level] || level;
  };

  // Stripe Connect functions
  const handleConnectStripe = async () => {
    setStripeLoading(true);
    try {
      const response = await axios.post(`${API}/school/stripe/onboard`, {
        origin_url: window.location.origin
      });
      // Redirect to Stripe onboarding
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      toast.error('Erro ao conectar Stripe');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleOpenStripeDashboard = async () => {
    try {
      const response = await axios.get(`${API}/school/stripe/dashboard`);
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Error opening Stripe dashboard:', error);
      toast.error('Erro ao abrir dashboard do Stripe');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12" data-testid="school-loading">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  const school = dashboard?.school;
  const stats = dashboard?.stats;
  const isPending = school?.status === 'pending';

  return (
    <div className="min-h-screen bg-slate-50" data-testid="school-dashboard">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-700 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">
                {school?.name || 'Minha Escola'}
              </h1>
              {getStatusBadge(school?.status)}
            </div>
          </div>
          <p className="text-emerald-200">Gerencie seus cursos e matrículas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-12 mb-8">
          <Card className="border-slate-100 shadow-lg" data-testid="stat-courses">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cursos</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.total_courses || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 shadow-lg" data-testid="stat-enrollments">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <GraduationCap className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Matrículas</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.total_enrollments || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 shadow-lg" data-testid="stat-pending-letters">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <FileText className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cartas Pendentes</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.pending_letters || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 shadow-lg" data-testid="stat-revenue">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Euro className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Receita</p>
                <p className="text-2xl font-bold text-slate-900">
                  €{(stats?.total_revenue || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-100 p-1">
            <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">Cursos</TabsTrigger>
            <TabsTrigger value="enrollments" data-testid="tab-enrollments">
              Matrículas
              {stats?.pending_letters > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white">{stats?.pending_letters}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">
              <CreditCard className="h-4 w-4 mr-1" />
              Pagamentos
              {!stripeStatus?.onboarding_complete && (
                <Badge className="ml-2 bg-red-500 text-white">!</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* School Info */}
              <Card className="border-slate-100">
                <CardHeader>
                  <CardTitle className="font-serif">Informações da Escola</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-500">Nome</Label>
                    <p className="font-medium">{school?.name}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500">Endereço</Label>
                    <p className="font-medium">{school?.address}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500">Telefone</Label>
                    <p className="font-medium">{school?.phone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500">Email</Label>
                    <p className="font-medium">{school?.email}</p>
                  </div>
                  {school?.accreditation?.length > 0 && (
                    <div>
                      <Label className="text-slate-500">Acreditações</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {school.accreditation.map((acc, i) => (
                          <Badge key={i} variant="secondary">{acc}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Enrollments */}
              <Card className="border-slate-100">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Matrículas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {enrollments.slice(0, 5).map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{enrollment.user_name}</p>
                          <p className="text-xs text-slate-500">{enrollment.course_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {enrollment.status === 'paid' && !enrollment.letter_sent && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openLetterDialog(enrollment)}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Enviar Carta
                            </Button>
                          )}
                          {enrollment.letter_sent && (
                            <Badge className="bg-emerald-100 text-emerald-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Carta Enviada
                            </Badge>
                          )}
                          {getStatusBadge(enrollment.status)}
                        </div>
                      </div>
                    ))}
                    {enrollments.length === 0 && (
                      <p className="text-slate-500 text-center py-4">Nenhuma matrícula ainda</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card className="border-slate-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-serif">Meus Cursos</CardTitle>
                <Button 
                  onClick={handleCreateCourse}
                  disabled={isPending}
                  className="bg-emerald-900 hover:bg-emerald-800"
                  data-testid="create-course-btn"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Curso
                </Button>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Nenhum curso cadastrado</p>
                    {!isPending && (
                      <Button 
                        onClick={handleCreateCourse}
                        className="mt-4 bg-emerald-900 hover:bg-emerald-800"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Curso
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Nível</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Vagas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id} data-testid={`course-row-${course.id}`}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell>{course.duration_weeks} semanas</TableCell>
                          <TableCell>{getLevelLabel(course.level)}</TableCell>
                          <TableCell>€{course.price.toLocaleString()}</TableCell>
                          <TableCell>{course.available_spots}</TableCell>
                          <TableCell>{getStatusBadge(course.status || 'active')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enrollments Tab */}
          <TabsContent value="enrollments">
            <Card className="border-slate-100">
              <CardHeader>
                <CardTitle className="font-serif">Matrículas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Carta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">{enrollment.user_name}</TableCell>
                        <TableCell>{enrollment.user_email}</TableCell>
                        <TableCell>{enrollment.course_name}</TableCell>
                        <TableCell>{new Date(enrollment.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>€{enrollment.price.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                        <TableCell>
                          {enrollment.status === 'paid' && !enrollment.letter_sent ? (
                            <Button 
                              size="sm"
                              onClick={() => openLetterDialog(enrollment)}
                              className="bg-amber-600 hover:bg-amber-500"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Enviar
                            </Button>
                          ) : enrollment.letter_sent ? (
                            <Badge className="bg-emerald-100 text-emerald-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Enviada
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {enrollments.length === 0 && (
                  <p className="text-slate-500 text-center py-8">Nenhuma matrícula</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="space-y-6">
              {/* Stripe Connect Status */}
              <Card className="border-slate-100">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Stripe Connect
                  </CardTitle>
                  <CardDescription>
                    Conecte sua conta Stripe para receber pagamentos diretamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stripeStatus?.onboarding_complete ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="font-medium text-emerald-900">Stripe Conectado</p>
                          <p className="text-sm text-emerald-700">Sua conta está ativa e pronta para receber pagamentos</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-500">Taxa da Plataforma</p>
                          <p className="text-2xl font-bold text-slate-900">{stripeStatus?.commission_rate || 15}%</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-500">Você Recebe</p>
                          <p className="text-2xl font-bold text-emerald-600">{100 - (stripeStatus?.commission_rate || 15)}%</p>
                        </div>
                      </div>

                      <Button onClick={handleOpenStripeDashboard} className="w-full" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Dashboard do Stripe
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                        <div>
                          <p className="font-medium text-amber-900">Stripe não conectado</p>
                          <p className="text-sm text-amber-700">
                            Conecte sua conta para receber pagamentos dos alunos automaticamente
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Aluno paga pelo app usando cartão</li>
                          <li>• 15% fica com a plataforma STUFF</li>
                          <li>• 85% vai direto para sua conta Stripe</li>
                          <li>• Transferência automática para seu banco</li>
                        </ul>
                      </div>

                      <Button 
                        onClick={handleConnectStripe} 
                        className="w-full bg-[#635BFF] hover:bg-[#524DDB]"
                        disabled={stripeLoading}
                      >
                        {stripeLoading ? (
                          <>Conectando...</>
                        ) : (
                          <>
                            <Wallet className="h-4 w-4 mr-2" />
                            Conectar Stripe
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Earnings Summary */}
              {earnings && (
                <Card className="border-slate-100">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Euro className="h-5 w-5" />
                      Resumo de Ganhos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500">Total Bruto</p>
                        <p className="text-xl font-bold text-slate-900">€{earnings.summary?.total_gross?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">Taxa STUFF (15%)</p>
                        <p className="text-xl font-bold text-red-700">-€{earnings.summary?.total_commission?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <p className="text-sm text-emerald-600">Seu Total Líquido</p>
                        <p className="text-xl font-bold text-emerald-700">€{earnings.summary?.total_net?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Total de Matrículas</p>
                        <p className="text-xl font-bold text-blue-700">{earnings.summary?.total_enrollments || 0}</p>
                      </div>
                    </div>

                    {earnings.monthly && Object.keys(earnings.monthly).length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Ganhos por Mês</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Mês</TableHead>
                              <TableHead>Matrículas</TableHead>
                              <TableHead>Bruto</TableHead>
                              <TableHead>Taxa</TableHead>
                              <TableHead>Líquido</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(earnings.monthly)
                              .sort((a, b) => b[0].localeCompare(a[0]))
                              .map(([month, data]) => (
                                <TableRow key={month}>
                                  <TableCell className="font-medium">{month}</TableCell>
                                  <TableCell>{data.count || 0}</TableCell>
                                  <TableCell>€{data.gross?.toFixed(2)}</TableCell>
                                  <TableCell className="text-red-600">-€{data.commission?.toFixed(2)}</TableCell>
                                  <TableCell className="text-emerald-600 font-medium">€{data.net?.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Course Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingCourse ? 'Editar Curso' : 'Novo Curso'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome (PT)</Label>
                <Input
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  placeholder="Inglês Geral - 25 semanas"
                  data-testid="course-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Nome (EN)</Label>
                <Input
                  value={courseForm.name_en}
                  onChange={(e) => setCourseForm({...courseForm, name_en: e.target.value})}
                  placeholder="General English - 25 weeks"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição (PT)</Label>
              <Textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição (EN)</Label>
              <Textarea
                value={courseForm.description_en}
                onChange={(e) => setCourseForm({...courseForm, description_en: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Duração (semanas)</Label>
                <Input
                  type="number"
                  value={courseForm.duration_weeks}
                  onChange={(e) => setCourseForm({...courseForm, duration_weeks: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Horas/Semana</Label>
                <Input
                  type="number"
                  value={courseForm.hours_per_week}
                  onChange={(e) => setCourseForm({...courseForm, hours_per_week: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Vagas</Label>
                <Input
                  type="number"
                  value={courseForm.available_spots}
                  onChange={(e) => setCourseForm({...courseForm, available_spots: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nível</Label>
                <Select 
                  value={courseForm.level} 
                  onValueChange={(v) => setCourseForm({...courseForm, level: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_levels">Todos os níveis</SelectItem>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preço (EUR)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({...courseForm, price: parseFloat(e.target.value)})}
                  data-testid="course-price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Datas de Início (uma por linha, formato YYYY-MM-DD)</Label>
              <Textarea
                value={courseForm.start_dates.join('\n')}
                onChange={(e) => setCourseForm({
                  ...courseForm, 
                  start_dates: e.target.value.split('\n').filter(d => d.trim())
                })}
                placeholder="2025-01-13&#10;2025-02-10&#10;2025-03-10"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveCourse}
              className="bg-emerald-900 hover:bg-emerald-800"
              data-testid="save-course-btn"
            >
              {editingCourse ? 'Salvar' : 'Criar Curso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Letter Dialog */}
      <Dialog open={letterDialogOpen} onOpenChange={setLetterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Enviar Carta de Aceitação</DialogTitle>
            <DialogDescription>
              Para: {selectedEnrollment?.user_name} ({selectedEnrollment?.user_email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>URL da Carta (PDF)</Label>
              <Input
                value={letterUrl}
                onChange={(e) => setLetterUrl(e.target.value)}
                placeholder="https://..."
                data-testid="letter-url"
              />
              <p className="text-xs text-slate-500">
                Insira o link para o PDF da carta de aceitação
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLetterDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSendLetter}
              disabled={!letterUrl}
              className="bg-emerald-900 hover:bg-emerald-800"
              data-testid="send-letter-btn"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Carta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
