import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageSquare, Settings, Database, Activity, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  documentCount: number;
  indexedCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({
  activeTab,
  onTabChange,
  documentCount,
  indexedCount,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Toggle button - always visible, highest z-index */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={cn(
          "fixed top-4 z-[60] transition-all duration-300 bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-accent",
          isOpen ? "left-[216px]" : "left-4"
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile/Tablet overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:relative w-64 h-screen glass-strong flex flex-col z-50"
          >
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                  <Database className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">RAG System</h1>
                  <p className="text-xs text-muted-foreground">Multimodal Search</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      // Auto-close on mobile/tablet after selection
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    className={cn(
                      "w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex flex-row",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {item.id === 'documents' && documentCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                        {documentCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border/30">
              <div className="p-4 rounded-lg glass">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">System Status</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Documents</span>
                    <span className="text-foreground font-mono">{documentCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Indexed</span>
                    <span className="text-success font-mono">{indexedCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Backend</span>
                    <span className="text-warning font-mono">Local</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}