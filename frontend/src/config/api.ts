// Configurações da API
export const API_CONFIG = {
  // URL base da API - pode ser configurada via variável de ambiente
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Timeouts
  UPLOAD_TIMEOUT: 60000, // 30 segundos para upload
  REQUEST_TIMEOUT: 30000, // 10 segundos para outras requisições
  
  // Endpoints
  ENDPOINTS: {
    ROOT: '/',
    ANALYZE: '/analyze',
    UPLOAD: '/upload',
  },
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Headers para upload de arquivo
  UPLOAD_HEADERS: {
    'Content-Type': 'multipart/form-data',
  },
} as const

// Função helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Função helper para verificar se estamos em desenvolvimento
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

// Função helper para verificar se estamos em produção
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production'
}
