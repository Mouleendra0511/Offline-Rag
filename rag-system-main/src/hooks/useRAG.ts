import { useState, useCallback } from "react";
import { Document, Message, Citation, RAGConfig, DEFAULT_CONFIG } from "@/types/rag";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "http://localhost:8000";

export function useRAG() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [config, setConfig] = useState<RAGConfig>(DEFAULT_CONFIG);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  // ===============================
  // ✅ Upload Document
  // ===============================
  const uploadDocument = useCallback(
    async (file: File) => {
      const tempId = uuidv4();
      const docType = getDocType(file.name);

      const newDoc: Document = {
        id: tempId,
        name: file.name,
        type: docType,
        size: file.size,
        status: "uploading",
        uploadedAt: new Date(),
      };

      setDocuments((prev) => [...prev, newDoc]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Processing state
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === tempId ? { ...d, status: "processing" } : d
          )
        );

        const response = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();

        // Backend returns: {status:"uploaded", chunks: N}
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === tempId
              ? {
                  ...d,
                  status: "indexed",
                  chunks: result.chunks,
                }
              : d
          )
        );
      } catch (error) {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === tempId
              ? {
                  ...d,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                }
              : d
          )
        );
      }
    },
    [config]
  );
const deleteDocument = useCallback((id: string) => {
  setDocuments(prev => prev.filter(doc => doc.id !== id));
}, []);

  // ===============================
  // ✅ Send Message (Chat)
  // ===============================
  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsProcessing(true);

      const assistantId = uuidv4();

      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: false,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: content,
          }),
        });

        if (!response.ok) throw new Error("Chat request failed");

        // ✅ Backend returns JSON (not streaming)
        const result = await response.json();

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: result.answer,
                  citations: result.sources,
                }
              : m
          )
        );
      } catch (error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "❌ Error: Could not connect to backend. Is FastAPI running?",
                }
              : m
          )
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [config]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setSelectedCitation(null);
  }, []);

  return {
    deleteDocument,
    documents,
    messages,
    isProcessing,
    config,
    selectedCitation,
    setConfig,
    uploadDocument,
    sendMessage,
    clearChat,
    setSelectedCitation,
  };
}


// ===============================
// Helper: Detect Document Type
// ===============================
function getDocType(filename: string): Document["type"] {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return "pdf";
    case "docx":
    case "doc":
      return "docx";
    case "txt":
    case "md":
      return "txt";
    default:
      return "image";
  }
}
