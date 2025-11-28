# 🚀 Deploy no Render - Imobly Frontend

Guia completo para fazer deploy do frontend Next.js no Render.

## 📋 Pré-requisitos

- ✅ Backend já deployado no Render
- ✅ Banco de dados PostgreSQL no Supabase
- ✅ Conta no Render (https://render.com)
- ✅ Repositório GitHub conectado

---

## 🔧 Passo 1: Criar Web Service no Render

1. **Acesse o Render Dashboard**
   - Vá para: https://dashboard.render.com
   - Clique em **"New +"** → **"Web Service"**

2. **Conecte o Repositório**
   - Selecione seu repositório: `Imobly/Frontend`
   - Branch: `main` (ou `develop`)

3. **Configure o Service**
   
   **Name**: `imobly-frontend` (ou escolha seu nome)
   
   **Region**: `Oregon (US West)` (escolha a mesma do backend)
   
   **Branch**: `main`
   
   **Root Directory**: (deixe vazio se o projeto está na raiz)
   
   **Runtime**: `Node`
   
   **Build Command**:
   ```bash
   npm install -g pnpm && pnpm install && pnpm build
   ```
   
   **Start Command**:
   ```bash
   node .next/standalone/server.js
   ```
   
   **Instance Type**: `Free` (ou escolha um plano pago)

---

## 🌍 Passo 2: Configurar Variáveis de Ambiente

No Render Dashboard, vá em **Environment** e adicione:

### Variáveis Obrigatórias

| Key | Value | Descrição |
|-----|-------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://SEU-BACKEND.onrender.com/api/v1` | URL do seu backend no Render |
| `NEXT_PUBLIC_APP_URL` | `https://imobly-frontend.onrender.com` | URL do frontend (gerada pelo Render) |
| `NEXT_PUBLIC_APP_NAME` | `Imobly` | Nome da aplicação |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | Versão da aplicação |
| `NODE_ENV` | `production` | Ambiente de produção |
| `NEXT_TELEMETRY_DISABLED` | `1` | Desabilitar telemetria |

### ⚠️ Importante

- Substitua `SEU-BACKEND` pelo nome real do seu backend no Render
- A URL do frontend será algo como: `https://imobly-frontend.onrender.com`
- Copie essa URL e use em `NEXT_PUBLIC_APP_URL`

### 📌 Exemplo Completo

```env
NEXT_PUBLIC_API_URL=https://imobly-backend-xyz.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://imobly-frontend.onrender.com
NEXT_PUBLIC_APP_NAME=Imobly
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## 🔗 Passo 3: Configurar CORS no Backend

O backend precisa aceitar requisições do domínio do frontend.

### Backend FastAPI (Python)

Adicione o domínio do Render no CORS:

```python
# main.py ou config
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Desenvolvimento
        "https://imobly-frontend.onrender.com",  # Produção (Render)
        "https://*.onrender.com",  # Aceitar qualquer subdomínio Render
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Variáveis de Ambiente do Backend (Render)

Adicione no backend:

```env
FRONTEND_URL=https://imobly-frontend.onrender.com
CORS_ORIGINS=https://imobly-frontend.onrender.com,http://localhost:3000
```

---

## 🗄️ Passo 4: Verificar Configuração do Supabase

### Connection String do Banco

O backend já deve estar conectado ao Supabase. Verifique se a `DATABASE_URL` está configurada:

**Formato da URL:**
```
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### Onde encontrar:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Settings → Database → Connection string
4. Copie a **Connection pooling** (Session mode)

### Configure no Backend (Render)

No Render Dashboard do **Backend**, adicione:

```env
DATABASE_URL=postgresql://postgres.xyz:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

---

## 📦 Passo 5: Deploy

1. **Salve as Variáveis de Ambiente**
   - Clique em **"Save Changes"**

2. **Deploy Automático**
   - O Render iniciará o build automaticamente
   - Aguarde o processo (pode levar 5-10 minutos)

3. **Acompanhe os Logs**
   - Vá em **Logs** para ver o progresso
   - Procure por erros durante o build

### ✅ Build Bem-Sucedido

Você verá algo como:

```
==> Installing dependencies
==> pnpm install
==> Building application
==> pnpm build
==> Starting server
Server listening on port 3000
```

---

## 🌐 Passo 6: Testar a Aplicação

1. **Acesse a URL do Render**
   - Exemplo: `https://imobly-frontend.onrender.com`

2. **Teste as Funcionalidades**
   - [ ] Login funciona
   - [ ] Dashboard carrega dados
   - [ ] Imóveis aparecem corretamente
   - [ ] Pagamentos são listados
   - [ ] Upload de imagens funciona

3. **Verifique o Console do Browser**
   - Abra DevTools (F12)
   - Console não deve ter erros de CORS
   - Network deve mostrar requisições com status 200

---

## 🔧 Passo 7: Configurações Adicionais (Opcional)

### Custom Domain

Se você tem um domínio próprio:

1. No Render Dashboard → **Settings** → **Custom Domain**
2. Adicione seu domínio (ex: `app.imobly.com.br`)
3. Configure DNS:
   - Type: `CNAME`
   - Name: `app` (ou `www`)
   - Value: `imobly-frontend.onrender.com`

### Redirect HTTP → HTTPS

O Render faz isso automaticamente. ✅

### Health Checks

Render faz health checks automáticos em `/`.

---

## 🚨 Troubleshooting

### Erro: Build Failed

**Problema**: Erro durante `pnpm build`

**Solução**:
1. Verifique os logs do build
2. Teste localmente: `pnpm build`
3. Commit e push correções

### Erro: Cannot connect to API

**Problema**: Frontend não conecta ao backend

**Solução**:
1. Verifique `NEXT_PUBLIC_API_URL` está correto
2. Confirme que backend está rodando
3. Verifique CORS no backend

### Erro: Images not loading

**Problema**: Imagens do Supabase não carregam

**Solução**:
1. Verifique `next.config.mjs` tem:
   ```javascript
   remotePatterns: [
     { protocol: 'https', hostname: '*.supabase.co' }
   ]
   ```
2. Confirme bucket do Supabase é público

### Erro: 404 on routes

**Problema**: Rotas retornam 404

**Solução**:
1. Verifique `output: 'standalone'` em `next.config.mjs`
2. Confirme comando de start está correto
3. Rebuild do service

---

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Acesse via Dashboard
Render → imobly-frontend → Logs
```

### Métricas

- CPU Usage
- Memory Usage
- Request Count
- Response Time

### Alertas

Configure em **Settings** → **Notifications**

---

## 🔄 Atualizações e Re-deploy

### Deploy Automático

Sempre que você der push na branch `main`, o Render faz deploy automaticamente.

### Deploy Manual

1. Render Dashboard → imobly-frontend
2. Clique em **"Manual Deploy"** → **"Deploy latest commit"**

### Rollback

1. Vá em **Events**
2. Selecione um deploy anterior
3. Clique em **"Rollback to this deploy"**

---

## 📝 Checklist Final

Antes de considerar o deploy concluído:

- [ ] Frontend acessível via URL do Render
- [ ] Login funciona corretamente
- [ ] Dashboard carrega dados do backend
- [ ] Imóveis, inquilinos e pagamentos aparecem
- [ ] Upload de imagens funciona
- [ ] CORS configurado no backend
- [ ] Variáveis de ambiente corretas
- [ ] Logs sem erros críticos
- [ ] Performance aceitável (< 3s primeira carga)

---

## 🆘 Suporte

### Documentação Oficial

- Render Docs: https://render.com/docs
- Next.js Deploy: https://nextjs.org/docs/deployment
- Supabase Docs: https://supabase.com/docs

### Logs e Debug

1. **Frontend Logs**: Render Dashboard → Logs
2. **Backend Logs**: Render Dashboard (backend service) → Logs
3. **Database Logs**: Supabase Dashboard → Logs
4. **Browser Console**: F12 → Console/Network

---

## 🎉 Deploy Concluído!

Parabéns! Seu sistema Imobly está no ar! 🚀

**URLs**:
- Frontend: `https://imobly-frontend.onrender.com`
- Backend: `https://imobly-backend.onrender.com`
- Database: Supabase (PostgreSQL)

**Próximos Passos**:
1. Compartilhe a URL com usuários
2. Configure domínio customizado
3. Monitore logs e métricas
4. Implemente backup do banco
5. Configure alertas de downtime
