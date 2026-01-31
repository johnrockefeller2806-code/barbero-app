# ClickBarber - Marketplace de Barbeiros (Dublin, Ireland)

## Problema Original
Marketplace de barbeiros em tempo real para Dublin. Barbeiros ficam Online/Offline, clientes visualizam no mapa. Atendimento em domicílio com taxa de deslocamento.

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Pagamentos**: Stripe

## User Personas
1. **Cliente**: Busca barbeiros disponíveis por perto ou em domicílio
2. **Barbeiro**: Gerencia agenda e oferece atendimento presencial ou em domicílio

## Core Requirements
- ✅ Cadastro/Login para clientes e barbeiros
- ✅ Toggle Online/Offline para barbeiros
- ✅ Mapa em tempo real com barbeiros disponíveis
- ✅ Sistema de fila digital
- ✅ Home Service com taxa de deslocamento
- ✅ Sistema de avaliações
- ✅ Integração Stripe
- ✅ Sistema de referral

## Implementado ✅ (31/01/2026)

### Última Sessão - Features adicionadas:
- [x] Campo Instagram no cadastro de barbeiros
- [x] Exibição do Instagram no perfil (link clicável)
- [x] Edição de Instagram no dashboard do barbeiro
- [x] Opção de pagamento Cash/Card (já existente)

### Features Completas:
- Landing Page em inglês
- Sistema de Autenticação JWT
- Dashboard do Cliente com mapa Leaflet
- Dashboard do Barbeiro com toggle ON/OFF
- Modal de reserva com Cash/Card
- Home Service com cálculo de distância
- Sistema de avaliações
- Sistema de referral
- Assinaturas com Stripe

## Backlog / Próximas Features

### P0 (Alta prioridade)
- [ ] Botão WhatsApp direto no perfil
- [ ] Notificações push quando chegar a vez
- [ ] Navegação GPS para home service

### P1 (Média prioridade)
- [ ] Compartilhar no Instagram Stories após corte
- [ ] Histórico de atendimentos detalhado
- [ ] Pagamento online integrado completo

### P2 (Baixa prioridade)
- [ ] Relatórios mensais
- [ ] App mobile nativo

## Update 31/01/2026 - Mapa do Barbeiro

### Implementado:
- [x] Mapa no dashboard do barbeiro
- [x] Visualização da própria localização (verde = online, cinza = offline)
- [x] Rastreamento de clientes Home Service no mapa
- [x] Linha tracejada conectando barbeiro ao cliente
- [x] Lista de clientes com endereço e distância
- [x] Botão "Ir" para navegação GPS (Google Maps)
- [x] Zoom automático para mostrar ambos os pontos

## Update 31/01/2026 - Rastreamento em Tempo Real

### Implementado:
- [x] Botão "Estou indo" no cliente para iniciar tracking
- [x] Botão "Cheguei" para parar tracking
- [x] GPS watchPosition para enviar localização em tempo real
- [x] Endpoint /queue/update-location para atualizar posição
- [x] Marcador azul no mapa do barbeiro para clientes em movimento
- [x] Linha azul tracejada conectando cliente ao barbeiro
- [x] Badge "EM DESLOCAMENTO" piscando
- [x] Lista "CLIENTES A CAMINHO" com contagem
- [x] Refresh rápido (3s) quando mapa está aberto

## Update 31/01/2026 - Agendamento e Rastreamento Bidirecional

### Implementado:
- [x] Modal de reserva com opções "Agora" e "Agendar"
- [x] Campos de Data e Horário para agendamentos
- [x] Endpoint /queue/join com parâmetros de scheduling
- [x] Endpoint /queue/barber-location para tracking do barbeiro
- [x] Endpoint /queue/schedules para listar agendamentos
- [x] Seção AGENDAMENTOS no dashboard do barbeiro
- [x] Botão "Indo ao cliente" para iniciar GPS tracking
- [x] Mapa em tempo real no cliente mostrando barbeiro se deslocando
- [x] Linha tracejada verde conectando barbeiro ao cliente
- [x] Banner "Barbeiro a caminho!" no dashboard do cliente

### Fluxo completo:
1. Cliente agenda serviço home service
2. Barbeiro vê agendamento no dashboard
3. Barbeiro clica "Indo ao cliente" - GPS inicia
4. Cliente vê em tempo real o barbeiro se aproximando no mapa
5. Barbeiro clica "Cheguei" ao chegar

## Update 31/01/2026 - Sistema de Gorjetas (Tips)

### Implementado:
- [x] Modal de gorjeta automático após serviço completado
- [x] Valores pré-definidos: €2, €5, €10, €15, €20
- [x] Campo para valor personalizado
- [x] Escolha Cash ou Card para pagamento da gorjeta
- [x] Endpoint POST /api/tips para registrar gorjeta
- [x] Endpoint GET /api/tips/barber para listar gorjetas
- [x] Endpoint GET /api/queue/completed para serviços completados
- [x] Card "Gorjetas hoje" no dashboard do barbeiro
- [x] Seção "GORJETAS RECEBIDAS" com histórico
- [x] Seção "Dar Gorjeta" na página do cliente

### Fluxo:
1. Barbeiro completa serviço
2. Cliente faz login → Modal de gorjeta aparece automaticamente
3. Cliente escolhe valor (€2-€20 ou personalizado)
4. Cliente escolhe Cash ou Card
5. Cliente clica "Enviar" → Gorjeta registrada
6. Barbeiro vê gorjeta no dashboard

## Update 31/01/2026 - Navegação Google Maps para Cliente

### Implementado:
- [x] Botão "Como chegar (Google Maps)" no perfil do barbeiro
- [x] Botão "Ir" na seção da fila do cliente
- [x] Endereço da barbearia visível na fila
- [x] Abre Google Maps com modo de navegação driving
- [x] Latitude/longitude do barbeiro incluído no endpoint /queue/my-position

## Update 31/01/2026 - Upload de Foto de Perfil

### Implementado:
- [x] Seção de perfil no dashboard do barbeiro
- [x] Foto redonda com hover effect (câmera)
- [x] Botão "Trocar foto" para abrir galeria
- [x] Endpoint POST /api/barbers/upload-photo
- [x] Upload de imagem via multipart/form-data
- [x] Conversão para base64 e armazenamento no MongoDB
- [x] Validação: apenas imagens, máx 5MB
- [x] Preview instantâneo após upload
- [x] Exibição de nome, especialidade, rating e Instagram

## Update 31/01/2026 - Marcadores de Status no Mapa

### Implementado:
- [x] Marcador VERDE para barbeiros online
- [x] Marcador VERMELHO para barbeiros offline
- [x] Ícone de pessoa dentro dos marcadores
- [x] Tamanhos diferenciados (online maior)
- [x] Popup com status visual (🟢/🔴)

## Update 31/01/2026 - Sistema de Interesse em Home Service

### Implementado:
- [x] Botão "Tenho interesse em atendimento em casa" para barbeiros sem home service
- [x] Model HomeServiceInterest no backend
- [x] Endpoint POST /api/home-service-interest para registrar
- [x] Endpoint GET /api/home-service-interest/barber para listar
- [x] Endpoint PUT /api/home-service-interest/{id}/respond para aceitar/recusar
- [x] Badge de notificação vermelha no dashboard do barbeiro
- [x] Seção "INTERESSE EM HOME SERVICE" com lista de clientes
- [x] Tag "NOVO" para interesses não lidos
- [x] Exibição de telefone, endereço e distância
- [x] Botões Aceitar/Recusar
