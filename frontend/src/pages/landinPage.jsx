import React from "react";
import {
  Search,
  Edit3,
  FolderOpen,
  AppWindow,
  Zap,
  X,
  CheckCircle2,
} from "lucide-react";
import Header from "../features/navigation/header/header";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      <Header></Header>
      <main>
        <section className="relative pt-24 pb-20 md:pb-32 px-6 md:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end gap-8 mb-16">
              <h1 className="font-extrabold text-5xl md:text-8xl tracking-tighter leading-none max-w-4xl text-black">
                Think. Write. Organize{" "}
                <span className="text-emerald-700">all in one place.</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-8">
                <p className="text-lg md:text-xl text-stone-500 leading-relaxed">
                  The professional workspace designed for deep focus and
                  effortless archival. No clutter, no distractions just your
                  thoughts in high definition.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    className="w-full sm:w-auto bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-800 hover:shadow-lg transition-all active:scale-95"
                    onClick={() => {
                      navigate("../signup");
                    }}
                  >
                    Start Writing
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 relative">
                <div className="aspect-video bg-stone-200 rounded-xl overflow-hidden shadow-2xl relative border border-stone-300/50 flex items-center justify-center p-4">
                  <svg
                    viewBox="0 0 800 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full shadow-sm rounded-lg"
                  >
                    <rect width="800" height="500" rx="12" fill="#fafaf9" />
                    <rect x="0" y="0" width="220" height="500" fill="#f5f5f4" />
                    <rect
                      x="24"
                      y="32"
                      width="120"
                      height="16"
                      rx="8"
                      fill="#d6d3d1"
                    />
                    <rect
                      x="24"
                      y="80"
                      width="160"
                      height="12"
                      rx="6"
                      fill="#e7e5e4"
                    />
                    <rect
                      x="24"
                      y="108"
                      width="140"
                      height="12"
                      rx="6"
                      fill="#e7e5e4"
                    />
                    <rect
                      x="24"
                      y="136"
                      width="170"
                      height="12"
                      rx="6"
                      fill="#d6d3d1"
                    />
                    <rect
                      x="24"
                      y="164"
                      width="150"
                      height="12"
                      rx="6"
                      fill="#e7e5e4"
                    />
                    <rect
                      x="260"
                      y="48"
                      width="400"
                      height="32"
                      rx="8"
                      fill="#e7e5e4"
                    />
                    <rect
                      x="260"
                      y="112"
                      width="480"
                      height="12"
                      rx="6"
                      fill="#f5f5f4"
                    />
                    <rect
                      x="260"
                      y="140"
                      width="450"
                      height="12"
                      rx="6"
                      fill="#f5f5f4"
                    />
                    <rect
                      x="260"
                      y="168"
                      width="420"
                      height="12"
                      rx="6"
                      fill="#f5f5f4"
                    />
                    <rect
                      x="260"
                      y="224"
                      width="300"
                      height="12"
                      rx="6"
                      fill="#f5f5f4"
                    />
                    <rect
                      x="260"
                      y="252"
                      width="460"
                      height="12"
                      rx="6"
                      fill="#f5f5f4"
                    />
                    <rect
                      x="260"
                      y="280"
                      width="380"
                      height="12"
                      rx="6"
                      fill="#f5f5f4"
                    />
                    <rect
                      x="260"
                      y="336"
                      width="140"
                      height="40"
                      rx="8"
                      fill="#047857"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 px-6 md:px-8 bg-stone-100 border-y border-stone-200">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16">
              <span className="text-emerald-700 text-sm font-bold uppercase tracking-widest block mb-2">
                Capabilities
              </span>
              <h2 className="font-bold text-3xl md:text-4xl text-black tracking-tight">
                Engineered for Clarity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div
                className="md:col-span-2 bg-white p-8 md:p-10 rounded-xl flex flex-col justify-between
               min-h-100 shadow-sm border border-stone-200"
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 text-emerald-700">
                    <Edit3 size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-black">
                    Rich Editor
                  </h3>
                  <p className="text-stone-500 leading-relaxed">
                    Rich text writing experience with beautiful typography and
                    immersive focus modes.
                  </p>
                </div>
                <div className="mt-8 rounded-lg overflow-hidden h-48 bg-stone-50 border border-stone-100 flex items-center justify-center p-6">
                  <svg
                    viewBox="0 0 400 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-sm"
                  >
                    <path
                      d="M40 50H240"
                      stroke="#047857"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 100H360"
                      stroke="#e7e5e4"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 130H320"
                      stroke="#e7e5e4"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 160H200"
                      stroke="#e7e5e4"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <rect
                      x="220"
                      y="154"
                      width="4"
                      height="20"
                      fill="#047857"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              <div className="md:col-span-2 bg-stone-200/50 p-8 md:p-10 rounded-xl flex flex-col justify-between min-h-[400px] border border-stone-200">
                <div>
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-black shadow-sm">
                    <FolderOpen size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-black">
                    Folder Organization
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    Hierarchical structure that grows with your thoughts.
                    Infinite nesting for the ultimate taxonomist.
                  </p>
                </div>
                <div className="mt-8 bg-white rounded-lg p-6 h-48 border border-stone-200 shadow-sm flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-stone-300"></div>
                      <div className="h-3 w-3/4 bg-stone-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                      <div className="w-4 h-4 rounded bg-emerald-200"></div>
                      <div className="h-3 w-1/2 bg-emerald-100 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                      <div className="w-4 h-4 rounded bg-stone-300"></div>
                      <div className="h-3 w-2/3 bg-stone-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 ml-12">
                      <div className="w-4 h-4 rounded bg-stone-300"></div>
                      <div className="h-3 w-1/3 bg-stone-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-black text-white p-8 md:p-10 rounded-xl flex flex-col sm:flex-row items-center gap-8 shadow-xl">
                <div className="w-full sm:w-1/2">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 text-emerald-300">
                    <AppWindow size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Multi-Tab Workflow
                  </h3>
                  <p className="text-stone-400 leading-relaxed">
                    Switch between projects instantly. Your workspace remembers
                    exactly where you left off.
                  </p>
                </div>
                <div className="w-full sm:w-1/2 h-48 rounded-lg bg-white/5 border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
                  <svg
                    viewBox="0 0 300 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full scale-110"
                  >
                    <rect
                      x="60"
                      y="40"
                      width="220"
                      height="140"
                      rx="8"
                      fill="#292524"
                      stroke="#44403c"
                      strokeWidth="2"
                    />
                    <rect
                      x="30"
                      y="60"
                      width="220"
                      height="140"
                      rx="8"
                      fill="#44403c"
                      stroke="#57534e"
                      strokeWidth="2"
                    />
                    <rect
                      x="0"
                      y="80"
                      width="220"
                      height="140"
                      rx="8"
                      fill="#fafaf9"
                      shadow="lg"
                    />
                    <rect
                      x="20"
                      y="100"
                      width="80"
                      height="8"
                      rx="4"
                      fill="#d6d3d1"
                    />
                    <rect
                      x="20"
                      y="124"
                      width="160"
                      height="6"
                      rx="3"
                      fill="#e7e5e4"
                    />
                    <rect
                      x="20"
                      y="140"
                      width="120"
                      height="6"
                      rx="3"
                      fill="#e7e5e4"
                    />
                  </svg>
                </div>
              </div>

              <div className="md:col-span-2 bg-emerald-50 p-8 md:p-10 rounded-xl flex flex-col justify-center text-center border border-emerald-100">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-700">
                  <Zap size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-emerald-900">
                  Fast & Minimal
                </h3>
                <p className="text-emerald-700/80 leading-relaxed max-w-xs mx-auto">
                  Zero bloat. Instant sync. Built for those who value their time
                  and mental bandwidth.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 px-6 md:px-8 bg-stone-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="font-bold text-3xl md:text-4xl text-black mb-4 tracking-tight">
                Simple by Design
              </h2>
              <p className="text-stone-500 max-w-2xl mx-auto text-lg">
                We've stripped away the noise to let your creativity take center
                stage.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              <div className="hidden md:block absolute top-6 left-[10%] w-[80%] h-[2px] bg-stone-200 -z-10"></div>

              <div className="space-y-6 text-center md:text-left">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-bold text-xl mx-auto md:mx-0 ring-8 ring-stone-50 shadow-md">
                  1
                </div>
                <h4 className="font-bold text-xl text-black">Capture</h4>
                <p className="text-stone-500 leading-relaxed">
                  Quickly jot down ideas using lightning-fast hotkeys and a
                  distraction-free modal.
                </p>
              </div>

              <div className="space-y-6 text-center md:text-left">
                <div className="w-12 h-12 bg-emerald-700 text-white flex items-center justify-center rounded-full font-bold text-xl mx-auto md:mx-0 ring-8 ring-stone-50 shadow-md">
                  2
                </div>
                <h4 className="font-bold text-xl text-black">Refine</h4>
                <p className="text-stone-500 leading-relaxed">
                  Use our rich formatting engine to turn raw thoughts into
                  structured knowledge.
                </p>
              </div>

              <div className="space-y-6 text-center md:text-left">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-bold text-xl mx-auto md:mx-0 ring-8 ring-stone-50 shadow-md">
                  3
                </div>
                <h4 className="font-bold text-xl text-black">Archive</h4>
                <p className="text-stone-500 leading-relaxed">
                  Organize effortlessly with smart folders and bi-directional
                  linking.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 px-6 md:px-8 bg-stone-200/50 border-t border-stone-200">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200">
            <div className="p-10 border-b border-stone-200 bg-stone-50">
              <h2 className="font-bold text-3xl text-black text-center tracking-tight">
                Why Noto?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-stone-200 space-y-8">
                <h5 className="text-xs uppercase tracking-widest font-bold text-stone-400">
                  The Old Way
                </h5>
                <ul className="space-y-5">
                  <li className="flex items-center gap-3 text-stone-400 line-through">
                    <X size={20} className="text-red-400 shrink-0" />
                    Cluttered interface
                  </li>
                  <li className="flex items-center gap-3 text-stone-400 line-through">
                    <X size={20} className="text-red-400 shrink-0" />
                    Constant distractions
                  </li>
                  <li className="flex items-center gap-3 text-stone-400 line-through">
                    <X size={20} className="text-red-400 shrink-0" />
                    Slow, bloated software
                  </li>
                  <li className="flex items-center gap-3 text-stone-400 line-through">
                    <X size={20} className="text-red-400 shrink-0" />
                    Fragmented workflow
                  </li>
                </ul>
              </div>

              <div className="p-10 md:p-12 space-y-8 bg-emerald-50/50">
                <h5 className="text-xs uppercase tracking-widest font-bold text-emerald-700">
                  The Noto Way
                </h5>
                <ul className="space-y-5">
                  <li className="flex items-center gap-3 text-black font-medium">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-600 shrink-0"
                    />
                    Editorial-grade design
                  </li>
                  <li className="flex items-center gap-3 text-black font-medium">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-600 shrink-0"
                    />
                    Focus-first philosophy
                  </li>
                  <li className="flex items-center gap-3 text-black font-medium">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-600 shrink-0"
                    />
                    Blazing fast performance
                  </li>
                  <li className="flex items-center gap-3 text-black font-medium">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-600 shrink-0"
                    />
                    Unified workspace
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 md:px-8 text-center relative overflow-hidden bg-white">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="font-extrabold text-4xl md:text-6xl tracking-tight text-black mb-8">
              Ready to achieve total focus?
            </h2>
            <p className="text-lg md:text-xl text-stone-500 mb-10">
              Join 50,000+ thinkers and writers who have found their digital
              sanctuary with Noto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="w-full sm:w-auto bg-black text-white px-10 py-4 md:py-5 rounded-lg font-bold text-lg md:text-xl hover:scale-105 hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/signup")}
              >
                Get Started for Free
              </button>
              <p className="text-sm text-stone-400 mt-4 sm:mt-0 sm:ml-4">
                No credit card required.
                <br className="hidden sm:block" /> Cancel anytime.
              </p>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-emerald-300/10 blur-[100px] rounded-full pointer-events-none"></div>
        </section>
      </main>

      <footer className="w-full border-t border-stone-200 bg-stone-50">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-xl font-black text-black tracking-tight">
              Noto
            </span>
            <p className="text-xs uppercase tracking-widest text-stone-400">
              © 2026 Noto Editorial Note-Taking. Built for focus.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
