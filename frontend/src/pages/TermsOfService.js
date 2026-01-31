import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Termos de Uso</h1>
        <p className="text-gray-500 mb-8">Última atualização: Janeiro de 2025</p>
        
        <div className="prose prose-emerald max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Aceitação dos Termos</h2>
          <p className="text-gray-600 mb-4">
            Ao acessar ou usar o aplicativo STUFF Intercâmbio, você concorda com estes Termos de Uso. 
            Se não concordar com algum termo, não utilize nosso serviço.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Descrição do Serviço</h2>
          <p className="text-gray-600 mb-4">
            O STUFF Intercâmbio é uma plataforma que conecta brasileiros interessados em estudar na Irlanda 
            com escolas de inglês, oferecendo:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Catálogo de escolas de inglês em Dublin</li>
            <li>Sistema de matrícula online</li>
            <li>Guias sobre documentação (PPS, GNIB, etc.)</li>
            <li>Informações sobre transporte, turismo e serviços</li>
            <li>Chat da comunidade de intercambistas</li>
            <li>Plano PLUS com benefícios exclusivos</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Cadastro e Conta</h2>
          <p className="text-gray-600 mb-4">
            Para usar certas funcionalidades, você deve criar uma conta fornecendo informações precisas 
            e mantendo-as atualizadas. Você é responsável por:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Manter a confidencialidade de sua senha</li>
            <li>Todas as atividades realizadas em sua conta</li>
            <li>Notificar-nos imediatamente sobre uso não autorizado</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Uso Aceitável</h2>
          <p className="text-gray-600 mb-2">Você concorda em NÃO:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Violar leis ou regulamentos aplicáveis</li>
            <li>Publicar conteúdo ofensivo, difamatório ou ilegal</li>
            <li>Assediar, ameaçar ou discriminar outros usuários</li>
            <li>Tentar acessar contas de outros usuários</li>
            <li>Usar o serviço para spam ou publicidade não autorizada</li>
            <li>Interferir no funcionamento do aplicativo</li>
            <li>Coletar informações de outros usuários sem consentimento</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Pagamentos e Reembolsos</h2>
          <p className="text-gray-600 mb-4">
            Alguns serviços requerem pagamento (Plano PLUS, matrículas em escolas). Ao efetuar um pagamento:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Você autoriza a cobrança através do Stripe</li>
            <li>Preços estão sujeitos a alterações com aviso prévio</li>
            <li>Reembolsos seguem a política de cada escola parceira</li>
            <li>O Plano PLUS pode ser cancelado a qualquer momento, sem reembolso proporcional</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Conteúdo do Usuário</h2>
          <p className="text-gray-600 mb-4">
            Ao publicar conteúdo no chat ou outras áreas do aplicativo:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Você mantém a propriedade do seu conteúdo</li>
            <li>Concede ao STUFF licença para usar, exibir e distribuir o conteúdo</li>
            <li>Garante que tem direito de compartilhar o conteúdo</li>
            <li>Podemos remover conteúdo que viole estes termos</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Escolas Parceiras</h2>
          <p className="text-gray-600 mb-4">
            O STUFF facilita a conexão entre estudantes e escolas, mas:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Não somos responsáveis pela qualidade dos cursos</li>
            <li>Contratos são firmados diretamente com as escolas</li>
            <li>Disputas devem ser resolvidas com a escola em questão</li>
            <li>Recomendamos verificar acreditações e avaliações</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Propriedade Intelectual</h2>
          <p className="text-gray-600 mb-4">
            Todo o conteúdo do STUFF (textos, imagens, logos, código) é protegido por direitos autorais. 
            Você não pode copiar, modificar ou distribuir nosso conteúdo sem autorização prévia.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Limitação de Responsabilidade</h2>
          <p className="text-gray-600 mb-4">
            O STUFF é fornecido "como está". Não garantimos que:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>O serviço será ininterrupto ou livre de erros</li>
            <li>Resultados obtidos serão precisos ou confiáveis</li>
            <li>Defeitos serão corrigidos</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Em nenhum caso seremos responsáveis por danos indiretos, incidentais ou consequenciais.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Encerramento</h2>
          <p className="text-gray-600 mb-4">
            Podemos suspender ou encerrar sua conta se:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Violar estes Termos de Uso</li>
            <li>Fornecer informações falsas</li>
            <li>Prejudicar outros usuários ou o serviço</li>
            <li>Por inatividade prolongada (12+ meses)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Alterações nos Termos</h2>
          <p className="text-gray-600 mb-4">
            Podemos modificar estes termos a qualquer momento. Mudanças significativas serão notificadas 
            através do aplicativo. O uso continuado após alterações constitui aceitação dos novos termos.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Lei Aplicável</h2>
          <p className="text-gray-600 mb-4">
            Estes termos são regidos pelas leis da República da Irlanda. Disputas serão resolvidas 
            nos tribunais de Dublin, Irlanda.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">13. Contato</h2>
          <p className="text-gray-600 mb-4">
            Para dúvidas sobre estes termos:
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
