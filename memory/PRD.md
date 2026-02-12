# ClickBarber - Marketplace de Barbeiros (Dublin, Ireland)

## Última Atualização: 12/02/2026

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Pagamentos**: Stripe + Stripe Connect (Marketplace)
- **Email**: Resend

## Status do Sistema: ✅ FUNCIONAL

### Verificação Completa Realizada: 12/02/2026
- Backend: 87% testes passaram (20/23)
- Frontend: 100% elementos verificados

## Features Implementadas ✅

### Stripe Connect - Marketplace
- [x] Seção "Receber Pagamentos" no dashboard do barbeiro
- [x] Botão "Conectar Stripe" para onboarding
- [x] Status visual: Conectado/Não conectado/Pendente
- [x] Backend: POST /api/connect/onboard
- [x] Backend: GET /api/connect/status
- [x] Backend: POST /api/connect/payment
- [x] Comissão: 10% para ClickBarber, 90% para barbeiro

### Autenticação
- [x] Registro de cliente e barbeiro
- [x] Login com email/password
- [x] Login com PIN de 6 dígitos
- [x] Recuperação de senha por email
- [x] Google OAuth

### Mapa e Barbeiros
- [x] Mapa centralizado em Dublin
- [x] Marcadores VERDES = Online
- [x] Marcadores VERMELHOS = Offline
- [x] Filtro de barbeiros online
- [x] Cálculo de distância

### Sistema de Filas
- [x] Entrar na fila
- [x] Ver posição na fila
- [x] Cancelar/Sair da fila

### Home Service
- [x] Modal de seleção de serviços
- [x] Cálculo de taxa de deslocamento
- [x] Interesse em serviço ao domicílio

### Interface
- [x] Landing Page
- [x] Dashboard Cliente com mapa
- [x] Dashboard Barbeiro
- [x] Header com logo ClickBarber
- [x] Botões Share, Refresh, Logout
- [x] Upload de foto de perfil
- [x] Notificações sonoras

### PWA/Play Store
- [x] manifest.json configurado
- [x] Página de Política de Privacidade
- [x] Materiais para Play Store gerados

## Configuração Atual

### Stripe
- **Modo**: TESTE (sk_test_emergent)
- **Status**: Funcional para testes
- **Para Produção**: Necessária chave sk_live_...

### Email (Resend)
- **API Key**: Configurada
- **Domínio**: Não verificado (retorna código para testes)

### Credenciais de Teste
- Barbeiro: test@barber.com / 123456
- Cliente: client@test.com / 123456

## API Endpoints Principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| /api/auth/register | POST | Registro |
| /api/auth/login | POST | Login |
| /api/auth/login-pin | POST | Login com PIN |
| /api/auth/forgot-password | POST | Recuperar senha |
| /api/barbers | GET | Lista barbeiros |
| /api/queue/join | POST | Entrar na fila |
| /api/connect/onboard | POST | Conectar Stripe |
| /api/connect/status | GET | Status Stripe |
| /api/connect/payment | POST | Criar pagamento |

## Próximas Tarefas

### P0 - Crítico (para produção)
- [ ] Configurar chave Stripe LIVE (sk_live_...)
- [ ] Verificar domínio no Resend

### P1 - Play Store
- [ ] Configurar DNS clickbarber.ie
- [ ] Gerar ícones 512x512
- [ ] Gerar feature graphic 1024x500
- [ ] Criar AAB com PWABuilder
- [ ] Publicar na Play Store

### P2 - Melhorias
- [ ] Notificações push nativas
- [ ] WhatsApp direto no perfil
- [ ] Sistema de avaliações melhorado

## URLs
- Preview: https://stripe-payment-fix-14.preview.emergentagent.com
- Domínio planejado: clickbarber.ie
