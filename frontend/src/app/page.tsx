import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, CheckCircle2, Languages, Zap, Marker, PenLine } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary-50 to-transparent -z-10" />
      <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-200/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-200/20 blur-[120px] rounded-full -z-10" />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <PenLine size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Essaychi
          </span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-secondary">Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-primary flex items-center gap-2">
              Dashboard <ArrowRight size={18} />
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 text-center md:pt-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8">
          <Zap size={14} />
          <span>Powered by Advanced AI</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-950 mb-6 leading-[1.1]">
          Master Your Writing with <br />
          <span className="text-primary-600">AI-Powered</span> Analysis
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate companion for IELTS and CEFR essay preparation. Get detailed scores, 
          grammar corrections, and vocabulary suggestions in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary w-full sm:w-auto h-14 px-10 text-lg flex items-center justify-center gap-2">
                Analyze My First Essay <ArrowRight size={20} />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-primary w-full sm:w-auto h-14 px-10 text-lg flex items-center justify-center gap-2">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          </SignedIn>
          <button className="btn-secondary w-full sm:w-auto h-14 px-10 text-lg">
            View Sample Report
          </button>
        </div>

        {/* Hero Image / Mockup Placeholder */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-3xl blur opacity-20" />
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-auto md:h-[500px] flex">
             {/* Simple mockup visual */}
             <div className="w-1/4 border-r border-slate-100 p-6 hidden md:block text-left">
                <div className="w-full h-8 bg-slate-100 rounded-lg mb-4" />
                <div className="space-y-3">
                  <div className="w-full h-4 bg-slate-100/50 rounded" />
                  <div className="w-[80%] h-4 bg-slate-100/50 rounded" />
                  <div className="w-[90%] h-4 bg-slate-100/50 rounded" />
                </div>
             </div>
             <div className="flex-1 p-8 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-4 w-32 bg-slate-100 rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-primary-100 rounded-full" />
                    <div className="h-8 w-24 bg-primary-600 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-6 w-full bg-slate-50 rounded" />
                  <div className="h-6 w-[95%] bg-slate-50 rounded" />
                  <div className="h-6 w-[98%] bg-slate-50 rounded" />
                  <div className="h-6 w-[92%] bg-slate-50 rounded" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24 border-t border-slate-100">
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Languages className="text-primary-600" size={32} />}
            title="IELTS & CEFR Grading"
            description="Receive accurate band scores (0-9) and CEFR levels (A1-C2) based on official descriptors."
          />
          <FeatureCard 
            icon={<CheckCircle2 className="text-primary-600" size={32} />}
            title="Precise Grammar Fixes"
            description="Our AI identifies every mistake and provides detailed explanations to help you learn."
          />
          <FeatureCard 
            icon={<Zap className="text-primary-600" size={32} />}
            title="Instant Improvement"
            description="Get a rewritten, high-scoring version of your essay to see exactly how to level up."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 text-center text-slate-500 border-t border-slate-100">
        <p>© {new Date().getFullYear()} Essaychi. Built for writers, by AI.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-display font-bold mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed italic">
        {description}
      </p>
    </div>
  );
}
