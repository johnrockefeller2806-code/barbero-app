# STUFF Intercâmbio - PRD (Product Requirements Document)

## Resumo do Projeto
Plataforma marketplace para intercâmbio na Irlanda, conectando estudantes diretamente com escolas de inglês, sem intermediários.

## Status Atual: EM DESENVOLVIMENTO

---

## Funcionalidades Implementadas ✅

### Core Features
1. **Multi-idiomas (PT, EN, ES)** - Seletor de idioma no navbar
2. **Stripe Connect Marketplace** - Comissão de 15% para a plataforma
3. **Apple Pay / Google Pay** - Pagamentos móveis integrados
4. **Sistema de Emails (Resend)** - Notificações automáticas
5. **Acesso aberto** - Sem paywall, todas escolas visíveis
6. **Aprovação automática** - Escolas aprovadas automaticamente

### UI/UX
7. **Framer Motion** ✅ (Implementado 18/02/2026)
   - Animações de entrada (fade-in, slide)
   - Efeitos de hover em cards
   - Animações stagger em listas
   - Elementos flutuantes decorativos
   - Transições suaves entre páginas

### Conteúdo Informativo
8. **Seção Leap Card** - Na página de transporte
9. **Regras da Irlanda** - Guia completo na homepage
   - Requisitos do visto (Stamp 2)
   - Direitos de trabalho
   - Custos estimados
   - Passo a passo do processo

---

## Stack Tecnológica

### Frontend
- React 19
- TailwindCSS
- Shadcn/UI Components
- **Framer Motion** (animações)
- Stripe React SDK

### Backend
- FastAPI (Python)
- MongoDB
- Stripe Connect
- Resend (emails)

---

## Próximas Tarefas (Backlog)

### P0 - Alta Prioridade
- [ ] Teste E2E completo do fluxo de pagamento
- [ ] Verificar notificações de email

### P1 - Média Prioridade  
- [ ] Dashboard administrativo STUFF
- [ ] Animações nas demais páginas (SchoolDetail, Transport, etc.)
- [ ] Limpeza do diretório `/app/John-aplicativo-/`

### P2 - Baixa Prioridade
- [ ] Páginas de perfil público para escolas
- [ ] Sistema de avaliações de estudantes
- [ ] Página de sucesso de pagamento aprimorada

---

## Credenciais Necessárias
- **Stripe API Keys** - Configurar em `backend/.env`
- **Resend API Key** - Configurar em `backend/.env`  
- **ADMIN_EMAIL** - Email para notificações admin

---

## Arquitetura de Arquivos

```
/app/
├── backend/
│   ├── server.py              # API principal
│   ├── services/
│   │   └── email_service.py   # Serviço de emails
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── motion/
│   │   │   │   └── AnimatedComponents.js  # 🆕 Componentes animados
│   │   │   ├── ui/            # Shadcn components
│   │   │   └── CheckoutForm.js
│   │   ├── pages/
│   │   │   ├── Landing.js     # ✅ Com Framer Motion
│   │   │   ├── Schools.js     # ✅ Com Framer Motion
│   │   │   └── ...
│   │   └── context/
│   └── package.json
└── memory/
    └── PRD.md
```

---

## Changelog

### 18/02/2026
- ✅ Implementado Framer Motion na Landing page
- ✅ Implementado Framer Motion na Schools page
- ✅ Criado arquivo de componentes animados reutilizáveis

### 17/02/2026
- ✅ Seção de regras da Irlanda na homepage
- ✅ Sistema de emails via Resend
- ✅ Apple Pay / Google Pay integrados

---

## Notas para Investidores
- Modelo de negócio: Comissão de 15% sobre cada matrícula
- Diferencial: Contato direto escola-estudante, sem intermediários
- Mercado: Brasileiros que querem estudar na Irlanda
