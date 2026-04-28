import faiss
import numpy as np
import os
import pickle

INDEX_FILE = "data/faiss/index.bin"
DOC_FILE = "data/faiss/docs.pkl"

index = None
documents = []


def save_index():
    """Save FAISS + docs"""
    os.makedirs("data/faiss", exist_ok=True)

    if index:
        faiss.write_index(index, INDEX_FILE)

    with open(DOC_FILE, "wb") as f:
        pickle.dump(documents, f)

    print("✅ FAISS index saved")


def load_index():
    """Load FAISS + docs"""
    global index, documents

    if os.path.exists(INDEX_FILE):
        index = faiss.read_index(INDEX_FILE)
        print("✅ FAISS index loaded")

    if os.path.exists(DOC_FILE):
        with open(DOC_FILE, "rb") as f:
            documents = pickle.load(f)

        print("✅ Documents loaded:", len(documents))


def add_embeddings(vectors, chunks):
    global index, documents

    if len(vectors) == 0:
        return

    dim = len(vectors[0])

    if index is None:
        index = faiss.IndexFlatL2(dim)

    vectors_np = np.array(vectors).astype("float32")
    index.add(vectors_np)
    documents.extend(chunks)

    save_index()


def search(query_vector, top_k=5):
    global index, documents

    if index is None or len(documents) == 0:
        return []

    query_np = np.array([query_vector]).astype("float32")
    distances, ids = index.search(query_np, top_k)

    results = []
    for i, idx in enumerate(ids[0]):
        if idx == -1:
            continue
        results.append((documents[idx], float(distances[0][i])))

    return results
