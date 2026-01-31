# ClickBarber - Marketplace de Barbeiros (Dublin, Ireland)

## Última Atualização: 31/01/2026

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Pagamentos**: Stripe
- **Email**: Resend

## Features Implementadas ✅

### Header Atualizado (31/01/2026)
- [x] Logo + Nome "ClickBarber" no header
- [x] "CLICK" em branco, "BARBER" em dourado
- [x] Aplicado em ambos dashboards (cliente e barbeiro)

### Sincronização de Status Online/Offline (31/01/2026)
- [x] Marcador VERDE no mapa = Barbeiro ONLINE
- [x] Marcador VERMELHO no mapa = Barbeiro OFFLINE
- [x] Bolinha vermelha na lista quando offline
- [x] Atualização automática a cada 10 segundos

### Valores Atualizados (31/01/2026)
- [x] Taxa de deslocamento: €1/km (era €2/km)
- [x] Corte: €30
- [x] Barba: €15
- [x] Combo: €40

### Sistema de Segurança (31/01/2026)
- [x] Recuperação de senha por email (Resend)
- [x] PIN de 6 dígitos para login rápido
- [x] Login com PIN (estilo app de banco)

### Sistema de Notificação Sonora (31/01/2026)
- [x] Som de alerta para novos clientes
- [x] Botão toggle no header
- [x] Compatível com iOS/Safari

### Features Base
- Landing Page
- Sistema de Autenticação JWT
- Dashboard Cliente/Barbeiro
- Mapa em tempo real com Leaflet
- Rastreamento GPS bidirecional
- Sistema de agendamento
- Gorjetas (Tips)
- Home Service
- Upload de foto de perfil
- Integração Stripe
- Sistema de referral

## Próximas Features (Backlog)
- [ ] Verificar domínio no Resend para produção
- [ ] Notificações push nativas (PWA)
- [ ] WhatsApp direto no perfil
- [ ] App mobile nativo
