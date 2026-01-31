# QuickCut ⚡ - Find a Barber Right Now

App moderno de agendamento de barbearias para Dublin, Irlanda.

## 🚀 Tecnologias

- **React Native** + **Expo SDK 54**
- **TypeScript**
- **React Navigation** (Stack + Tabs)
- **Expo Location** (GPS)
- **Expo Local Authentication** (Face ID / Touch ID)
- **React Native Maps** (Google Maps)
- **Stripe** (Pagamentos)
- **Linear Gradient** + **Blur Effects**

## 🎨 Design System

**Tema:** Dark Mode Ultra Moderno
- Background: `#0a0a0f` (Quase preto)
- Primary: Violet/Purple (`#7c3aed` → `#a855f7`)
- Secondary: Neon Cyan (`#06b6d4` → `#22d3ee`)
- Available: Neon Green (`#00ff88`)
- Accent: Hot Pink (`#ec4899`)

**Efeitos:**
- Glassmorphism
- Neon Glow
- Gradient Cards
- Smooth Animations

## 📱 Telas

### Cliente:
- 📲 **Home** - Mapa + Lista de barbeiros disponíveis
- 🔍 **Search** - Busca por nome, especialidade
- 📅 **Bookings** - Histórico de agendamentos
- ❤️ **Favorites** - Barbeiros favoritos
- 👤 **Profile** - Perfil do usuário

### Barbeiro:
- 🏠 **Dashboard** - Painel com stats do dia
- 🟢 **Availability Toggle** - Botão "Disponível Agora"
- 📅 **Schedule** - Agenda de horários
- 💰 **Earnings** - Ganhos e pagamentos
- ⚙️ **Settings** - Configurações

## 🛠️ Setup

```bash
# Instalar dependências
cd /app/quickcut
npm install

# Rodar no iOS
npm run ios

# Rodar no Android
npm run android

# Rodar na Web
npm run web
```

## 📦 Build para Produção

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Build Android (APK/AAB)
eas build --platform android

# Build iOS (IPA)
eas build --platform ios

# Publicar nas lojas
eas submit --platform android
eas submit --platform ios
```

## 💳 Stripe Integration

1. Criar conta no [Stripe](https://stripe.com)
2. Obter API Keys (Publishable + Secret)
3. Configurar no backend
4. Habilitar Stripe Connect para pagamentos aos barbeiros

## 📍 Google Maps

1. Criar projeto no [Google Cloud Console](https://console.cloud.google.com)
2. Habilitar Maps SDK for Android/iOS
3. Criar API Key
4. Adicionar no `app.json`

## 📁 Estrutura

```
quickcut/
├── App.tsx                 # Entry point
├── app.json               # Expo config
├── src/
│   ├── screens/           # Telas
│   │   ├── auth/          # Login, Register
│   │   ├── client/        # Telas do cliente
│   │   └── barber/        # Telas do barbeiro
│   ├── components/        # Componentes
│   ├── context/           # Auth, Location
│   ├── services/          # API
│   └── theme/             # Cores, estilos
└── assets/                # Ícones, imagens
```

## 🇮🇪 Lançamento em Dublin

1. Testar com 5 barbeiros locais
2. Coletar feedback por 30 dias
3. Ajustar baseado no feedback
4. Expandir para outras áreas

---

**QuickCut** - Find a barber. Right now. ⚡
