import { useRouteError, useNavigate } from "react-router-dom";
import { FileX, Home, ArrowLeft } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-10 right-10 w-24 h-24 bg-[#d1fae5] dark:bg-emerald-950/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 left-10 w-32 h-16 bg-[#e5e7eb] dark:bg-stone-800 rounded-full blur-2xl opacity-40" />

      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-[#fef2f2] dark:bg-red-950/30 flex items-center justify-center">
          <FileX className="w-10 h-10 text-[#ef4444] dark:text-red-400" />
        </div>
      </div>

      <div className="max-w-md">
        <p className="uppercase tracking-[0.2em] text-[10px] font-semibold text-[#9ca3af] dark:text-stone-500 mb-3">
          {error?.status === 404 ? "Error 404" : "Something went wrong"}
        </p>

        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[#111827] dark:text-stone-100 mb-4 tracking-tight">
          {error?.status === 404 ? (
            <>Lost in the <span className="text-[#059669] dark:text-emerald-400">notes</span></>
          ) : (
            <>Oops! Something <span className="text-[#059669] dark:text-emerald-400">broke</span></>
          )}
        </h1>

        <p className="text-[#6b7280] dark:text-stone-400 text-sm leading-relaxed mb-8 px-4">
          {error?.status === 404
            ? "The page you're looking for has drifted away. Let's get you back to your notes."
            : error?.message || "An unexpected error occurred. Please try again."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 bg-[#059669] dark:bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#047857] dark:hover:bg-emerald-700 transition-all duration-150 active:scale-[0.97]"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white dark:bg-stone-900 border border-[#e5e7eb] dark:border-stone-800 text-[#6b7280] dark:text-stone-400 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f9fafb] dark:hover:bg-stone-800 transition-all duration-150 active:scale-[0.97]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
