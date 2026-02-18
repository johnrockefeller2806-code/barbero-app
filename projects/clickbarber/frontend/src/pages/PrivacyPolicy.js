import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 mb-8">Última atualização: Janeiro de 2025</p>
        
        <div className="prose prose-emerald max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Introdução</h2>
          <p className="text-gray-600 mb-4">
            A STUFF Intercâmbio ("nós", "nosso" ou "empresa") está comprometida em proteger a privacidade dos usuários 
            ("você" ou "usuário") do nosso aplicativo e website. Esta Política de Privacidade explica como coletamos, 
            usamos, divulgamos e protegemos suas informações.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Informações que Coletamos</h2>
          <p className="text-gray-600 mb-2">Coletamos os seguintes tipos de informações:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Informações de Cadastro:</strong> Nome, email, telefone e senha ao criar uma conta.</li>
            <li><strong>Informações de Uso:</strong> Como você interage com nosso aplicativo, páginas visitadas e recursos utilizados.</li>
            <li><strong>Informações de Dispositivo:</strong> Tipo de dispositivo, sistema operacional e identificadores únicos.</li>
            <li><strong>Informações de Localização:</strong> Apenas quando você permite, para oferecer serviços relevantes.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Como Usamos suas Informações</h2>
          <p className="text-gray-600 mb-2">Utilizamos suas informações para:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Processar matrículas em escolas parceiras</li>
            <li>Enviar notificações importantes sobre seu intercâmbio</li>
            <li>Enviar SMS de recuperação de senha via Twilio</li>
            <li>Personalizar sua experiência no aplicativo</li>
            <li>Responder suas dúvidas e fornecer suporte</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Compartilhamento de Informações</h2>
          <p className="text-gray-600 mb-4">
            Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Escolas Parceiras:</strong> Quando você solicita matrícula, compartilhamos informações necessárias.</li>
            <li><strong>Provedores de Serviço:</strong> Como Twilio (SMS), Stripe (pagamentos), que processam dados em nosso nome.</li>
            <li><strong>Requisitos Legais:</strong> Quando exigido por lei ou para proteger nossos direitos.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Segurança dos Dados</h2>
          <p className="text-gray-600 mb-4">
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
            <li>Senhas armazenadas com hash seguro (bcrypt)</li>
            <li>Acesso restrito aos dados pessoais</li>
            <li>Monitoramento de segurança contínuo</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Seus Direitos</h2>
          <p className="text-gray-600 mb-2">Você tem direito a:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados incorretos</li>
            <li>Solicitar exclusão de sua conta</li>
            <li>Retirar consentimento a qualquer momento</li>
            <li>Exportar seus dados em formato legível</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Cookies e Tecnologias Similares</h2>
          <p className="text-gray-600 mb-4">
            Utilizamos cookies e tecnologias similares para melhorar sua experiência, lembrar preferências 
            e analisar como nosso aplicativo é usado. Você pode controlar cookies através das configurações 
            do seu navegador.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Retenção de Dados</h2>
          <p className="text-gray-600 mb-4">
            Mantemos suas informações enquanto sua conta estiver ativa ou conforme necessário para fornecer 
            nossos serviços. Após exclusão da conta, podemos reter alguns dados por até 5 anos para fins 
            legais e fiscais.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Menores de Idade</h2>
          <p className="text-gray-600 mb-4">
            Nosso serviço é destinado a maiores de 16 anos. Menores de 18 anos devem ter autorização 
            dos pais ou responsáveis para usar o aplicativo.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Alterações nesta Política</h2>
          <p className="text-gray-600 mb-4">
            Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
            através do aplicativo ou por email.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Contato</h2>
          <p className="text-gray-600 mb-4">
            Para dúvidas sobre esta política ou suas informações pessoais, entre em contato:
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>STUFF Intercâmbio</strong></p>
            <p className="text-gray-600">Email: contatostuffintercambio@gmail.com</p>
            <p className="text-gray-600">Website: www.stuffintercambio.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
