import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, MapPin, Lock, Users, Bell, Trash2, Mail } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f16b93ce-5ac3-4503-bae3-65d25ede4a91/artifacts/7tsbrqqb_WhatsApp%20Image%202026-01-30%20at%2021.59.32.jpeg";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="ClickBarber" className="h-10 w-auto object-contain" />
              <span className="font-heading text-xl text-white uppercase tracking-wider">Click<span className="text-amber-500">Barber</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-white uppercase mb-2">Política de Privacidade</h1>
          <p className="text-zinc-500">Última atualização: 31 de Janeiro de 2026</p>
        </div>

        {/* Introduction */}
        <section className="mb-10">
          <p className="text-zinc-300 leading-relaxed">
            A <span className="text-amber-500 font-medium">ClickBarber</span> está comprometida em proteger a sua privacidade. 
            Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos as suas informações 
            pessoais quando você utiliza nossa plataforma de marketplace de barbeiros em Dublin, Irlanda.
          </p>
        </section>

        {/* Section 1 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="font-heading text-xl text-white uppercase">1. Informações que Coletamos</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-amber-500 font-medium mb-2">Dados de Cadastro</h3>
              <ul className="text-zinc-400 space-y-1 list-disc list-inside">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Foto de perfil (opcional)</li>
                <li>Endereço (para barbeiros e serviços em domicílio)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-amber-500 font-medium mb-2">Dados de Uso</h3>
              <ul className="text-zinc-400 space-y-1 list-disc list-inside">
                <li>Histórico de agendamentos</li>
                <li>Avaliações e comentários</li>
                <li>Preferências de serviço</li>
                <li>Interações com a plataforma</li>
              </ul>
            </div>
            <div>
              <h3 className="text-amber-500 font-medium mb-2">Dados de Localização</h3>
              <ul className="text-zinc-400 space-y-1 list-disc list-inside">
                <li>Localização GPS (apenas quando autorizado)</li>
                <li>Endereço para atendimento em domicílio</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="font-heading text-xl text-white uppercase">2. Como Usamos Suas Informações</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <ul className="text-zinc-400 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Prestação de Serviços:</strong> Conectar clientes a barbeiros, processar agendamentos e facilitar pagamentos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Localização em Tempo Real:</strong> Mostrar barbeiros disponíveis no mapa e calcular distâncias para serviços em domicílio.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Comunicação:</strong> Enviar notificações sobre agendamentos, confirmações e atualizações importantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Melhoria da Plataforma:</strong> Analisar dados de uso para melhorar nossos serviços e experiência do usuário.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Segurança:</strong> Proteger contra fraudes e garantir a segurança da plataforma.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="font-heading text-xl text-white uppercase">3. Proteção de Dados</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="text-zinc-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Criptografia de dados em trânsito (HTTPS/SSL)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Senhas criptografadas com hash seguro
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Autenticação por PIN de 6 dígitos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Tokens JWT para sessões seguras
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Acesso restrito aos dados por funcionários autorizados
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="font-heading text-xl text-white uppercase">4. Compartilhamento de Dados</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 mb-4">
              Compartilhamos suas informações apenas nas seguintes situações:
            </p>
            <ul className="text-zinc-400 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Entre Usuários:</strong> Nome, foto e informações de contato são compartilhados entre clientes e barbeiros para facilitar o serviço.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Processadores de Pagamento:</strong> Stripe processa pagamentos de forma segura (não armazenamos dados de cartão).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Provedores de Serviço:</strong> Resend para envio de e-mails transacionais.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Obrigações Legais:</strong> Quando exigido por lei ou ordem judicial.</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">
                <strong>Importante:</strong> Nunca vendemos seus dados pessoais a terceiros para fins de marketing.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="font-heading text-xl text-white uppercase">5. Seus Direitos (GDPR)</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 mb-4">
              De acordo com o Regulamento Geral de Proteção de Dados (GDPR), você tem os seguintes direitos:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="text-white font-medium mb-1">Direito de Acesso</h4>
                <p className="text-zinc-500 text-sm">Solicitar uma cópia dos seus dados pessoais.</p>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="text-white font-medium mb-1">Direito de Retificação</h4>
                <p className="text-zinc-500 text-sm">Corrigir dados incorretos ou incompletos.</p>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="text-white font-medium mb-1">Direito de Exclusão</h4>
                <p className="text-zinc-500 text-sm">Solicitar a exclusão dos seus dados ("direito ao esquecimento").</p>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="text-white font-medium mb-1">Direito de Portabilidade</h4>
                <p className="text-zinc-500 text-sm">Receber seus dados em formato estruturado.</p>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="text-white font-medium mb-1">Direito de Oposição</h4>
                <p className="text-zinc-500 text-sm">Opor-se ao processamento dos seus dados.</p>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="text-white font-medium mb-1">Direito de Restrição</h4>
                <p className="text-zinc-500 text-sm">Limitar como seus dados são processados.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-500" />
            </div>
            <h2 className="font-heading text-xl text-white uppercase">6. Retenção de Dados</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <ul className="text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Dados de Conta:</strong> Mantidos enquanto sua conta estiver ativa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Histórico de Serviços:</strong> Mantido por 3 anos para fins fiscais e legais.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong className="text-white">Após Exclusão:</strong> Dados são removidos em até 30 dias, exceto quando exigido por lei.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="font-heading text-xl text-white uppercase">7. Contato</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
            </p>
            <div className="space-y-2">
              <p className="text-zinc-300">
                <strong className="text-white">E-mail:</strong> privacy@clickbarber.ie
              </p>
              <p className="text-zinc-300">
                <strong className="text-white">Endereço:</strong> Dublin, Ireland
              </p>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm">
            Ao utilizar o ClickBarber, você concorda com esta Política de Privacidade.
          </p>
          <p className="text-zinc-600 text-xs mt-2">
            Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
