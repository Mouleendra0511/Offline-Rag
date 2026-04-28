import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { DocumentUploader } from '@/components/DocumentUploader';
import { DocumentList } from '@/components/DocumentList';
import { ChatPanel } from '@/components/ChatPanel';
import { CitationViewer } from '@/components/CitationViewer';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useRAG } from '@/hooks/useRAG';

type Tab = 'chat' | 'documents' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    documents,
    messages,
    isProcessing,
    config,
    selectedCitation,
    setConfig,
    uploadDocument,
    deleteDocument,
    sendMessage,
    clearChat,
    setSelectedCitation,
  } = useRAG();

  const indexedCount = documents.filter(d => d.status === 'indexed').length;
  const isUploading = documents.some(d => d.status === 'uploading' || d.status === 'processing');

  return (
    <div className="flex h-screen bg-background dark">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        documentCount={documents.length}
        indexedCount={indexedCount}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex"
            >
              <div className="flex-1 border-r border-border">
                <ChatPanel
                  messages={messages}
                  isProcessing={isProcessing}
                  onSendMessage={sendMessage}
                  onClearChat={clearChat}
                  onCitationClick={setSelectedCitation}
                />
              </div>
              <CitationViewer
                citation={selectedCitation}
                onClose={() => setSelectedCitation(null)}
              />
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto p-8 space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Document Manager</h1>
                  <p className="text-muted-foreground">
                    Upload and manage documents for your knowledge base. Supports PDF, DOCX, TXT, and images with OCR.
                  </p>
                </div>

                <DocumentUploader
                  onUpload={uploadDocument}
                  isUploading={isUploading}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Documents ({documents.length})
                    </h2>
                    {indexedCount > 0 && (
                      <span className="text-sm text-success font-medium">
                        {indexedCount} indexed
                      </span>
                    )}
                  </div>
                  <DocumentList
                    documents={documents}
                    deleteDocument={deleteDocument}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="max-w-2xl mx-auto p-8 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
                  <p className="text-muted-foreground">
                    Configure RAG parameters, models, and chunking options.
                  </p>
                </div>

                <SettingsPanel
                  config={config}
                  onConfigChange={setConfig}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
