import os
from openai import OpenAI
from rag.embeddings import embed_text
from rag.faiss_store import search

# Configure Groq API (Free tier, no credit card required)
# Get your API key from: https://console.groq.com/keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"

# Available free models on Groq:
# - llama-3.3-70b-versatile (recommended)
# - llama-3.1-8b-instant (fastest)
# - mixtral-8x7b-32768
# - deepseek-r1-distill-llama-70b
MODEL_NAME = "llama-3.3-70b-versatile"


def get_client():
    """Get OpenAI-compatible client for Groq API"""
    if not GROQ_API_KEY:
        return None
    return OpenAI(
        api_key=GROQ_API_KEY,
        base_url=GROQ_BASE_URL
    )


def answer_query(query: str):
    """
    Answer user query using Groq API with RAG context
    1. Embed query using Ollama nomic-embed-text
    2. Retrieve relevant chunks from FAISS
    3. Use Groq (Llama 3.3) to generate answer based on context
    """
    
    client = get_client()
    
    if not client:
        return {
            "answer": "Error: GROQ_API_KEY not set. Get your free API key from https://console.groq.com/keys and add it to .env file.",
            "sources": []
        }
    
    try:
        # 1. Embed query using Ollama
        q_embed = embed_text(query)

        # 2. Retrieve top relevant chunks
        retrieved = search(q_embed, top_k=5)

        if not retrieved:
            return {
                "answer": "No relevant context found. Please upload documents first.",
                "sources": []
            }

        # 3. Keep top 3 chunks for context
        retrieved = retrieved[:3]

        # 4. Build context from retrieved chunks
        context = "\n\n---\n\n".join([chunk[:1000] for chunk, _ in retrieved])

        # 5. Create messages for Groq
        messages = [
            {
                "role": "system",
                "content": """You are a helpful assistant. Answer questions ONLY using the information provided in the context below. Do not use any outside knowledge.

Rules:
- If the answer is found in the context, provide a clear and direct answer.
- If the question cannot be answered from the context, respond ONLY with: "I don't know."
- Do not mention chunks, sources, or documents in your response.
- Be concise and helpful."""
            },
            {
                "role": "user",
                "content": f"""Context from documents:
{context}

Question: {query}

Answer:"""
            }
        ]

        # 6. Call Groq API
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.3,
            max_tokens=2048
        )

        # 7. Extract answer
        answer = response.choices[0].message.content if response.choices else "Error generating response"

        return {
            "answer": answer,
            "sources": retrieved
        }

    except Exception as e:
        return {
            "answer": f"Error: {str(e)}",
            "sources": []
        }
