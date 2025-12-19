# Imobly - Frontend

Sistema web de gestão imobiliária desenvolvido com Next.js 14, TypeScript e TailwindCSS.

> **Parte da Organização Imobly**: Este repositório é o frontend da aplicação. Outros componentes do sistema:
> - **[Backend](https://github.com/Imobly/backend)**: API REST principal (FastAPI)
> - **[Auth API](https://github.com/Imobly/auth-api)**: Serviço de autenticação
> - **[Documentação](https://github.com/Imobly/docs)**: Documentação completa do sistema

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript 5
- **Estilização**: TailwindCSS + Radix UI
- **HTTP Client**: Axios
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts

## 📋 Pré-requisitos

Para rodar este projeto localmente, você precisa:

- **Node.js** 18 ou superior
- **pnpm** (gerenciador de pacotes)
- **Backend** rodando em `localhost:8000` ([ver repositório](https://github.com/Imobly/backend))
- **Auth API** rodando em `localhost:8001` ([ver repositório](https://github.com/Imobly/auth-api))

## 🚀 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/Imobly/Frontend.git
cd Frontend
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.example .env.local
```

O arquivo `.env.local` deve conter:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001/api/v1/auth
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Imobly
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

### 4. Inicie os serviços backend

**Importante**: O frontend depende dos serviços backend para funcionar.

```bash
# Em um terminal separado, inicie o Backend (porta 8000)
cd ../backend
# Siga as instruções do README do backend

# Em outro terminal, inicie a Auth API (porta 8001)
cd ../auth-api
# Siga as instruções do README da auth-api
```

### 5. Execute o servidor de desenvolvimento

```bash
pnpm dev
```

O frontend estará disponível em: **http://localhost:3000**

### 6. Credenciais de teste

Após criar um usuário via `/register`, você pode fazer login com:
- **Username ou Email**: seu_usuario
- **Senha**: sua_senha

## 🏗️ Estrutura do Projeto

```
Frontend/
├── app/                    # App Router (Next.js 14)
│   ├── login/             # Autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── properties/        # Gestão de propriedades
│   ├── tenants/           # Gestão de inquilinos
│   ├── payments/          # Gestão de pagamentos
│   └── expenses/          # Gestão de despesas
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticação
│   ├── ui/               # Componentes UI (shadcn/ui)
│   └── [feature]/        # Componentes por funcionalidade
├── lib/
│   ├── api/              # Serviços da API
│   ├── hooks/            # Custom React Hooks
│   └── types/            # TypeScript types
└── public/               # Arquivos estáticos
```

## 📡 Integração com Backend

O frontend se comunica com dois serviços:

- **Backend API** (`localhost:8000`): Operações CRUD (propriedades, inquilinos, pagamentos, etc)
- **Auth API** (`localhost:8001`): Autenticação e gerenciamento de usuários

### Custom Hooks Disponíveis

```typescript
import { useProperties } from '@/lib/hooks/useProperties'
import { useTenants } from '@/lib/hooks/useTenants'
import { usePayments } from '@/lib/hooks/usePayments'
import { useDashboard } from '@/lib/hooks/useDashboard'
```

## 🔐 Autenticação

- Sistema de autenticação JWT
- Token armazenado no `localStorage`
- `AuthProvider` gerencia estado global do usuário
- Rotas protegidas via `ProtectedRoute`

## 📝 Scripts Disponíveis

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor de produção
pnpm lint         # Executar linter
```

## 🌐 Deploy em Produção

**Produção ativa**:
- Frontend: https://imobly.onrender.com
- Backend: https://backend-non0.onrender.com
- Auth API: https://auth-api-3zxk.onrender.com

Consulte a [documentação de deploy](https://github.com/Imobly/docs) para mais detalhes.

## 🐛 Troubleshooting

### Erro "Failed to fetch" no login
✅ Verifique se o backend está rodando em `localhost:8000`  
✅ Verifique se a auth API está rodando em `localhost:8001`  
✅ Confirme as URLs no arquivo `.env.local`

### Porta 3000 já está em uso
```bash
# Windows
netstat -ano | findstr :3000
# Kill o processo se necessário
```

## 📚 Documentação

- **[API Reference](./docs/API_REFERENCE_FRONTEND.md)**: Referência completa da API
- **[Payment Integration](./docs/FRONTEND_PAYMENT_INTEGRATION.md)**: Integração de pagamentos
- **[Documentação Geral](https://github.com/Imobly/docs)**: Documentação completa do sistema

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da **Imobly**.

---

**Desenvolvido pela equipe Imobly** • [Organização GitHub](https://github.com/Imobly)
