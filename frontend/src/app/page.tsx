// app/page.tsx
'use client'
import { useState } from 'react'
import { emailController } from '../services/emailController'
import { AnalysisData } from '../config/api'
import AnalysisResult from '../components/AnalysisResult'
import MultipleAnalysisResults from '../components/MultipleAnalysisResults'
import ProcessingProgress from '../components/ProcessingProgress'
import Image from 'next/image'

interface AnalysisResultItem {
    file: File
    success: boolean
    data?: AnalysisData
    error?: string
    rawResponse?: string
}

export default function Home() {
    const [files, setFiles] = useState<File[]>([])
    const [uploadStatus, setUploadStatus] = useState<string>('')
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
    const [multipleResults, setMultipleResults] = useState<AnalysisResultItem[]>([])
    const [rawResponse, setRawResponse] = useState<string>('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isProcessingMultiple, setIsProcessingMultiple] = useState(false)
    const [processingProgress, setProcessingProgress] = useState({
        currentFile: 0,
        totalFiles: 0,
        currentFileName: ''
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        setFiles(selectedFiles)
        setUploadStatus(`Selecionados ${selectedFiles.length} arquivo(s)`)
        setAnalysis(null)
        setMultipleResults([])
        setRawResponse('')
    }

    const handleSingleUpload = async () => {
        if (files.length === 0) {
            setUploadStatus('Por favor, selecione um arquivo')
            return
        }

        if (files.length > 1) {
            setUploadStatus('Para análise individual, selecione apenas um arquivo')
            return
        }

        setIsAnalyzing(true)
        setUploadStatus('Analisando arquivo com Gemini...')
        setAnalysis(null)
        setRawResponse('')

        try {
            const result = await emailController.analyzeEmail(files[0])
            
            if (result.success && result.data) {
                setUploadStatus('Análise concluída com sucesso!')
                setAnalysis(result.data)
                if (result.rawResponse) {
                    setRawResponse(result.rawResponse)
                }
            } else {
                setUploadStatus(result.error || 'Erro desconhecido na análise')
            }
        } catch (error) {
            console.error('Erro inesperado:', error)
            setUploadStatus('Erro inesperado ocorreu durante a análise')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleMultipleUpload = async () => {
        if (files.length === 0) {
            setUploadStatus('Por favor, selecione arquivos')
            return
        }

        if (files.length === 1) {
            setUploadStatus('Para análise múltipla, selecione mais de um arquivo')
            return
        }

        setIsProcessingMultiple(true)
        setUploadStatus(`Iniciando análise de ${files.length} arquivos...`)
        setMultipleResults([])
        setAnalysis(null)

        // Inicializa o progresso
        setProcessingProgress({
            currentFile: 0,
            totalFiles: files.length,
            currentFileName: files[0]?.name || ''
        })

        try {
            const result = await emailController.analyzeMultipleEmails(
                files,
                (currentFile, fileName) => {
                    setProcessingProgress({
                        currentFile,
                        totalFiles: files.length,
                        currentFileName: fileName
                    })
                }
            )
            
            if (result.success) {
                setUploadStatus(`Processamento concluído! ${result.totalSuccess}/${result.totalProcessed} arquivos analisados com sucesso`)
                setMultipleResults(result.results)
            } else {
                setUploadStatus(`Processamento concluído com erros. ${result.totalSuccess}/${result.totalProcessed} arquivos analisados com sucesso`)
                setMultipleResults(result.results)
            }
        } catch (error) {
            console.error('Erro inesperado:', error)
            setUploadStatus('Erro inesperado ocorreu durante o processamento')
        } finally {
            setIsProcessingMultiple(false)
            setProcessingProgress({
                currentFile: 0,
                totalFiles: 0,
                currentFileName: ''
            })
        }
    }

    const clearResults = () => {
        setFiles([])
        setAnalysis(null)
        setMultipleResults([])
        setRawResponse('')
        setUploadStatus('')
        setProcessingProgress({
            currentFile: 0,
            totalFiles: 0,
            currentFileName: ''
        })
    }

    return (
        <div className="h-screen overflow-auto absolute top-0 z-[-2] w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <div className='flex flex-col items-center justify-center min-h-screen p-4'>
                <div className="card w-full max-w-4xl bg-white shadow-lg">
                    <div className="card-body">
                        <div className="text-center mb-6">
                            <Image src="/AutoMail.svg" alt="AutoMail" width={100} height={100}  />
                            <p className="text-gray-600">Análise inteligente de emails com Google Gemini</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="card-title text-lg font-bold mb-2">Selecionar Arquivos</h2>
                            <p className="text-sm text-gray-600 mb-3">
                                Suporta arquivos .txt e .eml. Selecione um arquivo para análise individual ou múltiplos para processamento em lote.
                            </p>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered file-input-primary w-full"
                                accept=".txt, .eml"
                                multiple={true}
                            />
                            
                            {files.length > 0 && (
                                <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-800">
                                    <strong>📁 Arquivos selecionados:</strong> {files.length} arquivo(s)
                                    <ul className="mt-2 list-disc list-inside">
                                        {files.map((file, index) => (
                                            <li key={index} className="text-xs">
                                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-2 mt-3">
                                <button 
                                    className="btn btn-primary flex-1" 
                                    onClick={handleSingleUpload}
                                    disabled={isAnalyzing || isProcessingMultiple || files.length !== 1}
                                >
                                    {isAnalyzing ? 'Analisando...' : 'Analisar Arquivo Único'}
                                </button>
                                <button 
                                    className="btn btn-secondary flex-1" 
                                    onClick={handleMultipleUpload}
                                    disabled={isAnalyzing || isProcessingMultiple || files.length < 2}
                                >
                                    {isProcessingMultiple ? 'Processando...' : 'Analisar Múltiplos'}
                                </button>
                                {files.length > 0 && (
                                    <button 
                                        className="btn btn-outline" 
                                        onClick={clearResults}
                                        disabled={isAnalyzing || isProcessingMultiple}
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>

                            {uploadStatus && (
                                <div className={`mt-3 p-3 rounded text-sm ${
                                    uploadStatus.includes('sucesso') || uploadStatus.includes('concluído')
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {uploadStatus}
                                </div>
                            )}
                        </div>

                        {/* Progresso do processamento múltiplo */}
                        {isProcessingMultiple && processingProgress.totalFiles > 0 && (
                            <ProcessingProgress 
                                currentFile={processingProgress.currentFile}
                                totalFiles={processingProgress.totalFiles}
                                currentFileName={processingProgress.currentFileName}
                                isProcessing={isProcessingMultiple}
                            />
                        )}

                        {/* Resultado de análise única */}
                        {analysis && (
                            <AnalysisResult 
                                analysis={analysis} 
                                rawResponse={rawResponse}
                            />
                        )}

                        {/* Resultados de análises múltiplas */}
                        {multipleResults.length > 0 && (
                            <MultipleAnalysisResults 
                                results={multipleResults}
                                totalProcessed={multipleResults.length}
                                totalSuccess={multipleResults.filter(r => r.success).length}
                            />
                        )}

                        <div className="mt-6 p-3 bg-blue-50 rounded text-sm text-blue-800">
                            <strong>💡 Dica:</strong> 
                            <ul className="mt-2 list-disc list-inside">
                                <li>O sistema classifica automaticamente emails como produtivos ou improdutivos</li>
                                <li>Emails produtivos requerem ação imediata</li>
                                <li>Emails improdutivos são informativos e podem ser arquivados</li>
                                <li>Para múltiplos arquivos, o processamento é sequencial para evitar sobrecarga</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}