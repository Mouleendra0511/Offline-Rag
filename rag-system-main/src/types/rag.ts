export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'image';
  size: number;
  status: 'uploading' | 'processing' | 'indexed' | 'error';
  chunks?: number;
  uploadedAt: Date;
  error?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  page?: number;
  similarity: number;
}

export interface RAGConfig {
  topK: number;
  similarityThreshold: number;
  chunkSize: number;
  chunkOverlap: number;
  model: string;
  embeddingModel: string;
}

export const DEFAULT_CONFIG: RAGConfig = {
  topK: 5,
  similarityThreshold: 0.3,
  chunkSize: 500,
  chunkOverlap: 50,
  model: 'llama3',
  embeddingModel: 'nomic-embed-text',
};
