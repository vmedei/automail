// components/ProcessingProgress.tsx

interface ProcessingProgressProps {
    currentFile: number
    totalFiles: number
    currentFileName: string
    isProcessing: boolean
}

export default function ProcessingProgress({ 
    currentFile, 
    totalFiles, 
    currentFileName, 
    isProcessing 
}: ProcessingProgressProps) {
    const progress = (currentFile / totalFiles) * 100

    return (
        <div className="border-t pt-4">
            <div className="flex items-center gap-3 mb-3">
                <h3 className="font-semibold text-gray-700">🔄 Processando:</h3>
                <span className="text-sm text-gray-600">
                    {currentFile} de {totalFiles} arquivos
                </span>
                <span className="text-sm text-gray-500">
                    ({Math.round(progress)}%)
                </span>
            </div>
            
            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Nome do arquivo atual */}
            <div className="text-sm text-gray-600">
                <span className="font-medium">Atual:</span> {currentFileName}
            </div>
        </div>
    )
}
