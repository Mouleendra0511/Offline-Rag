import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, User, Bot, Trash2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, Citation } from '@/types/rag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  messages: Message[];
  isProcessing: boolean;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onCitationClick: (citation: Citation) => void;
}

export function ChatPanel({
  messages,
  isProcessing,
  onSendMessage,
  onClearChat,
  onCitationClick,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">RAG Chat</h2>
            <p className="text-xs text-muted-foreground">Ask questions about your documents</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearChat} className="text-muted-foreground">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Start a conversation</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask questions about your uploaded documents. The system will search through your knowledge base and provide answers with citations.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                'What are the main topics?',
                'Summarize the key points',
                'Find information about...',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 text-sm rounded-lg bg-muted hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  message.role === 'user' && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                <div className={cn(
                  "flex-1 max-w-[80%]",
                  message.role === 'user' && "text-right"
                )}>
                  <div className={cn(
                    "inline-block rounded-2xl px-4 py-3",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-card border border-border rounded-tl-md"
                  )}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                         <ReactMarkdown>{message.content}</ReactMarkdown>
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse-glow" />
                         )}
                      </div>

                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>

                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.citations.map((citation) => (
                          <button
                            key={citation.id}
                            onClick={() => onCitationClick(citation)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{citation.documentName}</span>
                            {citation.page && <span className="text-muted-foreground">p.{citation.page}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your documents..."
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all text-sm placeholder:text-muted-foreground"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="h-12 w-12 rounded-xl gradient-primary shadow-glow"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
