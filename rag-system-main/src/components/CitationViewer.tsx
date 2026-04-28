import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { Citation } from '@/types/rag';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CitationViewerProps {
  citation: Citation | null;
  onClose: () => void;
}

export function CitationViewer({ citation, onClose }: CitationViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (citation) {
      await navigator.clipboard.writeText(citation.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {citation && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-96 h-full bg-card border-l border-border flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm truncate max-w-[180px]">
                  {citation.documentName}
                </h3>
                {citation.page && (
                  <p className="text-xs text-muted-foreground">Page {citation.page}</p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Similarity Score */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-xs text-muted-foreground">Relevance Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-background overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${citation.similarity * 100}%` }}
                      className="h-full gradient-primary"
                    />
                  </div>
                  <span className="text-xs font-mono font-medium text-foreground">
                    {(citation.similarity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Source Text */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Source Text
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
                    {copied ? (
                      <CheckCheck className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-muted border border-border">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                    {citation.content}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Metadata
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">Document ID</span>
                    <span className="text-xs font-mono text-foreground">{citation.documentId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">Citation ID</span>
                    <span className="text-xs font-mono text-foreground">{citation.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-xs text-muted-foreground">Content Length</span>
                    <span className="text-xs font-mono text-foreground">{citation.content.length} chars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Document
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
