import requests
from rag.embeddings import embed_text
from rag.faiss_store import search

OLLAMA_CHAT_URL = "http://localhost:11434/api/chat"
MODEL = "phi3"


def answer_query(query: str):
    # 1. Embed query
    q_embed = embed_text(query)

    # 2. Retrieve top chunks
    retrieved = search(q_embed, top_k=5)

    if not retrieved:
        return {
            "answer": "No relevant context found. Please upload documents first.",
            "sources": []
        }

    # 3. Keep only top 2 chunks for speed + relevance
    retrieved = retrieved[:2]

    # 4. Build trimmed context
    context = "\n\n".join([chunk[:800] for chunk, _ in retrieved])

    # 5. Strong system + user prompt
    system_prompt = """
You are a Retrieval-Augmented assistant.
You must answer ONLY using the provided context.
If the answer is not in the context, say: "Not found in the document."
Keep responses short, clear, and structured.
"""

    user_prompt = f"""
Context:
{context}

Question: {query}

Answer in 4–6 bullet points.
"""

    # 6. Call Ollama Chat API
    res = requests.post(
        OLLAMA_CHAT_URL,
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "stream": False,
        },
    )

    data = res.json()

    # 7. Extract only assistant answer
    if "message" not in data:
        return {
            "answer": f"Ollama error: {data}",
            "sources": retrieved
        }

    answer = data["message"]["content"]

    return {
        "answer": answer,
        "sources": retrieved
    }
