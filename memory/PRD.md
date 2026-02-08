# ClickBarber - Marketplace de Barbeiros (Dublin, Ireland)

## Última Atualização: 08/02/2026

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Pagamentos**: Stripe + Stripe Connect (Marketplace)
- **Email**: Resend

## Features Implementadas ✅

### Stripe Connect - Marketplace (08/02/2026) 🆕
- [x] Seção "Receber Pagamentos" no dashboard do barbeiro
- [x] Botão "Conectar Stripe" para onboarding
- [x] Botão "Completar Cadastro" para barbeiros que iniciaram mas não finalizaram
- [x] Status visual: Conectado/Não conectado/Pendente
- [x] Info box explicando benefícios (10% comissão)
- [x] Backend: POST /api/connect/onboard - Cria conta Stripe Express
- [x] Backend: GET /api/connect/status - Verifica status da conta
- [x] Backend: POST /api/connect/payment - Cria checkout com split automático
- [x] Frontend cliente: Pagamento com cartão redireciona para Stripe Checkout
- [x] Callback de sucesso/cancelamento após pagamento
- [x] Comissão: 10% para ClickBarber, 90% para barbeiro

### Mapa Região Metropolitana de Dublin (04/02/2026)
- [x] Mapa centralizado na região metropolitana de Dublin
- [x] Zoom configurado para mostrar toda a área (nível 11)
- [x] Limites: Swords (norte), Greystones (sul), Lucan/Rathcoole (oeste), Costa (leste)
- [x] Cidades cobertas: Dublin, Swords, Lucan, Bray, Greystones, Rathcoole, Dun Laoghaire
- [x] Rodovias visíveis: M50, N7, M11

### Edição de Localização do Barbeiro (04/02/2026)
- [x] Modal para editar localização
- [x] Campo de endereço completo
- [x] Botão "Usar Minha Localização Atual (GPS)"
- [x] Campos manuais de Latitude/Longitude
- [x] Info sobre área de cobertura
- [x] Validação antes de salvar

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
- Autenticação JWT + Google OAuth
- Dashboard Cliente/Barbeiro
- Mapa em tempo real
- Rastreamento GPS
- Agendamento
- Gorjetas
- Home Service
- Stripe Subscriptions + Stripe Connect
- Referral

## API Endpoints - Stripe Connect

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| /api/connect/onboard | POST | Cria conta Stripe Express para barbeiro |
| /api/connect/status | GET | Verifica status da conta conectada |
| /api/connect/payment | POST | Cria checkout com split 90%/10% |

## Próximas Features (Backlog)

### P1 - Alta Prioridade
- [ ] Pagamento de gorjetas via Stripe Connect
- [ ] Verificar domínio www.clickbarber.ie (aguardando propagação DNS)

### P2 - Média Prioridade
- [ ] Notificações push nativas (PWA)
- [ ] WhatsApp direto no perfil
- [ ] Atualizar email oficial (aguardando usuário)

### P3 - Backlog
- [ ] App mobile nativo (React Native)
- [ ] Perfis públicos de barbeiros
- [ ] Sistema de avaliações
- [ ] Portfolios de fotos
- [ ] Favoritar barbeiros
