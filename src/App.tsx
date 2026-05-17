import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, BookOpen, Wand2, Copy, Check, Hash, Settings, Palette, Code2 } from 'lucide-react';

const TAG_CATEGORIES = [
  {
    name: 'Concept',
    icon: <Settings size={16} />,
    tags: ['World Building', 'Character Arc', 'Code Architecture', 'Debugging', 'Refactoring', 'Plot Twist']
  },
  {
    name: 'Genre',
    icon: <BookOpen size={16} />,
    tags: ['Sci-Fi', 'Fantasy', 'Cyberpunk', 'Mystery', 'Romance', 'Horror', 'Web Development', 'Machine Learning']
  },
  {
    name: 'Style',
    icon: <Palette size={16} />,
    tags: ['Cinematic', 'Minimalist', 'Detailed', 'Humorous', 'Dark', 'Exploratory', 'Idiomatic', 'Optimized']
  },
  {
    name: 'Format',
    icon: <Terminal size={16} />,
    tags: ['Story', 'Dialogue', 'Code Snippet', 'Documentation', 'Tutorial', 'Interview', 'Poem']
  }
];

export default function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async () => {
    if (selectedTags.length === 0) return;
    
    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');
    
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: selectedTags, description })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prompt');
      }
      
      setGeneratedPrompt(data.prompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#F27D26] selection:text-black">
      
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F27D26] to-[#FF4444] flex items-center justify-center">
            <Wand2 size={24} className="text-black" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">PromptForge</h1>
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 font-mono">
          Creative Writing & Code Prompts
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Configuration */}
        <section className="lg:col-span-5 space-y-10">
          <div>
            <h2 className="text-4xl font-light tracking-tight mb-3">Craft your intent.</h2>
            <p className="text-white/60 leading-relaxed max-w-md">
              Select multiple tags below. The AI will weave them into a high-quality, inspiring prompt ready for immediate use.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="description" className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-semibold">
                <BookOpen size={16} />
                <span>Describe your idea (Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., I want to build a cyberpunk RPG battle system..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#F27D26]/50 focus:ring-1 focus:ring-[#F27D26]/50 transition-all min-h-[120px] resize-y"
              />
            </div>

            {TAG_CATEGORIES.map((category, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-semibold">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected 
                            ? 'bg-[#F27D26] text-black shadow-[0_0_15px_rgba(242,125,38,0.3)]' 
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleGenerate}
              disabled={selectedTags.length === 0 || isLoading}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-bold transition-all duration-300 ${
                selectedTags.length === 0
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : isLoading
                  ? 'bg-white/10 text-white/50 cursor-wait'
                  : 'bg-white text-black hover:bg-[#F27D26] hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Settings size={20} />
                </motion.div>
              ) : (
                <Sparkles size={20} />
              )}
              {isLoading ? 'Forging Prompt...' : 'Generate Prompt'}
            </button>
          </div>
        </section>

        {/* Right Column: Output */}
        <section className="lg:col-span-7">
          <div className="sticky top-32">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 min-h-[400px] flex flex-col relative overflow-hidden group">
              
              {/* Top decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F27D26]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-white/40">
                  <Terminal size={18} />
                  <span className="font-mono text-xs uppercase tracking-wider">Output / Prompt</span>
                </div>
                
                <AnimatePresence>
                  {generatedPrompt && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={handleCopy}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors border border-white/5"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-grow flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 font-mono text-sm bg-red-400/10 p-4 rounded-lg border border-red-400/20"
                    >
                      Error: {error}
                    </motion.div>
                  ) : generatedPrompt ? (
                    <motion.div
                      key="prompt"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="prose prose-invert prose-p:leading-relaxed max-w-none font-mono text-[15px] text-white/90 whitespace-pre-wrap"
                    >
                      {generatedPrompt}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-white/30"
                    >
                      <Hash size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-mono text-sm uppercase tracking-widest">Awaiting configuration...</p>
                      <p className="text-xs mt-2 opacity-50">Select tags and hit generate</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Selected Tags Display */}
            <AnimatePresence>
              {selectedTags.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex flex-wrap gap-2 px-2"
                >
                  <span className="text-xs uppercase tracking-widest text-white/40 py-1.5 mr-2">Active:</span>
                  {selectedTags.map(tag => (
                    <span key={tag} className="text-xs font-mono text-[#F27D26] bg-[#F27D26]/10 px-2 py-1 rounded-md border border-[#F27D26]/20">
                      #{tag.toLowerCase().replace(' ', '-')}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
