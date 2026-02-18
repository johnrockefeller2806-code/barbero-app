# ClickBarber - Marketplace de Barbeiros

## Resumo do Projeto
Plataforma marketplace para conectar clientes a barbeiros em Dublin, em tempo real. Os clientes podem ver barbeiros disponíveis no mapa, agendar serviços e receber atendimento em domicílio.

## Status Atual: EM DESENVOLVIMENTO ✅

---

## Funcionalidades Implementadas ✅

### Core Features
1. **Mapa em Tempo Real** - Visualização de barbeiros disponíveis com Leaflet
2. **Dashboard do Barbeiro** - Toggle Online/Offline, gerenciamento de serviços
3. **Dashboard do Cliente** - Busca, reservas e histórico
4. **Home Service** - Atendimento em domicílio com cálculo de taxa de deslocamento
5. **Autenticação JWT** - Login/Registro para clientes e barbeiros
6. **Multi-idiomas** - Português e Inglês

### UI/UX
7. **Framer Motion** ✅ (Implementado 18/02/2026)
   - Hero com animações de entrada
   - Logo animada com hover effects
   - Botões com shimmer effect e sombras dinâmicas
   - Seta animada nos CTAs
   - Cards com hover scale e glow
   - Tesoura animada no botão "Sou Barbeiro"
   - Texto "BARBER" com glow pulsante
   - Scroll indicator animado
   - Imagem de barbeiro com transição grayscale

---

## Stack Tecnológica

### Frontend
- React 19
- TailwindCSS
- Shadcn/UI Components
- **Framer Motion** (animações)
- **Leaflet** (mapas)
- Lucide Icons

### Backend
- FastAPI (Python)
- MongoDB
- JWT Authentication

---

## Próximas Tarefas (Backlog)

### P0 - Alta Prioridade
- [ ] Testar fluxo completo cliente -> barbeiro
- [ ] Verificar mapa com localização em Dublin

### P1 - Média Prioridade  
- [ ] Adicionar animações nas páginas internas (Dashboard, Auth)
- [ ] Sistema de pagamentos (Stripe)
- [ ] Notificações push

### P2 - Baixa Prioridade
- [ ] Sistema de avaliações
- [ ] Chat entre cliente e barbeiro
- [ ] Histórico de atendimentos

---

## Arquitetura de Arquivos

```
/app/
├── backend/
│   ├── server.py              # API principal com endpoints
│   ├── requirements.txt
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── motion/
│   │   │   │   └── AnimatedComponents.js  # Componentes Framer Motion
│   │   │   ├── ui/            # Shadcn components
│   │   │   └── Map.js         # Componente de mapa Leaflet
│   │   ├── pages/
│   │   │   ├── LandingPage.js  # ✅ Com Framer Motion
│   │   │   ├── BarberDashboard.js
│   │   │   ├── ClientDashboard.js
│   │   │   └── Auth.js
│   │   ├── contexts/
│   │   │   └── LanguageContext.js
│   │   └── i18n/
│   └── package.json
└── memory/
    └── PRD.md
```

---

## Changelog

### 18/02/2026
- ✅ Migrado de STUFF Intercâmbio para ClickBarber
- ✅ Implementado Framer Motion na Landing Page
- ✅ Animações premium: shimmer, glow, hover effects
- ✅ Logo animada, tesoura animada, scroll indicator

---

## Modelos de Dados

### User
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "user_type": "client | barber",
  "latitude": "float",
  "longitude": "float",
  "is_online": "boolean",
  "offers_home_service": "boolean",
  "home_service_fee_per_km": "float"
}
```

### Booking
```json
{
  "id": "uuid",
  "client_id": "uuid",
  "barber_id": "uuid",
  "service": "object",
  "status": "pending | confirmed | completed | cancelled",
  "is_home_service": "boolean",
  "travel_fee": "float"
}
```

---

## Preview URL
https://stuff-exchange.preview.emergentagent.com (ClickBarber)
