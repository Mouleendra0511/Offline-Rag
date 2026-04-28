# RAG System with Ollama Embeddings and Gemini API

A Retrieval-Augmented Generation (RAG) system that uses:
- **Ollama** with `nomic-embed-text` model for document embeddings
- **Gemini API** for intelligent question answering
- **FAISS** for efficient vector similarity search
- **FastAPI** for the backend API

## Features

- 📄 Document ingestion (PDF, DOCX, TXT, Images via OCR)
- 🔍 Semantic search using FAISS vector database
- 🤖 AI-powered responses using Google Gemini
- 📊 Document chunking with overlap for better context
- 🚀 Fast and efficient embeddings with Ollama

## Prerequisites

1. **Python 3.8+**
2. **Ollama** installed and running
   - Install from: https://ollama.ai/
   - Pull the nomic-embed-text model: `ollama pull nomic-embed-text`
3. **Google Gemini API Key**
   - Get from: https://makersuite.google.com/app/apikey
4. **Tesseract OCR** (optional, for image processing)
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki
   - Linux: `sudo apt install tesseract-ocr`

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Ensure Ollama is running:**
   ```bash
   ollama serve
   ```

4. **Pull the embedding model:**
   ```bash
   ollama pull nomic-embed-text
   ```

## Running the Server

```bash
python main.py
```

Or using uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

## API Endpoints

### 1. Upload Document
```bash
POST /upload
Content-Type: multipart/form-data

# Example with curl:
curl -X POST "http://localhost:8000/upload" \
  -F "file=@document.pdf"
```

### 2. Ask Questions
```bash
POST /chat
Content-Type: application/json

{
  "query": "What is the main topic of the document?"
}

# Example with curl:
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the main topic?"}'
```

### 3. Health Check
```bash
GET /
```

## How It Works

1. **Document Ingestion:**
   - Upload a document (PDF, DOCX, TXT, or image)
   - Text is extracted and split into chunks
   - Each chunk is embedded using Ollama's `nomic-embed-text` model
   - Embeddings are stored in FAISS vector database

2. **Question Answering:**
   - User query is embedded using Ollama
   - FAISS retrieves the most relevant document chunks
   - Context + query is sent to Gemini API
   - Gemini generates an accurate answer based on the retrieved context

## Project Structure

```
backend1/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── data/
│   ├── docs/              # Uploaded documents
│   └── faiss/             # FAISS index files
└── rag/
    ├── __init__.py
    ├── embeddings.py      # Ollama embedding functions
    ├── gemini_chat.py     # Gemini API integration
    ├── ingest.py          # Document ingestion
    ├── chunker.py         # Text chunking
    ├── faiss_store.py     # FAISS vector store
    └── ocr.py             # OCR for images
```

## Troubleshooting

### Ollama Connection Error
- Ensure Ollama is running: `ollama serve`
- Check if the model is available: `ollama list`
- Pull the model if needed: `ollama pull nomic-embed-text`

### Gemini API Error
- Verify your API key is set correctly in `.env`
- Check your API quota at Google AI Studio
- Ensure you have internet connectivity

### Import Errors
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (3.8+ required)

## Notes

- First query after starting might be slow as models load
- FAISS index persists between restarts in `data/faiss/`
- Supported file types: PDF, DOCX, TXT, PNG, JPG, JPEG
- Default chunk size: 500 words with 80 word overlap
