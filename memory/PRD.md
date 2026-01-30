# BarberX - Marketplace de Barbeiros em Tempo Real (Dublin, Ireland)

## Problema Original
Criar um marketplace de barbeiros em tempo real para Dublin, Irlanda. Barbeiros podem ficar Online/Offline. Clientes visualizam no mapa quem está disponível. **Nova feature**: Atendimento em domicílio com taxa de deslocamento paga pelo cliente.

## Arquitetura
- **Frontend**: React.js + Tailwind CSS + Leaflet (mapas)
- **Backend**: FastAPI (Python) com JWT auth
- **Banco de Dados**: MongoDB
- **Localização**: Dublin, Ireland
- **Moeda**: Euro (€)

## User Personas
1. **Cliente**: Pessoa buscando barbeiro disponível por perto ou em domicílio
2. **Barbeiro**: Profissional gerenciando agenda e oferecendo atendimento presencial ou em domicílio

## Core Requirements
- ✅ Cadastro/Login para clientes e barbeiros
- ✅ Toggle Online/Offline para barbeiros
- ✅ Mapa em tempo real com barbeiros disponíveis (Dublin)
- ✅ Sistema de fila digital
- ✅ **Home Service** - Atendimento em domicílio com taxa de deslocamento

## Implementado ✅ (29/01/2026)

### Landing Page
- [x] Hero section em inglês
- [x] Features section
- [x] CTA para cadastro

### Sistema de Autenticação
- [x] Cadastro de cliente e barbeiro
- [x] Login com JWT
- [x] Proteção de rotas

### Dashboard do Cliente
- [x] Mapa Leaflet centralizado em Dublin
- [x] Marcadores verdes/cinza (online/offline)
- [x] Filtro "Online only"
- [x] Detalhes do barbeiro
- [x] **Modal de reserva com opções**:
  - At the barbershop
  - Home Service (+taxa de deslocamento)
- [x] Cálculo automático de distância e taxa

### Dashboard do Barbeiro
- [x] Toggle ON/OFF
- [x] Indicador de Home Service ativo
- [x] Fila com badge "HOME" para atendimentos em domicílio
- [x] Detalhes do cliente (endereço, distância, taxa)
- [x] Estatísticas de ganhos

### Home Service Feature
- [x] Campo `offers_home_service` no barbeiro
- [x] Taxa por km configurável (`home_service_fee_per_km`)
- [x] Cálculo de distância (Haversine formula)
- [x] Modal com seleção de tipo de atendimento
- [x] Input de endereço do cliente
- [x] Total calculado (serviço + deslocamento)
- [x] Badge "HOME" na fila do barbeiro

### Barbeiros de Dublin (Seed Data)
| Nome | Especialidade | Home Service | Taxa/km |
|------|--------------|--------------|---------|
| Sean Murphy | Beard & Traditional | ✅ | €2.50 |
| Liam O'Connor | Fade & Skin Fade | ✅ | €3.00 |
| Patrick Byrne | Hot Towel & Razor | ✅ | €2.00 |
| Conor Walsh | Modern Styles | ❌ | - |

## Testes
- Backend: 100% ✅
- Frontend: 85% ✅ (core features working)

## Backlog / Próximas Features

### P0 (Alta prioridade)
- [ ] Notificações push quando chegar a vez
- [ ] Navegação GPS para home service
- [ ] Avaliação após atendimento

### P1 (Média prioridade)
- [ ] Histórico de atendimentos
- [ ] Chat entre cliente e barbeiro
- [ ] Pagamento online integrado

### P2 (Baixa prioridade)
- [ ] Integração WhatsApp
- [ ] Relatórios mensais
- [ ] App mobile nativo

## Próximos Passos
1. Adicionar navegação GPS para barbeiro ir ao cliente
2. Implementar pagamento online (Stripe)
3. Sistema de avaliações
