import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

const acceptedTypes = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
};

export function DocumentUploader({ onUpload, isUploading }: DocumentUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => onUpload(file));
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    disabled: isUploading,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer",
          "hover:border-primary/50 hover:bg-accent/30",
          isDragActive && "border-primary bg-accent/50 scale-[1.02]",
          isDragAccept && "border-success bg-success/10",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              isDragActive ? "gradient-primary shadow-glow" : "bg-muted"
            )}
          >
            <Upload className={cn(
              "w-8 h-8",
              isDragActive ? "text-primary-foreground" : "text-muted-foreground"
            )} />
          </motion.div>
          
          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {isDragActive ? 'Drop files here' : 'Drag & drop documents'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse • PDF, DOCX, TXT, Images
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            {[
              { icon: FileText, label: 'PDF' },
              { icon: File, label: 'DOCX' },
              { icon: FileText, label: 'TXT' },
              { icon: Image, label: 'Images' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
