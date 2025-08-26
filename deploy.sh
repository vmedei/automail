#!/bin/bash

echo "🚀 Iniciando deploy da aplicação AutoMail..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando .env.example..."
    echo "GOOGLE_API_KEY=sua_chave_api_aqui" > .env.example
    echo "❌ Configure o arquivo .env com suas variáveis de ambiente antes de continuar."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover imagens antigas (opcional)
echo "🧹 Removendo imagens antigas..."
docker-compose down --rmi all

# Build das imagens
echo "🔨 Fazendo build das imagens..."
docker-compose build --no-cache

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Verificar status
echo "📊 Status dos serviços:"
docker-compose ps

echo "✅ Deploy concluído!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
