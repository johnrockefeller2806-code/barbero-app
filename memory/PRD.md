# ClickBarber - Marketplace de Barbeiros (Dublin, Ireland)

## Problema Original
Marketplace de barbeiros em tempo real para Dublin. Barbeiros ficam Online/Offline, clientes visualizam no mapa. Atendimento em domicílio com taxa de deslocamento.

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Pagamentos**: Stripe

## Features Implementadas ✅

### Sistema de Notificação Sonora (31/01/2026)
- [x] Som de alerta quando novo cliente entra na fila
- [x] Som de alerta para interesse em Home Service
- [x] Botão toggle no header (Volume2/VolumeX icons)
- [x] Preferência salva no localStorage
- [x] Notificação push do navegador
- [x] Som usando Web Audio API (3 tons agradáveis)

### Features Anteriores
- Landing Page em inglês
- Sistema de Autenticação JWT
- Dashboard Cliente/Barbeiro
- Mapa em tempo real com Leaflet
- Rastreamento GPS bidirecional
- Sistema de agendamento
- Gorjetas (Tips)
- Home Service com interesse
- Upload de foto de perfil
- Integração Stripe
- Sistema de referral

## Próximas Features (Backlog)
- [ ] Notificações push nativas (PWA)
- [ ] WhatsApp direto no perfil
- [ ] Compartilhar no Instagram Stories
- [ ] App mobile nativo
