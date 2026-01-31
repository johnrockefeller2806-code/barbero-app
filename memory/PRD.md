# ClickBarber - Marketplace de Barbeiros (Dublin, Ireland)

## Última Atualização: 31/01/2026

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Pagamentos**: Stripe
- **Email**: Resend

## Features Implementadas ✅

### Header Completo (31/01/2026)
- [x] Logo + Nome "ClickBarber" 
- [x] Botão Compartilhar (verde) - WhatsApp/Share nativo
- [x] Botão Refresh - Recarrega a página
- [x] Foto do perfil com câmera para upload
- [x] Botão de som (barbeiro) - notificações sonoras
- [x] Logout

### Foto do Cliente (31/01/2026)
- [x] Cliente pode adicionar foto no perfil
- [x] Foto aparece no header do cliente
- [x] Barbeiro vê foto do cliente nos pedidos Home Service

### Modal Home Service Melhorado (31/01/2026)
- [x] Seleção de serviço com botões (não precisa digitar)
- [x] Opções: Barba, Corte, Corte e Barba, Combo
- [x] Campo de endereço para copiar/colar
- [x] Preços visíveis em cada opção

### Sistema de Segurança (31/01/2026)
- [x] Recuperação de senha por email (Resend)
- [x] PIN de 6 dígitos para login rápido
- [x] Login com PIN (estilo app de banco)

### Sincronização Mapa (31/01/2026)
- [x] Marcador VERDE = Barbeiro ONLINE
- [x] Marcador VERMELHO = Barbeiro OFFLINE
- [x] Atualização automática a cada 10 segundos

### Valores Atualizados
- Taxa de deslocamento: €1/km
- Corte: €30, Barba: €15, Combo: €40

### Features Base
- Landing Page
- Autenticação JWT
- Dashboard Cliente/Barbeiro
- Mapa em tempo real
- Rastreamento GPS
- Agendamento
- Gorjetas
- Home Service
- Stripe
- Referral

## Credenciais de Teste
- Barbeiro: test@barber.com / 123456
- Cliente: client@test.com / 123456

## Próximas Features (Backlog)
- [ ] Notificações push nativas (PWA)
- [ ] WhatsApp direto no perfil
- [ ] App mobile nativo
