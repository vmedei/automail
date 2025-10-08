// config/api.ts

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    ENDPOINTS: {
        ANALYZE: '/analyze',
        UPLOAD: '/upload'
    },
    UPLOAD_HEADERS: {
        'Content-Type': 'multipart/form-data',
    },
    UPLOAD_TIMEOUT: 60000, // 60 segundos
}

export function buildApiUrl(endpoint: string): string {
    return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Tipos para a API
export interface AnalysisResponse {
    analysis: AnalysisData | string
    filename: string
    model: string
    raw_response?: string
}

export interface AnalysisData {
    categoria?: string
    resumo?: string
    acao_necessaria?: string
    sugestao_resposta?: string
    prioridade?: string
}

// Função para extrair dados da resposta do Gemini
export function parseGeminiResponse(response: string): AnalysisData {
    try {
        // Tenta fazer parse direto como JSON
        const parsed = JSON.parse(response)
        if (parsed.categoria && parsed.resumo) {
            return parsed
        }
    } catch (e) {
        // Se não for JSON válido, tenta extrair informações do texto
        console.log('Resposta não é JSON válido, extraindo do texto...')
    }

    // Fallback: extrai informações do texto usando regex e análise de texto
    const analysis: AnalysisData = {}
    
    // Extrai categoria baseada no conteúdo
    if (response.toLowerCase().includes('convocação') || 
        response.toLowerCase().includes('entrevista') || 
        response.toLowerCase().includes('processo seletivo') ||
        response.toLowerCase().includes('solicitação') ||
        response.toLowerCase().includes('dúvida') ||
        response.toLowerCase().includes('suporte')) {
        analysis.categoria = 'produtivo'
    } else if (response.toLowerCase().includes('agradecimento') ||
               response.toLowerCase().includes('felicitação') ||
               response.toLowerCase().includes('spam') ||
               response.toLowerCase().includes('informação')) {
        analysis.categoria = 'improdutivo'
    } else {
        analysis.categoria = 'produtivo' // padrão
    }

    // Extrai resumo (primeiras frases)
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10)
    if (sentences.length > 0) {
        analysis.resumo = sentences[0].trim().substring(0, 150) + '...'
    }

    // Define ação necessária baseada na categoria
    analysis.acao_necessaria = analysis.categoria === 'produtivo' ? 'sim' : 'não'

    // Gera sugestão de resposta baseada na categoria
    if (analysis.categoria === 'produtivo') {
        analysis.sugestao_resposta = 'Email requer atenção e resposta. Recomenda-se responder prontamente com as informações solicitadas.'
    } else {
        analysis.sugestao_resposta = 'Email informativo. Pode ser arquivado ou respondido com agradecimento se apropriado.'
    }

    // Define prioridade baseada no conteúdo
    if (response.toLowerCase().includes('urgente') || 
        response.toLowerCase().includes('imediato') ||
        response.toLowerCase().includes('convocação')) {
        analysis.prioridade = 'alta'
    } else if (response.toLowerCase().includes('importante') ||
               response.toLowerCase().includes('entrevista')) {
        analysis.prioridade = 'média'
    } else {
        analysis.prioridade = 'baixa'
    }

    return analysis
}
