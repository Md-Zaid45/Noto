import React from 'react';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#F8FBF9] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="absolute top-10 right-10 w-24 h-24 bg-green-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 left-10 w-32 h-16 bg-gray-100 rounded-full blur-2xl opacity-60" />

      <div className="relative mb-8">
        <div className="w-32 h-40 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center transform -rotate-2 relative">
          <div className="w-12 h-12 border-2 border-[#1B4332] rounded-md flex items-center justify-center relative">
             <div className="w-full h-[2px] bg-[#1B4332] absolute top-1/2 -translate-y-1/2 rotate-45 scale-x-50 origin-left" />
             <div className="w-full h-[2px] bg-[#1B4332] absolute top-1/2 -translate-y-1/2 -rotate-45 scale-x-50 origin-right" />
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1B4332" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-7.44 4.89a1.5 1.5 0 01-1.72 0L3.75 6.75" />
            </svg>
          </div>
          
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">?</span>
          </div>
        </div>
      </div>

      <div className="max-w-md">
        <p className="uppercase tracking-[0.2em] text-[10px] font-semibold text-gray-400 mb-4">
          Error 404
        </p>
        
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
          Lost in the <span className="text-[#1B4332]">Vellum.</span>
        </h1>
        
        <p className="text-gray-500 text-lg leading-relaxed mb-10 px-4">
          The page you're looking for has drifted away. Let's get you back to your notes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button className="bg-black text-white px-10 py-4 rounded-md font-bold text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors w-full sm:w-auto">
            Return Home
          </button>
        </div>

        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

