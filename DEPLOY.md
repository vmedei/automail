# 🚀 Guia de Deploy - AutoMail

Este guia explica como fazer deploy da aplicação AutoMail usando Docker.

## 📋 Pré-requisitos

- Docker instalado e rodando
- Docker Compose instalado
- Chave da API do Google Gemini

## 🔧 Configuração

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Chave da API do Google Gemini
GOOGLE_API_KEY=sua_chave_api_aqui
```

### 2. Verificar configurações

- Backend: `backend/Dockerfile` ✅
- Frontend: `frontend/Dockerfile` ✅
- Orquestração: `docker-compose.yml` ✅

## 🚀 Deploy

### Opção 1: Script automatizado (Recomendado)

```bash
# Dar permissão de execução
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

## 📊 Verificação

Após o deploy, verifique se os serviços estão rodando:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🛠️ Comandos úteis

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

## 🔍 Troubleshooting

### Problema: Porta já em uso
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Parar processo na porta
sudo kill -9 <PID>
```

### Problema: Erro de permissão
```bash
# Dar permissões adequadas
sudo chown -R $USER:$USER .
chmod +x deploy.sh
```

### Problema: Imagens corrompidas
```bash
# Limpar tudo e recomeçar
docker-compose down --rmi all --volumes
docker system prune -a
./deploy.sh
```

## 🌐 Deploy em Produção

Para deploy em produção, considere:

1. **Variáveis de ambiente**: Configure todas as variáveis necessárias
2. **Volumes**: Configure volumes persistentes para dados
3. **Networks**: Configure redes seguras
4. **SSL/TLS**: Configure certificados HTTPS
5. **Monitoramento**: Implemente logs e métricas
6. **Backup**: Configure estratégias de backup

## 📚 Recursos adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
