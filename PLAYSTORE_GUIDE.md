# 📱 GUIA COMPLETO - PUBLICAR CLICKBARBER NA PLAY STORE

## PASSO A PASSO

---

## PASSO 1: PREPARAR OS ASSETS GRÁFICOS

### 1.1 Ícone do App (512x512 px)
Você precisa criar um ícone quadrado de 512x512 pixels.

**Opção fácil:** Use o Canva (gratuito)
1. Acesse canva.com
2. Crie um design 512x512 px
3. Use fundo dourado/amber (#F59E0B)
4. Adicione a tesoura de barbeiro ou logo
5. Exporte como PNG

### 1.2 Feature Graphic (1024x500 px)
Banner promocional que aparece na Play Store.

**Sugestão de design:**
- Fundo escuro (#09090B)
- Logo ClickBarber no centro
- Texto: "Encontre barbeiros em Dublin"
- Tesoura ou elementos de barbearia

### 1.3 Screenshots (mínimo 2)
Tire prints do app no celular em tamanho 1080x1920.

**Screenshots recomendados:**
1. Tela do mapa com barbeiros
2. Lista de barbeiros
3. Modal Home Service
4. Perfil do barbeiro
5. Dashboard do barbeiro

---

## PASSO 2: GERAR O APK/AAB (Arquivo do App)

### Opção A: PWABuilder (MAIS FÁCIL - Recomendado)

1. **Acesse:** https://www.pwabuilder.com
2. **Cole a URL do seu app** (depois de fazer deploy com domínio próprio)
3. **Clique em "Start"**
4. **Selecione "Android"**
5. **Configure:**
   - Package ID: `com.clickbarber.app`
   - App Name: `ClickBarber`
   - Version: `1.0.0`
   - Version Code: `1`
6. **Clique em "Generate"**
7. **Baixe o arquivo AAB** (Android App Bundle)

### Opção B: Bubblewrap (linha de comando)

```bash
npm install -g @pwabuilder/cli
pwabuilder build android --url https://seu-dominio.com
```

---

## PASSO 3: CRIAR O APP NA GOOGLE PLAY CONSOLE

1. **Acesse:** https://play.google.com/console

2. **Clique em "Criar aplicativo"**

3. **Preencha os dados básicos:**
   - Nome do app: `ClickBarber`
   - Idioma padrão: `Português (Brasil)`
   - Tipo: `App`
   - Gratuito ou pago: `Gratuito`
   - Declarações: Marque todas as caixas

4. **Clique em "Criar aplicativo"**

---

## PASSO 4: CONFIGURAR A FICHA DA LOJA

### 4.1 Detalhes do app
- **Nome:** ClickBarber
- **Descrição curta:** Encontre barbeiros em Dublin. Agende cortes na barbearia ou em casa! 💈
- **Descrição completa:** (Copie do arquivo PLAYSTORE_MATERIALS.md)

### 4.2 Elementos gráficos
- **Ícone:** Upload do ícone 512x512
- **Gráfico de recursos:** Upload do banner 1024x500
- **Screenshots:** Upload de pelo menos 2 screenshots

### 4.3 Categorização
- **Tipo de aplicativo:** Aplicativo
- **Categoria:** Beleza
- **Tags:** barbeiro, dublin, corte, barba, agendamento

---

## PASSO 5: CLASSIFICAÇÃO DO CONTEÚDO

1. Vá em **Política** > **Classificação do conteúdo**
2. Clique em **Iniciar questionário**
3. Responda às perguntas:
   - Violência: Não
   - Sexualidade: Não
   - Linguagem: Não
   - Substâncias: Não
   - IARC: Preencha conforme o app

---

## PASSO 6: CONFIGURAÇÕES DO APP

### 6.1 Preços e distribuição
- **Gratuito**
- **Países:** Irlanda (ou todos)

### 6.2 Detalhes de contato
- **Email:** support@clickbarber.ie
- **Telefone:** (opcional)
- **Website:** https://clickbarber.ie

### 6.3 Política de privacidade
- **URL:** https://clickbarber.ie/privacy

---

## PASSO 7: FAZER UPLOAD DO APP

1. Vá em **Versão** > **Produção**
2. Clique em **Criar nova versão**
3. **Upload do AAB:** Arraste o arquivo .aab gerado
4. **Nome da versão:** 1.0.0
5. **Notas da versão:**
```
Versão inicial do ClickBarber!
• Encontre barbeiros em Dublin em tempo real
• Agende cortes na barbearia ou em casa
• Pagamento por cartão ou dinheiro
• Avaliações e gorjetas
```

---

## PASSO 8: REVISAR E PUBLICAR

1. **Verifique todos os itens:**
   - ✅ Ficha da loja completa
   - ✅ Classificação do conteúdo
   - ✅ Preços e distribuição
   - ✅ App enviado

2. **Clique em "Enviar para revisão"**

3. **Aguarde a aprovação** (geralmente 1-7 dias)

---

## ⚠️ CHECKLIST ANTES DE ENVIAR

- [ ] Ícone 512x512 PNG
- [ ] Feature Graphic 1024x500
- [ ] Mínimo 2 screenshots
- [ ] Descrição curta (máx 80 caracteres)
- [ ] Descrição completa
- [ ] Política de privacidade URL funcionando
- [ ] Email de contato válido
- [ ] Classificação de conteúdo preenchida
- [ ] Arquivo AAB gerado e enviado

---

## 📞 SUPORTE

Se tiver problemas, a Google tem suporte:
- Central de Ajuda: https://support.google.com/googleplay/android-developer

---

## 🎉 APÓS APROVAÇÃO

Seu app estará disponível em:
`https://play.google.com/store/apps/details?id=com.clickbarber.app`

Compartilhe o link com seus clientes!

