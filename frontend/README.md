# AutoMail Frontend

Frontend do projeto AutoMail para análise inteligente de emails usando Google Gemini.

## 🚀 Configuração do Ambiente

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend:

```bash
# Configurações da API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Configurações do ambiente
NEXT_PUBLIC_ENVIRONMENT=development
```

### 2. Configurações por Ambiente

#### Desenvolvimento (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

#### Produção (`.env.production`)
```bash
NEXT_PUBLIC_API_URL=https://seu-dominio-backend.com
NEXT_PUBLIC_ENVIRONMENT=production
```

#### Teste (`.env.test`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_ENVIRONMENT=test
```

## 📁 Estrutura de Arquivos

```
frontend/
├── src/
│   ├── app/
│   │   └── page.tsx          # Página principal
│   └── config/
│       └── api.ts            # Configurações da API
├── .env.local                # Variáveis de ambiente (não versionado)
├── .env.example              # Exemplo de configuração
└── README.md                 # Este arquivo
```

## 🔧 Como Usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

### 4. Build para produção
```bash
npm run build
npm start
```

## 🌐 Configuração da API

O frontend se conecta automaticamente ao backend usando a URL configurada em `NEXT_PUBLIC_API_URL`.

### Endpoints disponíveis:
- `GET /` - Verificação de status
- `POST /analyze` - Análise de arquivos com Gemini
- `POST /upload` - Upload de arquivos

## 📝 Notas Importantes

- **NEXT_PUBLIC_**: Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente
- **Segurança**: Nunca commite arquivos `.env.local` no repositório
- **Fallback**: Se `NEXT_PUBLIC_API_URL` não estiver definida, usa `http://localhost:8000` como padrão

## 🐛 Troubleshooting

### Backend não responde
1. Verifique se o backend está rodando
2. Confirme a URL em `NEXT_PUBLIC_API_URL`
3. Verifique se não há firewall bloqueando a conexão

### Erro de CORS
1. Verifique se o backend está configurado para aceitar requisições do frontend
2. Confirme se as origens estão corretas no backend

## 📚 Recursos Adicionais

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Axios Documentation](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
