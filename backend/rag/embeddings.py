import requests

OLLAMA_URL = "http://localhost:11434/api/embeddings"
MODEL = "nomic-embed-text"

from concurrent.futures import ThreadPoolExecutor

def embed_text(text):
    res = requests.post(
        OLLAMA_URL,
        json={"model": MODEL, "prompt": text}
    )
    return res.json()["embedding"]

def embed_batch(texts):
    with ThreadPoolExecutor(max_workers=6) as executor:
        return list(executor.map(embed_text, texts))

