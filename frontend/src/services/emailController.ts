// services/emailController.ts

import axios, { AxiosError } from 'axios'
import { API_CONFIG, buildApiUrl, AnalysisResponse, AnalysisData, parseGeminiResponse } from '../config/api'

export class EmailController {
    private static instance: EmailController

    private constructor() {}

    public static getInstance(): EmailController {
        if (!EmailController.instance) {
            EmailController.instance = new EmailController()
        }
        return EmailController.instance
    }

    /**
     * Analisa múltiplos arquivos de email sequencialmente
     */
    async analyzeMultipleEmails(
        files: File[], 
        onProgress?: (currentFile: number, fileName: string) => void
    ): Promise<{
        success: boolean
        results: Array<{
            file: File
            success: boolean
            data?: AnalysisData
            error?: string
            rawResponse?: string
        }>
        totalProcessed: number
        totalSuccess: number
    }> {
        const results: Array<{
            file: File
            success: boolean
            data?: AnalysisData
            error?: string
            rawResponse?: string
        }> = []

        let totalSuccess = 0

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            console.log(`Processando arquivo ${i + 1}/${files.length}: ${file.name}`)

            // Notifica o progresso
            if (onProgress) {
                onProgress(i + 1, file.name)
            }

            try {
                const result = await this.analyzeEmail(file)
                results.push({
                    file,
                    success: result.success,
                    data: result.data,
                    error: result.error,
                    rawResponse: result.rawResponse
                })

                if (result.success) {
                    totalSuccess++
                }

                // Pequena pausa entre requisições para não sobrecarregar o backend
                if (i < files.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                }

            } catch (error) {
                console.error(`Erro ao processar ${file.name}:`, error)
                results.push({
                    file,
                    success: false,
                    error: this.handleError(error)
                })
            }
        }

        return {
            success: totalSuccess > 0,
            results,
            totalProcessed: files.length,
            totalSuccess
        }
    }

    /**
     * Analisa um arquivo de email usando o Gemini
     */
    async analyzeEmail(file: File): Promise<{
        success: boolean
        data?: AnalysisData
        error?: string
        rawResponse?: string
    }> {
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await axios.post<AnalysisResponse>(
                buildApiUrl(API_CONFIG.ENDPOINTS.ANALYZE),
                formData,
                {
                    headers: API_CONFIG.UPLOAD_HEADERS,
                    timeout: API_CONFIG.UPLOAD_TIMEOUT,
                }
            )

            console.log('Resposta da API:', response.data)

            // Processa a resposta
            let analysisData: AnalysisData

            if (typeof response.data.analysis === 'string') {
                // Se a resposta é uma string, tenta extrair os dados
                analysisData = parseGeminiResponse(response.data.analysis)
                console.log('Dados extraídos do texto:', analysisData)
            } else {
                // Se já é um objeto estruturado
                analysisData = response.data.analysis
            }

            return {
                success: true,
                data: analysisData,
                rawResponse: typeof response.data.analysis === 'string' ? response.data.analysis : undefined
            }

        } catch (error) {
            console.error('Erro na análise:', error)
            return {
                success: false,
                error: this.handleError(error)
            }
        }
    }

    /**
     * Faz upload de um arquivo para o servidor
     */
    async uploadFile(file: File): Promise<{
        success: boolean
        message?: string
        error?: string
    }> {
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await axios.post(
                buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD),
                formData,
                {
                    headers: API_CONFIG.UPLOAD_HEADERS,
                    timeout: API_CONFIG.UPLOAD_TIMEOUT,
                }
            )

            return {
                success: true,
                message: response.data.message
            }

        } catch (error) {
            console.error('Erro no upload:', error)
            return {
                success: false,
                error: this.handleError(error)
            }
        }
    }

    /**
     * Trata erros da API de forma amigável
     */
    private handleError(error: unknown): string {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError
            
            if (axiosError.code === 'ECONNREFUSED') {
                return `Erro: Backend não está rodando. Verifique se o servidor está ativo em ${API_CONFIG.BASE_URL}`
            }
            
            if (axiosError.response) {
                const status = axiosError.response.status
                const data = axiosError.response.data as any
                return `Erro ${status}: ${data?.detail || data?.message || 'Erro desconhecido'}`
            }
            
            if (axiosError.request) {
                return 'Erro: Sem resposta do servidor. Verifique se o backend está rodando.'
            }
            
            return `Erro: ${axiosError.message}`
        }
        
        if (error instanceof Error) {
            return `Erro: ${error.message}`
        }
        
        return 'Erro desconhecido ocorreu'
    }

    /**
     * Verifica se o backend está funcionando
     */
    async checkBackendHealth(): Promise<boolean> {
        try {
            const response = await axios.get(buildApiUrl('/'), { timeout: 5000 })
            return response.status === 200
        } catch {
            return false
        }
    }
}

// Exporta uma instância singleton
export const emailController = EmailController.getInstance()
