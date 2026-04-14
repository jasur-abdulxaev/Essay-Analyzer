"use client";

import { useState, useMemo, useEffect } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { 
  Send, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  BarChart3, 
  History,
  FileText,
  Sparkles,
  ChevronRight,
  PenLine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
}

interface AnalysisResult {
  wordCount: number;
  sentenceCount: number;
  ieltsBand: number;
  cefrLevel: string;
  grammarErrors: GrammarError[];
  suggestions: string[];
  improvedEssay: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7196/api";

export default function Dashboard() {
  const { getToken } = useAuth();
  const [essay, setEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Stats calculation
  const wordCount = useMemo(() => {
    if (!essay.trim()) return 0;
    return essay.trim().split(/\s+/).length;
  }, [essay]);

  const charCount = essay.length;

  const handleClear = () => {
    if (confirm("Clear your essay? This cannot be undone.")) {
      setEssay("");
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (wordCount < 10) {
      setError("Please write at least 10 words for a meaningful analysis.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await axios.post(`${API_BASE_URL}/essay/analyze`, {
        content: essay
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setResult(response.data);
      // Scroll to result
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || "Failed to analyze essay. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                <PenLine size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-display font-bold">Essaychi</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-sm font-medium text-primary-600 border-b-2 border-primary-600 py-5">Analyzer</button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors py-5">History</button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors py-5">Resources</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Editor Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText size={18} />
                  <span className="text-sm font-medium">New Essay Draft</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>{wordCount} Words</span>
                  <span>{charCount} Characters</span>
                </div>
              </div>
              
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Paste or write your essay here (at least 200 words recommended for IELTS)..."
                className="flex-1 p-8 text-lg leading-relaxed resize-none outline-none placeholder:text-slate-300"
              />

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={handleClear}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Clear"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !essay.trim()}
                  className="btn-primary flex items-center gap-2 shadow-primary-500/20"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze Essay
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {/* Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  id="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 space-y-10"
                >
                  {/* Scores Overview */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <ScoreCard label="IELTS Band" value={result.ieltsBand.toFixed(1)} color="bg-primary-600" />
                    <ScoreCard label="CEFR Level" value={result.cefrLevel} color="bg-emerald-600" />
                    <ScoreCard label="Word Count" value={result.wordCount} color="bg-slate-800" />
                    <ScoreCard label="Sentences" value={result.sentenceCount} color="bg-slate-800" />
                  </div>

                  {/* Grammar Corrections */}
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                       <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
                          <AlertCircle size={18} />
                       </div>
                       Grammar & Spelling
                    </h3>
                    <div className="space-y-4">
                      {result.grammarErrors.length > 0 ? (
                        result.grammarErrors.map((err, i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex flex-wrap gap-2 items-center mb-2">
                              <span className="line-through text-red-500 font-medium">{err.original}</span>
                              <ChevronRight size={16} className="text-slate-400" />
                              <span className="text-emerald-600 font-bold">{err.corrected}</span>
                            </div>
                            <p className="text-sm text-slate-600">{err.explanation}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-500 italic">No grammar errors found! Great job.</div>
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                       <div className="p-1.5 rounded-lg bg-primary-100 text-primary-600">
                          <BarChart3 size={18} />
                       </div>
                       Suggestions for Improvement
                    </h3>
                    <ul className="space-y-3">
                      {result.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <CheckCircle size={18} className="text-emerald-500 mt-1 shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improved Version */}
                  <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
                    <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                       <Sparkles size={18} className="text-primary-400" />
                       AI-Improved Version
                    </h3>
                    <div className="prose prose-invert max-w-none text-slate-300 italic leading-relaxed">
                      {result.improvedEssay}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <History size={18} className="text-slate-400" />
                  Recent Analyses
                </h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-not-allowed opacity-50">
                    <div className="text-sm font-medium line-clamp-1">The impact of technology on...</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">IELTS 7.5 • 2 days ago</div>
                  </div>
                  <div className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-not-allowed opacity-50 text-center text-xs text-slate-400 italic">
                    Analysis history will appear here
                  </div>
                </div>
             </div>

             <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-200">
                <h4 className="font-bold mb-2">Essaychi Pro</h4>
                <p className="text-primary-100 text-sm mb-4">Get unlimited analyses, PDF reports, and advanced vocabulary coaching.</p>
                <button className="w-full py-2 bg-white text-primary-600 font-bold rounded-xl text-sm hover:bg-primary-50 transition-colors">
                  Upgrade Now
                </button>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function ScoreCard({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-3xl font-display font-extrabold ${value === "0.0" ? "text-slate-300" : "text-slate-900"}`}>
        {value}
      </span>
      {value !== "0.0" && <div className={`h-1 w-8 rounded-full mt-3 ${color}`} />}
    </div>
  );
}
