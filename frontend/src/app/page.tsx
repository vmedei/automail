// app/page.tsx
'use client'
import { useState } from 'react'
import axios from 'axios'

export default function Home() {
    const [file, setFile] = useState<File | null>(null)
    const [uploadStatus, setUploadStatus] = useState<string>('')
    const [analysis, setAnalysis] = useState<string>('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('Por favor, selecione um arquivo')
            return
        }

        setIsAnalyzing(true)
        setUploadStatus('Analisando arquivo com Gemini...')
        setAnalysis('')

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post('http://localhost:8000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 segundos de timeout para análise
            })
            console.log('Resposta da análise:', response.data)
            setUploadStatus('Análise concluída com sucesso!')
            setAnalysis(response.data.analysis)
        } catch (error: any) {
            console.error('Erro na análise:', error)
            if (error.code === 'ECONNREFUSED') {
                setUploadStatus('Erro: Backend não está rodando. Verifique se o servidor está ativo na porta 8000.')
            } else if (error.response) {
                setUploadStatus(`Erro ${error.response.status}: ${error.response.data?.detail || error.response.data?.message || 'Erro desconhecido'}`)
            } else if (error.request) {
                setUploadStatus('Erro: Sem resposta do servidor. Verifique se o backend está rodando.')
            } else {
                setUploadStatus(`Erro: ${error.message}`)
            }
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="h-screen overflow-auto absolute top-0 z-[-2] w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <div className='flex flex-col items-center justify-center min-h-screen p-4'>
                <div className="card w-full max-w-2xl bg-white shadow-lg">
                    <div className="card-body">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">AutoMail</h1>
                            <p className="text-gray-600">Análise inteligente de emails com Google Gemini</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="card-title text-lg font-bold mb-2">Selecionar Arquivo</h2>
                            <p className="text-sm text-gray-600 mb-3">Suporta arquivos .txt e .eml</p>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="file-input file-input-bordered file-input-primary w-full"
                                accept=".txt, .eml"
                            />
                            <button 
                                className="btn btn-primary mt-3 w-full" 
                                onClick={handleUpload}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? 'Analisando com Gemini...' : 'Analisar Arquivo'}
                            </button>
                            {uploadStatus && (
                                <div className={`mt-3 p-3 rounded text-sm ${
                                    uploadStatus.includes('sucesso') 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {uploadStatus}
                                </div>
                            )}
                        </div>

                        {analysis && (
                            <div className="border-t pt-4">
                                <h2 className="card-title text-lg font-bold mb-3">Análise do Gemini</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                                        {analysis}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 p-3 bg-blue-50 rounded text-sm text-blue-800">
                            <strong>💡 Dica:</strong> 
                            <ul className="mt-2 list-disc list-inside">
                                <li>Certifique-se de que o backend está rodando em http://localhost:8000</li>
                                <li>Configure sua API key do Google Gemini no arquivo .env</li>
                                <li>Use arquivos .txt ou .eml para melhor análise</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}