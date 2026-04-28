# Multimodal RAG System

A full-stack web UI for a local Multimodal RAG (Retrieval-Augmented Generation) system using Ollama.

## Frontend (This Project)

Built with React, TypeScript, and Tailwind CSS. Features:

- **Document Upload**: Drag & drop for PDF, DOCX, TXT, and images
- **Chat Interface**: Real-time streaming responses with citations
- **Citation Viewer**: Inspect source chunks with relevance scores
- **Settings Panel**: Configure models, retrieval, and chunking parameters

## Backend Requirements

The frontend connects to a FastAPI backend running on `http://localhost:8000`. You'll need to set up:

### Prerequisites

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull required models
ollama pull llama3
ollama pull nomic-embed-text
```

### FastAPI Backend Structure

Create a Python backend with these modules:

```
backend/
├── main.py              # FastAPI app with endpoints
├── ingestion/
│   ├── loader.py        # Document loaders (PDF, DOCX, TXT, images)
│   ├── ocr.py           # OCR extraction (pytesseract/EasyOCR)
│   └── table_parser.py  # Table extraction (camelot/tabula)
├── chunking/
│   └── chunker.py       # Smart chunking (400-600 tokens, 10-20% overlap)
├── embeddings/
│   └── embedder.py      # Ollama nomic-embed-text integration
├── retrieval/
│   ├── vector_store.py  # FAISS vector store
│   └── reranker.py      # Cross-encoder reranking
├── generation/
│   └── ollama.py        # Ollama llama3 generation
└── utils/
    └── config.py        # Configuration management
```

### API Endpoints

```python
# POST /upload - Upload and process document
# GET /documents - List all documents
# DELETE /documents/{id} - Delete document
# POST /query - Query with streaming response
```

### Key Dependencies

```bash
pip install fastapi uvicorn python-multipart
pip install langchain faiss-cpu sentence-transformers
pip install pypdf python-docx pytesseract pillow
pip install ollama httpx
```

### Running the Backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `topK` | 5 | Number of chunks to retrieve |
| `similarityThreshold` | 0.3 | Minimum similarity score |
| `chunkSize` | 500 | Target tokens per chunk |
| `chunkOverlap` | 50 | Overlap between chunks |
| `model` | llama3 | Ollama LLM model |
| `embeddingModel` | nomic-embed-text | Embedding model |

## Performance

- **Target response time**: < 4 seconds
- **Scalability**: 1000+ documents with FAISS
- **Processing**: Local-only, no external API calls

---

## Lovable Project Info

Built with Vite, TypeScript, React, shadcn-ui, and Tailwind CSS.

To run locally:

```bash
npm install
npm run dev
```
