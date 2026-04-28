import os
import google.generativeai as genai
from rag.embeddings import embed_text
from rag.faiss_store import search

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.0-flash"


def answer_query(query: str):
    """
    Answer user query using Gemini API with RAG context
    1. Embed query using Ollama nomic-embed-text
    2. Retrieve relevant chunks from FAISS
    3. Use Gemini to generate answer based on context
    """
    
    if not GEMINI_API_KEY:
        return {
            "answer": "Error: GEMINI_API_KEY not set. Please configure your API key.",
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
        context = "\n\n".join([f"[Chunk {i+1}]\n{chunk[:1000]}" 
                               for i, (chunk, _) in enumerate(retrieved)])

        # 5. Create prompt for Gemini
        prompt = f"""You are a helpful AI assistant that answers questions based on the provided context.

Context from documents:
{context}

Question: {query}

Instructions:
- Answer based ONLY on the provided context
- If the answer is not in the context, say "I cannot find this information in the provided documents."
- Be concise and accurate
- Use bullet points when appropriate
- Cite which chunk(s) you used if relevant

Answer:"""

        # 6. Call Gemini API
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)

        # 7. Extract answer
        answer = response.text if response else "Error generating response from Gemini"

        return {
            "answer": answer,
            "sources": retrieved
        }

    except Exception as e:
        return {
            "answer": f"Error: {str(e)}",
            "sources": []
        }
