import os
from rag.chunker import chunk_text
from rag.embeddings import embed_text
from rag.faiss_store import add_embeddings
from rag.ocr import extract_text_from_image

from pypdf import PdfReader
import docx

UPLOAD_DIR = "data/docs"


async def ingest_document(file):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = ""

    # PDF
    if file.filename.endswith(".pdf"):
        reader = PdfReader(file_path)
        for page in reader.pages:
            text += page.extract_text()

    # DOCX
    elif file.filename.endswith(".docx"):
        doc = docx.Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs])

    # Image OCR
    elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        text = extract_text_from_image(file_path)

    else:
        text = open(file_path, "r", encoding="utf-8").read()

    chunks = chunk_text(text)

    vectors = [embed_text(c) for c in chunks]
    add_embeddings(vectors, chunks)

    return len(chunks)
