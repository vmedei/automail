// components/MultipleAnalysisResults.tsx

import { AnalysisData } from '../config/api'
import AnalysisResult from './AnalysisResult'

interface AnalysisResultItem {
    file: File
    success: boolean
    data?: AnalysisData
    error?: string
    rawResponse?: string
}

interface MultipleAnalysisResultsProps {
    results: AnalysisResultItem[]
    totalProcessed: number
    totalSuccess: number
}

export default function MultipleAnalysisResults({ 
    results, 
    totalProcessed, 
    totalSuccess 
}: MultipleAnalysisResultsProps) {
    const getStatusColor = (success: boolean) => {
        return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }

    const getStatusIcon = (success: boolean) => {
        return success ? '✅' : '❌'
    }

    return (
        <div className="border-t pt-4">
            <div className="mb-4">
                <h2 className="card-title text-lg font-bold mb-2">Resultados das Análises</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge badge-primary">Total: {totalProcessed}</span>
                    <span className="badge badge-success">Sucessos: {totalSuccess}</span>
                    <span className="badge badge-error">Falhas: {totalProcessed - totalSuccess}</span>
                </div>
            </div>

            <div className="space-y-4">
                {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        {/* Cabeçalho do arquivo */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm px-2 py-1 rounded ${getStatusColor(result.success)}`}>
                                    {getStatusIcon(result.success)} {result.success ? 'Sucesso' : 'Erro'}
                                </span>
                                <span className="font-medium text-gray-700">{result.file.name}</span>
                                <span className="text-xs text-gray-500">
                                    ({(result.file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                        </div>

                        {/* Conteúdo do resultado */}
                        {result.success && result.data ? (
                            <AnalysisResult 
                                analysis={result.data} 
                                rawResponse={result.rawResponse}
                            />
                        ) : (
                            <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                                <h4 className="font-semibold text-red-800 mb-1">Erro na Análise</h4>
                                <p className="text-red-700 text-sm">{result.error || 'Erro desconhecido'}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Resumo final */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">📊 Resumo do Processamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{totalProcessed}</div>
                        <div className="text-blue-700">Arquivos Processados</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{totalSuccess}</div>
                        <div className="text-green-700">Análises Bem-sucedidas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{totalProcessed - totalSuccess}</div>
                        <div className="text-red-700">Falhas</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
