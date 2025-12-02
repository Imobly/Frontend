# Imobly - Sistema de Gestão Imobiliária

Sistema moderno de gestão imobiliária desenvolvido com Next.js 14, TypeScript e TailwindCSS. Gerencie propriedades, inquilinos, pagamentos e despesas de forma integrada e eficiente.

## 🌐 Aplicação em Produção

- **Frontend**: https://imobly.onrender.com
- **Backend API**: https://backend-non0.onrender.com
- **Auth API**: https://auth-api-3zxk.onrender.com
- **Documentação**: [Repositório de Documentação](https://github.com/Imobly/Docs)

## 🚀 Tecnologias

- **Framework**: Next.js 14.2.32 (App Router)
- **Linguagem**: TypeScript 5
- **Estilização**: TailwindCSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **HTTP Client**: Axios

## 🔧 Rodar Localmente

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Instalação

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

Crie um arquivo `.env.local` na raiz do projeto:

```env
# APIs em Produção (para desenvolvimento local com dados reais)
NEXT_PUBLIC_API_URL=https://backend-non0.onrender.com/api/v1
NEXT_PUBLIC_AUTH_API_URL=https://auth-api-3zxk.onrender.com/api/v1/auth
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OU APIs Locais (se estiver rodando backend localmente)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001/api/v1/auth
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Execute o servidor de desenvolvimento:
```bash
pnpm dev
```

5. Acesse: **http://localhost:3000**

## 📋 Scripts Disponíveis

```bash
pnpm dev          # Servidor de desenvolvimento (porta 3000)
pnpm build        # Build de produção
pnpm start        # Servidor de produção (após build)
pnpm lint         # Executar ESLint
```

## 🏗️ Estrutura do Projeto

```
Frontend/
├── app/                    # Páginas (Next.js App Router)
│   ├── login/             # Autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── properties/        # Gestão de propriedades
│   ├── tenants/           # Gestão de inquilinos
│   ├── payments/          # Gestão de pagamentos
│   ├── expenses/          # Gestão de despesas
│   └── notifications/     # Central de notificações
├── components/            # Componentes React
│   ├── ui/               # Componentes UI (shadcn)
│   └── [feature]/        # Componentes por funcionalidade
├── lib/
│   ├── api/              # Serviços da API
│   ├── hooks/            # Custom Hooks
│   └── types/            # TypeScript types
└── public/               # Arquivos estáticos
```

## 📄 Licença

Este projeto é propriedade da Imobly.

---

Para documentação completa, guias de API e detalhes técnicos, acesse o [repositório de documentação](https://imobly.github.io/Documentation/).
