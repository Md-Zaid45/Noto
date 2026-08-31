import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../commons/apifetch";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/ai/quiz/${id}`, {
          method: "POST",
          body: { count: 5 },
        });
        const data = await res.json();
        if (data.success && data.quiz?.length) {
          setQuiz(data.quiz);
        } else {
          setError(data.message || "No quiz generated");
        }
      } catch (err) {
        setError("Failed to generate quiz");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === quiz[current].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current < quiz.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-stone-50 dark:bg-stone-950 p-7 flex items-center justify-center">
        <p className="text-stone-500 dark:text-stone-400">Generating quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-stone-50 dark:bg-stone-950 p-7">
        <div className="max-w-xl mx-auto mt-12 text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[13px] font-medium rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2.5 hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="min-h-full bg-stone-50 dark:bg-stone-950 p-7">
        <div className="max-w-xl mx-auto mt-12 text-center">
          <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Quiz Complete</h2>
          <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{score}/{quiz.length}</p>
          <p className="text-stone-500 dark:text-stone-400 mb-6">{percentage}% correct</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="text-[13px] font-medium rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2.5 hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-[13px] font-medium rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 px-4 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Back to decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const q = quiz[current];
  const isCorrect = selected === q.correctIndex;

  return (
    <div className="min-h-full bg-stone-50 dark:bg-stone-950 p-7">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-medium text-stone-900 dark:text-stone-100">Quiz</h1>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {current + 1} / {quiz.length}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 mb-8 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((current + 1) / quiz.length) * 100}%` }}
          />
        </div>

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6">
          <h2 className="text-[15px] font-medium text-stone-900 dark:text-stone-100 mb-5">
            {q.question}
          </h2>

          <div className="space-y-2.5">
            {q.options.map((option, i) => {
              let classes =
                "w-full text-left px-4 py-3 text-sm rounded-xl border transition-colors";
              if (selected === null) {
                classes += " border-stone-200 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer dark:text-stone-200";
              } else if (i === q.correctIndex) {
                classes += " border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300";
              } else if (i === selected && !isCorrect) {
                classes += " border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300";
              } else {
                classes += " border-stone-200 dark:border-stone-700 opacity-60";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={classes}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-5">
              <p className={`text-sm ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} mb-3`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3 border border-stone-100 dark:border-stone-700">
                {q.explanation}
              </p>
              <button
                onClick={handleNext}
                className="mt-4 text-[13px] font-medium rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-5 py-2.5 hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
              >
                {current < quiz.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
