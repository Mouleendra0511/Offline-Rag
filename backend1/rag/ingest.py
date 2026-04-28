import os
from rag.chunker import chunk_text
from rag.embeddings import embed_text
from rag.faiss_store import add_embeddings
from rag.ocr import extract_text_from_image

from pypdf import PdfReader
import docx

UPLOAD_DIR = "data/docs"


async def ingest_document(file):
    """
    Ingest a document: extract text, chunk it, embed with Ollama, store in FAISS
    Supports: PDF, DOCX, TXT, Images (PNG, JPG, JPEG)
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = ""

    # Extract text based on file type
    filename_lower = file.filename.lower()
    
    try:
        # PDF
        if filename_lower.endswith(".pdf"):
            reader = PdfReader(file_path)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text

        # DOCX
        elif filename_lower.endswith(".docx"):
            doc = docx.Document(file_path)
            text = "\n".join([p.text for p in doc.paragraphs])

        # Image OCR
        elif filename_lower.endswith((".png", ".jpg", ".jpeg", ".bmp", ".tiff")):
            text = extract_text_from_image(file_path)

        # Plain text
        else:
            # Attempt to read as text for other extensions
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
            except UnicodeDecodeError:
                # If utf-8 fails, it might be a binary file we don't support
                print(f"Could not read {file.filename} as text.")

    except Exception as e:
        print(f"Error extracting text from {file.filename}: {e}")
        # Identify specific errors if possible, otherwise re-raise
        raise e

    if not text.strip():
        msg = f"No text could be extracted from {file.filename}."
        if filename_lower.endswith(".pdf"):
            msg += " If this is a scanned PDF, please convert it to a text-selectable PDF or use an image format."
        raise ValueError(msg)

    # Chunk the text
    chunks = chunk_text(text)

    # Embed chunks using Ollama nomic-embed-text
    print(f"Embedding {len(chunks)} chunks...")
    vectors = [embed_text(c) for c in chunks]

    # Add to FAISS index
    add_embeddings(vectors, chunks)

    print(f"✅ Ingested {file.filename}: {len(chunks)} chunks")

    return len(chunks)
