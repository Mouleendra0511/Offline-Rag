from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from rag.ingest import ingest_document
from rag.groq_chat import answer_query

app = FastAPI()

from rag.faiss_store import load_index

# Load FAISS index on startup
load_index()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "RAG System with Ollama Embeddings and Gemini API"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """Upload and ingest a document"""
    chunks_count = await ingest_document(file)

    return {
        "document_id": file.filename,
        "chunks_count": chunks_count,
        "status": "success"
    }

@app.post("/chat")
async def chat(payload: dict):
    """Answer questions using Gemini API with RAG context"""
    query = payload.get("query")
    if not query:
        return {"error": "Query is required"}
    
    response = answer_query(query)
    return response

@app.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document (placeholder)"""
    return {"status": "deleted", "doc_id": doc_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
