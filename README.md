# Offline-Rag (Multimodal RAG)

A **local / offline-friendly Multimodal RAG (Retrieval-Augmented Generation)** project.

This repository contains:
- A **FastAPI backend** that ingests documents, builds embeddings, stores them in **FAISS**, and answers questions using an LLM.
- A **React + TypeScript + Tailwind frontend** web UI for uploading documents and chatting with citations.

> Note: Despite the “Offline” name, the backend may require internet depending on which LLM provider you configure (e.g., Gemini / Groq). Embeddings are generated locally via **Ollama**.

---

## Repository Structure

- `backend1/` – Main working FastAPI RAG backend (has its own README).
- `backend/` – Another backend variant / earlier version.
- `rag-system-main/` – Frontend web application (Vite + React + TS + Tailwind).

---

## Features (Backend + Frontend)

### Backend (RAG API)
- Document ingestion (PDF, DOCX, TXT, images via OCR)
- Chunking with overlap for better retrieval context
- Embeddings via **Ollama** (commonly `nomic-embed-text`)
- Vector search using **FAISS**
- Chat endpoint that answers questions using retrieved context

### Frontend (Web UI)
- Drag & drop document upload
- Chat interface with streaming-like UX (depends on backend implementation)
- Citation/source viewing (from retrieved chunks)
- Settings panel for retrieval/chunking parameters (frontend-side)

---

## Quickstart

### 1) Start the Backend (FastAPI)

Backend lives in `backend1/`.

#### Prerequisites
- Python 3.8+
- Ollama installed and running: https://ollama.com/
- Pull embedding model:
  ```bash
  ollama pull nomic-embed-text
  ```
- An LLM API key if configured (the backend docs mention Gemini; code references a `groq_chat` module)

#### Setup
```bash
cd backend1
python -m venv .venv
# Activate the venv:
# Windows (PowerShell): .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and set required keys (example keys depend on which LLM integration you use).

#### Run
```bash
python main.py
```

Backend will run at:
- `http://localhost:8000`

#### Key API Endpoints
- `GET /` – health check
- `POST /upload` – upload and ingest a document (multipart form)
- `POST /chat` – ask a question (`{"query": "..."}`)

---

### 2) Start the Frontend (Web UI)

Frontend lives in `rag-system-main/`.

```bash
cd rag-system-main
npm install
npm run dev
```

Frontend dev server is typically:
- `http://localhost:5173`

The frontend expects the backend at:
- `http://localhost:8000`

---

## Example Usage

### Upload a document
```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@document.pdf"
```

### Ask a question
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"query":"Summarize the document."}'
```

---

## Tech Stack

**Backend**
- FastAPI
- FAISS
- Ollama embeddings (`nomic-embed-text`)
- OCR support (optional) for images

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS (and shadcn-ui style tooling)


## License

No license file is currently included. Add a `LICENSE` if you intend to open-source this project.
