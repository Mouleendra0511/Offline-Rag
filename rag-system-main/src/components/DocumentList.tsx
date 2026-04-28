import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, File, Trash2, CheckCircle, AlertCircle, Loader2, Layers } from 'lucide-react';
import { Document } from '@/types/rag';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  documents: Document[];
  deleteDocument: (id: string) => void;
}

const typeIcons = {
  pdf: FileText,
  docx: File,
  txt: FileText,
  image: Image,
};

const statusConfig = {
  uploading: { icon: Loader2, color: 'text-primary', label: 'Uploading', animate: true },
  processing: { icon: Loader2, color: 'text-warning', label: 'Processing', animate: true },
  indexed: { icon: CheckCircle, color: 'text-success', label: 'Indexed', animate: false },
  error: { icon: AlertCircle, color: 'text-destructive', label: 'Error', animate: false },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function DocumentList({ documents, deleteDocument }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-foreground mb-1">No documents yet</p>
        <p className="text-sm text-muted-foreground">Upload documents to start building your knowledge base</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {documents.map((doc, index) => {
          const TypeIcon = typeIcons[doc.type];
          const status = statusConfig[doc.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-200"
            >
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                doc.type === 'pdf' && "bg-destructive/10 text-destructive",
                doc.type === 'docx' && "bg-primary/10 text-primary",
                doc.type === 'txt' && "bg-muted text-muted-foreground",
                doc.type === 'image' && "bg-accent text-accent-foreground",
              )}>
                <TypeIcon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{doc.name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{formatSize(doc.size)}</span>
                  <span>•</span>
                  <span>{formatDate(doc.uploadedAt)}</span>
                  {doc.chunks && (
                    <>
                      <span>•</span>
                      <span>{doc.chunks} chunks</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={cn("flex items-center gap-1.5 text-xs font-medium", status.color)}>
                  <StatusIcon className={cn("w-4 h-4", status.animate && "animate-spin")} />
                  {status.label}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteDocument(doc.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
