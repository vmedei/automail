# 📧 AutoMail - Sistema de Análise de Emails

O AutoMail é um sistema inteligente que utiliza IA (Google Gemini) para analisar e processar emails automaticamente. O sistema é composto por um backend em FastAPI e um frontend em Next.js.

## 🚀 Funcionalidades

- **Upload de arquivos**: Suporte para arquivos TXT e EML
- **Análise inteligente**: Processamento automático usando Google Gemini AI
- **Interface moderna**: Interface web responsiva e intuitiva
- **API RESTful**: Backend robusto com documentação automática
- **Deploy simplificado**: Configuração Docker para fácil implantação

## 📋 Pré-requisitos

### Para desenvolvimento local:
- **Python 3.8+**
- **Node.js 18+**
- **npm** ou **yarn**
- **Chave da API do Google Gemini**

### Para deploy com Docker:
- **Docker**
- **Docker Compose**
- **Chave da API do Google Gemini**

## 🔧 Configuração

### 1. Obter chave da API do Google Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave de API
3. Guarde a chave para usar nas configurações

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Chave da API do Google Gemini
GOOGLE_API_KEY=sua_chave_api_aqui
```

## 🛠️ Execução Local (Desenvolvimento)

### Backend (FastAPI)

1. **Navegar para o diretório do backend:**
```bash
cd backend
```

2. **Criar ambiente virtual:**
```bash
python -m venv venv
```

3. **Ativar ambiente virtual:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

5. **Executar o servidor:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em: http://localhost:8000
Documentação da API: http://localhost:8000/docs

### Frontend (Next.js)

1. **Navegar para o diretório do frontend:**
```bash
cd frontend
```

2. **Instalar dependências:**
```bash
npm install
```

3. **Executar em modo de desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em: http://localhost:3000

## 🐳 Execução com Docker (Recomendado)

### Opção 1: Script automatizado

```bash
# Dar permissão de execução (Linux/Mac)
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

### Opção 2: Comandos manuais

```bash
# Build das imagens
docker-compose build

# Iniciar serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

### Verificar se está funcionando

Após o deploy, acesse:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Estrutura do Projeto

```
automail/
├── backend/
│   ├── app/
│   │   ├── main.py          # API FastAPI
│   │   └── __init__.py
│   ├── requirements.txt     # Dependências Python
│   ├── Dockerfile          # Configuração Docker
│   └── render.yaml         # Deploy no Render
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Página principal
│   │   │   ├── layout.tsx   # Layout da aplicação
│   │   │   └── globals.css  # Estilos globais
│   │   └── config/
│   ├── package.json         # Dependências Node.js
│   ├── Dockerfile          # Configuração Docker
│   └── render.yaml         # Deploy no Render
├── docker-compose.yml      # Orquestração Docker
├── deploy.sh              # Script de deploy
└── README.md              # Este arquivo
```

## 🔌 Endpoints da API

### GET `/`
- **Descrição**: Verificar se a API está funcionando
- **Resposta**: `{"message": "AutoMail API está funcionando!"}`

### POST `/upload`
- **Descrição**: Upload de arquivos (TXT, EML)
- **Parâmetros**: `file` (arquivo)
- **Resposta**: Confirmação de processamento

### POST `/analyze`
- **Descrição**: Análise de arquivo usando IA
- **Parâmetros**: `file` (arquivo)
- **Resposta**: Análise detalhada do conteúdo

## 🛠️ Comandos Úteis

### Docker
```bash
# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart backend

# Ver uso de recursos
docker stats

# Acessar container
docker-compose exec backend bash
```

### Desenvolvimento
```bash
# Backend - modo desenvolvimento
cd backend && uvicorn app.main:app --reload

# Frontend - modo desenvolvimento
cd frontend && npm run dev

# Frontend - build de produção
cd frontend && npm run build

# Frontend - executar build
cd frontend && npm start
```

## 🔍 Troubleshooting

### Problema: Porta já em uso
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Parar processo na porta
sudo kill -9 <PID>
```

### Problema: Erro de permissão (Linux/Mac)
```bash
# Dar permissões adequadas
sudo chown -R $USER:$USER .
chmod +x deploy.sh
```

### Problema: Imagens Docker corrompidas
```bash
# Limpar tudo e recomeçar
docker-compose down --rmi all --volumes
docker system prune -a
./deploy.sh
```

### Problema: Erro de dependências
```bash
# Backend
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Deploy em Produção

### Render (Recomendado)

O projeto já está configurado para deploy no Render:

1. **Backend**: `backend/render.yaml`
2. **Frontend**: `frontend/render.yaml`

### Outras plataformas

Para deploy em outras plataformas:

1. **Variáveis de ambiente**: Configure `GOOGLE_API_KEY`
2. **Volumes**: Configure volumes persistentes para dados
3. **Networks**: Configure redes seguras
4. **SSL/TLS**: Configure certificados HTTPS
5. **Monitoramento**: Implemente logs e métricas

## 🔒 Segurança

- ✅ CORS configurado adequadamente
- ✅ Validação de tipos de arquivo
- ✅ Tratamento de erros global
- ✅ Logging de operações
- ⚠️ Configure HTTPS em produção
- ⚠️ Implemente autenticação se necessário

## 📚 Tecnologias Utilizadas

### Backend
- **FastAPI**: Framework web moderno e rápido
- **Uvicorn**: Servidor ASGI
- **Google Generative AI**: IA para análise de conteúdo
- **Python-dotenv**: Gerenciamento de variáveis de ambiente

### Frontend
- **Next.js 15**: Framework React com App Router
- **React 19**: Biblioteca de interface
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário
- **DaisyUI**: Componentes UI para Tailwind

### Infraestrutura
- **Docker**: Containerização
- **Docker Compose**: Orquestração
- **Render**: Plataforma de deploy

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a seção de troubleshooting
2. Consulte a documentação da API em `/docs`
3. Abra uma issue no repositório

---

**Desenvolvido com ❤️ para automatizar a análise de emails**
