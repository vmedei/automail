import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
from dotenv import load_dotenv
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carrega as variáveis de ambiente
load_dotenv()

app = FastAPI(title="AutoMail API", version="1.0.0")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Desenvolvimento local
        "https://automail-1-n5eq.onrender.com",  # Frontend no Render
        "https://automail-o228.onrender.com",     # Backend no Render
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração do Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

@app.get("/")
async def root():
    logger.info("Endpoint raiz acessado")
    return {"message": "AutoMail API está funcionando!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    logger.info(f"Upload recebido: {file.filename}")
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nome do arquivo não fornecido")
    
    ext = file.filename.split(".")[-1].lower()
    
    if ext == "txt":
        logger.info("Arquivo TXT detectado")
        # Aqui você pode adicionar lógica para processar arquivos TXT
    elif ext == "eml":
        logger.info("Arquivo EML detectado")
        # Aqui você pode adicionar lógica para processar arquivos EML
    else:
        logger.warning(f"Tipo de arquivo não suportado: {ext}")
        raise HTTPException(status_code=400, detail=f"Tipo de arquivo não suportado: {ext}")
    
    logger.info(f"Arquivo {file.filename} processado com sucesso")
    return {"message": "Arquivo processado com sucesso", "filename": file.filename, "type": ext}

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    """Analisa arquivo usando o Gemini"""
    logger.info("Solicitação de análise recebida")
    
    try:
        # Lê o conteúdo do arquivo
        file_content = await file.read()
        file_content = file_content.decode("utf-8")
        
        # Prompt para análise
        prompt = f"""
        Analise o seguinte conteúdo de email/arquivo e forneça:
        1. Resumo do conteúdo
        2. Pontos principais
        3. Sugestões de ação (se aplicável)
        4. Classificação do tipo de email
        
        Conteúdo:
        {file_content}
        """
        
        # Gera resposta usando o Gemini
        response = model.generate_content(prompt)
        
        logger.info("Análise concluída com sucesso")
        return {
            "analysis": response.text,
            "filename": file.filename,
            "model": "gemini-2.5-flash"
        }
        
    except Exception as e:
        logger.error(f"Erro na análise: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro na análise: {str(e)}")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Erro não tratado: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Erro interno do servidor"}
    )

if __name__ == "__main__":
    import uvicorn
    logger.info("Iniciando servidor...")
    uvicorn.run(app, host="0.0.0.0", port=8000)