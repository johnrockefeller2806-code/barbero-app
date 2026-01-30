# QuickCut - Barber Booking Platform

## Problema Original
Aplicativo de agendamento de barbearias para Dublin, Irlanda. Usuário solicitou DUAS versões:
1. **Mobile** - React Native/Expo (estrutura em `/app/mobile`)
2. **Web** - React webapp (implementada em `/app/frontend`)

## Arquitetura
- **Backend**: FastAPI + MongoDB (Python)
- **Frontend Web**: React + Tailwind CSS + Lucide Icons
- **Mobile**: React Native + Expo SDK 54 (estrutura base)
- **Auth**: JWT com roles (client, barber, admin)
- **Design**: Dark Mode Ultra Moderno 2025

## User Personas
1. **Cliente** - Quer encontrar barbeiro disponível AGORA
2. **Barbeiro** - Quer receber agendamentos e gerenciar disponibilidade

## Core Requirements (Static)
- Ver barbeiros disponíveis em tempo real
- Agendamento instantâneo
- Toggle de disponibilidade para barbeiros
- Dashboard com estatísticas
- Reviews e avaliações
- Serviços customizáveis por barbeiro

## Implementado - Janeiro 2026

### Web App ✅
- **Landing Page** - Hero moderno com glassmorphism
- **Login/Register** - Fluxo separado para Cliente e Barbeiro
- **Client Home** - Lista de barbeiros com filtros (Available/All/Top Rated)
- **Barber Detail** - Serviços, seleção de data/hora, booking
- **Bookings** - Lista de agendamentos do cliente
- **Barber Dashboard** - Toggle de disponibilidade, stats do dia, bookings

### Backend API (21 endpoints) ✅
- Auth: register, register-barber, login, me
- Barbers: available, list, detail, availability, location
- Services: list, create, delete
- Bookings: create, my, barber, status, cancel
- Reviews: create, list
- Dashboard: barber stats
- Seed: demo data

### Design System ✅
- **Tema**: Dark Mode (#0a0a0f base)
- **Primary**: Electric Violet (#7c3aed → #a855f7)
- **Secondary**: Neon Cyan (#06b6d4 → #22d3ee)
- **Accent**: Neon Green (#00ff88) para disponibilidade
- **Efeitos**: Glassmorphism, Glow effects, Animated orbs

### Mobile (Estrutura Base) ✅
- Estrutura completa em `/app/mobile`
- Telas: Login, Register, ClientHome, BarberHome
- Componentes: BarberCard, AvailabilityToggle, Button
- Contexts: Auth, Location
- Pronto para `npm install && expo start`

## Credenciais de Teste
- **Cliente**: john@example.com / client123
- **Barbeiro**: james@fadedublin.ie / barber123

## Prioritized Backlog

### P0 - Próximos Passos
- [ ] Mapa com localização dos barbeiros (Google Maps)
- [ ] Push notifications para novos agendamentos
- [ ] Pagamento integrado (Stripe)

### P1 - Importante
- [ ] Chat entre cliente e barbeiro
- [ ] Fotos do trabalho do barbeiro (portfolio)
- [ ] Favoritos (salvar barbeiros)
- [ ] Histórico de cortes

### P2 - Nice to Have
- [ ] Face ID / Touch ID para login
- [ ] PWA para web
- [ ] Dark/Light mode toggle
- [ ] Múltiplos idiomas (PT/EN)

## Tecnologias
- FastAPI 0.110.1
- React 19
- MongoDB (motor)
- Tailwind CSS 3.4
- Lucide React (icons)
- React Native + Expo SDK 54 (mobile)

## Estrutura de Pastas
```
/app
├── backend/          # FastAPI API
│   └── server.py
├── frontend/         # React Web App
│   └── src/
│       ├── pages/    # Landing, Login, Register, ClientHome, BarberDetail, Bookings, BarberDashboard
│       └── context/  # AuthContext
├── mobile/           # React Native App (estrutura pronta)
│   ├── App.tsx
│   └── src/
│       ├── screens/  # auth, client, barber
│       ├── components/
│       ├── context/
│       └── theme/
└── memory/           # PRD.md
```
