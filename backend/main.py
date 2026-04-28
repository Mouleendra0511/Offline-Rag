from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from rag.ingest import ingest_document
from rag.ollama_chat import answer_query

app = FastAPI()


from rag.faiss_store import load_index

load_index()
# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    chunks_count = await ingest_document(file)

    return {
        "document_id": file.filename,
        "chunks_count": chunks_count
    }


@app.post("/chat")
async def chat(payload: dict):
    query = payload.get("query")
    response = answer_query(query)
    return response

@app.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    return {"status": "deleted", "doc_id": doc_id}


