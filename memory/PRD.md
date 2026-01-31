# ClickBarber - Marketplace de Barbeiros (Dublin, Ireland)

## Problema Original
Marketplace de barbeiros em tempo real para Dublin. Barbeiros ficam Online/Offline, clientes visualizam no mapa. Atendimento em domicílio com taxa de deslocamento.

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Pagamentos**: Stripe
- **Email**: Resend

## Features Implementadas ✅

### Sistema de Segurança (31/01/2026)
- [x] Recuperação de senha por email (Resend)
- [x] Código de 6 dígitos enviado por email
- [x] Reset de senha com validação de código
- [x] PIN de 6 dígitos para login rápido
- [x] Configuração de PIN após primeiro login
- [x] Login com PIN (estilo app de banco)
- [x] Detecção automática se usuário tem PIN

### Sistema de Notificação Sonora (31/01/2026)
- [x] Som de alerta quando novo cliente entra na fila
- [x] Som de alerta para interesse em Home Service
- [x] Botão toggle no header (Volume2/VolumeX icons)
- [x] Preferência salva no localStorage
- [x] Notificação push do navegador

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

## Configuração Resend
- API Key configurada no backend
- Emails enviados via onboarding@resend.dev (modo teste)
- Para produção: verificar domínio próprio no Resend

## Próximas Features (Backlog)
- [ ] Verificar domínio no Resend para emails em produção
- [ ] Notificações push nativas (PWA)
- [ ] WhatsApp direto no perfil
- [ ] Compartilhar no Instagram Stories
- [ ] App mobile nativo
