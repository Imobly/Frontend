# Imobly - Sistema de Gestão Imobiliária (Frontend)

Sistema moderno de gestão imobiliária desenvolvido com Next.js 14, TypeScript e TailwindCSS.

## 🚀 Tecnologias

- **Framework**: Next.js 14.2.32 (App Router)
- **Linguagem**: TypeScript 5
- **Estilização**: TailwindCSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Formulários**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Containerização**: Docker

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm
- Docker & Docker Compose (para deploy)

## 🔧 Instalação

### Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/Imobly/Frontend.git
cd Frontend
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Execute o servidor de desenvolvimento:
```bash
pnpm dev
```

Acesse: http://localhost:3000

### Deploy com Docker

1. Build da imagem:
```bash
docker compose build
```

2. Execute o container:
```bash
docker compose up -d
```

O frontend estará disponível em: http://localhost:3000

## 🏗️ Estrutura do Projeto

```
Frontend/
├── app/                    # App Router (Next.js 14)
│   ├── login/             # Página de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── properties/        # Gestão de propriedades
│   ├── tenants/           # Gestão de inquilinos
│   ├── payments/          # Gestão de pagamentos
│   ├── expenses/          # Gestão de despesas
│   ├── notifications/     # Central de notificações
│   └── layout.tsx         # Layout raiz com AuthProvider
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticação
│   ├── ui/               # Componentes UI (shadcn)
│   ├── properties/       # Componentes de propriedades
│   ├── tenants/          # Componentes de inquilinos
│   ├── payments/         # Componentes de pagamentos
│   └── expenses/         # Componentes de despesas
├── lib/
│   ├── api/              # Serviços da API (axios)
│   ├── contexts/         # React Contexts
│   ├── hooks/            # Custom Hooks
│   ├── services/         # Serviços de negócio
│   └── types/            # Definições TypeScript
├── public/               # Arquivos estáticos
├── Dockerfile            # Build para produção
├── docker-compose.yml    # Orquestração Docker
└── next.config.mjs       # Configuração Next.js
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Auth API**: Serviço separado em `http://localhost:8001`
- **Endpoints**:
  - `POST /api/v1/auth/register` - Registro de usuário
  - `POST /api/v1/auth/login` - Login
  - `GET /api/v1/auth/me` - Dados do usuário atual
  - `PUT /api/v1/auth/me` - Atualizar perfil
  - `POST /api/v1/auth/change-password` - Alterar senha

### Fluxo de Autenticação

1. Usuário faz login via `/login`
2. Token JWT é armazenado no `localStorage`
3. `AuthProvider` gerencia o estado global do usuário
4. `ProtectedRoute` protege rotas que requerem autenticação
5. Token é anexado automaticamente nas requisições via `getAuthHeaders()`

## 📡 Integração com Backend

### API Principal (porta 8000)

Serviços disponíveis em `lib/api/`:

- **Properties**: Gestão de propriedades
- **Tenants**: Gestão de inquilinos
- **Payments**: Gestão de pagamentos
- **Expenses**: Gestão de despesas
- **Contracts**: Gestão de contratos
- **Dashboard**: Dados agregados e estatísticas
- **Notifications**: Central de notificações

### Custom Hooks

Hooks React para facilitar o uso da API:

```typescript
import { useProperties } from '@/lib/hooks/useProperties'
import { useTenants } from '@/lib/hooks/useTenants'
import { usePayments } from '@/lib/hooks/usePayments'
import { useDashboard } from '@/lib/hooks/useDashboard'
```

Exemplo de uso:
```typescript
const { properties, loading, error, refetch } = useProperties({ status: 'occupied' })
```

## 🎨 Componentes UI

Utilizamos **shadcn/ui** com componentes do **Radix UI**:

- Button, Input, Label, Select
- Dialog, Sheet, Dropdown Menu
- Card, Badge, Avatar
- Table, Tabs
- Toast (Sonner)

Componentes customizados podem ser adicionados em `components/ui/`.

## 🐳 Docker

### Dockerfile

- Build multi-stage otimizado
- Output `standalone` do Next.js
- Tamanho reduzido da imagem
- Copy de assets (.next/static e public)

### docker-compose.yml

```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://host.docker.internal:8000
    networks:
      - imovel_network
```

### Comandos Úteis

```bash
# Build e iniciar
docker compose up --build -d

# Ver logs
docker compose logs -f frontend

# Parar containers
docker compose down

# Rebuild completo
docker compose down && docker compose up --build -d
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Servidor de desenvolvimento (porta 3000)

# Build
pnpm build        # Build de produção

# Produção
pnpm start        # Servidor de produção (após build)

# Qualidade
pnpm lint         # Executar ESLint
```

## ⚙️ Configurações Importantes

### next.config.mjs

- **output: 'standalone'**: Necessário para Docker
- **images.unoptimized**: Imagens sem otimização (para simplificar)
- **eslint/typescript.ignoreBuildErrors**: Ignora erros durante build (dev only)

### Variáveis de Ambiente

Todas as variáveis client-side devem ter prefixo `NEXT_PUBLIC_`:

```typescript
process.env.NEXT_PUBLIC_API_URL         // API principal
process.env.NEXT_PUBLIC_AUTH_API_URL    // API de autenticação
process.env.NEXT_PUBLIC_APP_URL         // URL do frontend
```

## 🚨 Troubleshooting

### Container não inicia

1. Verifique se a porta 3000 está livre:
```bash
netstat -ano | findstr :3000
```

2. Verifique logs do container:
```bash
docker compose logs frontend
```

3. Rebuild sem cache:
```bash
docker compose build --no-cache
```

### Erro CORS

Certifique-se que o backend permite a origem do frontend:

```python
# Backend FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token não sendo enviado

Verifique:
1. Token está salvo no localStorage: `localStorage.getItem('access_token')`
2. Header Authorization está sendo anexado em `lib/services/auth.ts`
3. AuthProvider está envolvendo a aplicação em `app/layout.tsx`

## 📝 Próximos Passos

- [ ] Adicionar testes unitários (Jest/Testing Library)
- [ ] Implementar testes E2E (Playwright/Cypress)
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Adicionar monitoramento de erros (Sentry)
- [ ] Implementar PWA
- [ ] Otimizar bundle size
- [ ] Adicionar Service Worker para cache
- [ ] Implementar WebSockets para notificações em tempo real

## 📄 Licença

Este projeto é propriedade da Imobly.

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
