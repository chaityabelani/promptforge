import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Copy, Check, Hash, Settings, Upload, X, Image as ImageIcon, BookOpen } from 'lucide-react';

export default function ImagePromptGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!image) {
      setError('Please provide an image.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');
    
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['Image Inspiration'], description, image })
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

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <section className="lg:col-span-5 space-y-8 lg:space-y-10">
        <div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-2 lg:mb-3">Visual to Prompt.</h2>
          <p className="text-white/60 leading-relaxed max-w-md">
            Upload an image and let the AI generate a creative prompt based on the visual elements, style, and mood.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-semibold">
                <ImageIcon size={16} />
                <span>Upload Inspiration Image (Required)</span>
              </label>
              
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden" 
              />
              
              {image ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={image} alt="Inspiration" className="w-full h-64 object-contain bg-[#0A0A0A] opacity-80 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/90 transition-colors"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all">
                     <span className="text-xs uppercase tracking-widest font-bold drop-shadow-md">Change Image</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-16 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white/70 hover:border-white/40 transition-all hover:bg-white/5"
                >
                  <Upload size={32} className="mb-2 text-[#F27D26]" />
                  <span className="text-sm font-semibold uppercase tracking-widest">Select an Image</span>
                  <span className="text-xs opacity-60">PNG, JPG, WEBP</span>
                </button>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <label htmlFor="description" className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-semibold">
                <BookOpen size={16} />
                <span>Additional Details (Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Focus on the neon lighting, ignore the background characters..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#F27D26]/50 focus:ring-1 focus:ring-[#F27D26]/50 transition-all min-h-[120px] resize-y"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!image || isLoading}
              className={`w-full mt-4 py-4 rounded-xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-bold transition-all duration-300 ${
                !image
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : isLoading
                  ? 'bg-white/10 text-white/50 cursor-wait'
                  : 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] bg-[#F27D26] text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(242,125,38,0.4)]'
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
              {isLoading ? 'Analyzing Image...' : 'Generate from Image'}
            </button>
          </div>
        </div>
      </section>

      <section className="lg:col-span-7 mt-8 lg:mt-0">
        <div className="lg:sticky lg:top-32">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 lg:p-8 min-h-[300px] lg:min-h-[400px] flex flex-col relative overflow-hidden group">
            
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
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-mono text-sm uppercase tracking-widest">Awaiting visualization...</p>
                    <p className="text-xs mt-2 opacity-50">Upload an image to extract a prompt</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
