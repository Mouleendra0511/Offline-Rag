import requests
from concurrent.futures import ThreadPoolExecutor

OLLAMA_URL = "http://localhost:11434/api/embeddings"
MODEL = "nomic-embed-text"

def embed_text(text):
    """Embed a single text using Ollama nomic-embed-text model"""
    try:
        res = requests.post(
            OLLAMA_URL,
            json={"model": MODEL, "prompt": text},
            timeout=30
        )
        res.raise_for_status()
        return res.json()["embedding"]
    except Exception as e:
        print(f"Error embedding text: {e}")
        raise

def embed_batch(texts):
    """Embed multiple texts in parallel for better performance"""
    with ThreadPoolExecutor(max_workers=6) as executor:
        return list(executor.map(embed_text, texts))
