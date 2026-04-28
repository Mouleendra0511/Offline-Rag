import { motion } from 'framer-motion';
import { Settings, Cpu, Database, Zap, Info } from 'lucide-react';
import { RAGConfig } from '@/types/rag';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SettingsPanelProps {
  config: RAGConfig;
  onConfigChange: (config: RAGConfig) => void;
}

export function SettingsPanel({ config, onConfigChange }: SettingsPanelProps) {
  const updateConfig = (key: keyof RAGConfig, value: number | string) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Model Settings */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Cpu className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Model Configuration</h3>
            <p className="text-xs text-muted-foreground">Configure Ollama models</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              LLM Model
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>The model used for generating responses</TooltipContent>
              </Tooltip>
            </Label>
            <Select value={config.model} onValueChange={(v) => updateConfig('model', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama3">Llama 3</SelectItem>
                <SelectItem value="llama3:70b">Llama 3 70B</SelectItem>
                <SelectItem value="mistral">Mistral</SelectItem>
                <SelectItem value="mixtral">Mixtral 8x7B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Embedding Model
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>The model used for creating embeddings</TooltipContent>
              </Tooltip>
            </Label>
            <Select value={config.embeddingModel} onValueChange={(v) => updateConfig('embeddingModel', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nomic-embed-text">Nomic Embed Text</SelectItem>
                <SelectItem value="mxbai-embed-large">MXBai Embed Large</SelectItem>
                <SelectItem value="all-minilm">All-MiniLM-L6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Retrieval Settings */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Database className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Retrieval Settings</h3>
            <p className="text-xs text-muted-foreground">Fine-tune search behavior</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Top-K Results
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Number of chunks to retrieve</TooltipContent>
                </Tooltip>
              </Label>
              <span className="text-sm font-mono text-foreground">{config.topK}</span>
            </div>
            <Slider
              value={[config.topK]}
              onValueChange={([v]) => updateConfig('topK', v)}
              min={1}
              max={20}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Similarity Threshold
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Minimum similarity score (0-1)</TooltipContent>
                </Tooltip>
              </Label>
              <span className="text-sm font-mono text-foreground">{config.similarityThreshold.toFixed(2)}</span>
            </div>
            <Slider
              value={[config.similarityThreshold * 100]}
              onValueChange={([v]) => updateConfig('similarityThreshold', v / 100)}
              min={0}
              max={100}
              step={5}
            />
          </div>
        </div>
      </div>

      {/* Chunking Settings */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Chunking Settings</h3>
            <p className="text-xs text-muted-foreground">Document processing options</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Chunk Size (tokens)
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Target size for each chunk (400-600 recommended)</TooltipContent>
              </Tooltip>
            </Label>
            <Input
              type="number"
              value={config.chunkSize}
              onChange={(e) => updateConfig('chunkSize', parseInt(e.target.value) || 500)}
              min={100}
              max={2000}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Chunk Overlap (tokens)
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Overlap between chunks (10-20% of chunk size)</TooltipContent>
              </Tooltip>
            </Label>
            <Input
              type="number"
              value={config.chunkOverlap}
              onChange={(e) => updateConfig('chunkOverlap', parseInt(e.target.value) || 50)}
              min={0}
              max={500}
            />
          </div>
        </div>
      </div>

      {/* Performance Info */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Performance Target</p>
            <p>Response time target: &lt;4 seconds. Ensure Ollama is running locally with the selected models pulled.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
