// components/AnalysisResult.tsx

import { AnalysisData } from '../config/api'

interface AnalysisResultProps {
    analysis: AnalysisData
    rawResponse?: string
}

export default function AnalysisResult({ analysis, rawResponse }: AnalysisResultProps) {
    const getCategoriaColor = (categoria: string | undefined) => {
        if (!categoria) return 'bg-gray-100 text-gray-800 border-gray-200'
        
        switch (categoria.toLowerCase()) {
            case 'produtivo':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'improdutivo':
                return 'bg-green-100 text-green-800 border-green-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getPrioridadeColor = (prioridade: string | undefined) => {
        if (!prioridade) return 'bg-gray-100 text-gray-800'
        
        switch (prioridade.toLowerCase()) {
            case 'alta':
                return 'bg-red-100 text-red-800'
            case 'média':
                return 'bg-yellow-100 text-yellow-800'
            case 'baixa':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="border-t pt-4">
            <h2 className="card-title text-lg font-bold mb-4">Resultado da Análise</h2>
            
            {/* Categoria e Prioridade - Uma linha */}
            <div className="flex gap-4 mb-4">
                <div className={`px-3 py-2 rounded-lg border ${getCategoriaColor(analysis.categoria)}`}>
                    <span className="text-sm font-medium">Categoria:</span> {analysis.categoria || 'Não disponível'}
                </div>
                <div className={`px-3 py-2 rounded-lg ${getPrioridadeColor(analysis.prioridade)}`}>
                    <span className="text-sm font-medium">Prioridade:</span> {analysis.prioridade || 'Não disponível'}
                </div>
                <div className={`px-3 py-2 rounded-lg ${
                    analysis.acao_necessaria === 'sim' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                }`}>
                    <span className="text-sm font-medium">Ação:</span> {analysis.acao_necessaria === 'sim' ? 'Requer' : 'Não requer'}
                </div>
            </div>

            {/* Resumo - Uma linha */}
            <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">📋 Resumo</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{analysis.resumo || 'Não disponível'}</p>
                </div>
            </div>

            {/* Sugestão de Resposta - Uma linha */}
            <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">💬 Sugestão</h3>
                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-700">{analysis.sugestao_resposta || 'Não disponível'}</p>
                </div>
            </div>

            {/* Resposta Bruta do Gemini (para debug) */}
            {rawResponse && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                    <details>
                        <summary className="cursor-pointer font-semibold">🔍 Ver Resposta Completa do Gemini</summary>
                        <div className="mt-2 whitespace-pre-wrap text-xs">
                            {rawResponse}
                        </div>
                    </details>
                </div>
            )}
        </div>
    )
}
