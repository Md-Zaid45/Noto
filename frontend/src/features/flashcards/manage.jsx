import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiFetch } from "../../commons/apifetch";
import { addFlashcards, setManageSelectedId } from "./flashcardSlice";
import {
  updateFlashcardAsync,
  deleteFlashcardsAsync,
} from "./flashcardThunks";
import LoadingLoader from "../../commons/loader";

const Manage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const flashcards = useSelector((state) => state.Flashcards.cards);
  const manageSelectedId = useSelector(
    (state) => state.Flashcards.manageSelectedId,
  );
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState(null);

  const filtered = useMemo(
    () => flashcards.filter((c) => c.noteId === id),
    [flashcards, id],
  );

  const card = useMemo(
    () => filtered.find((c) => c.id===manageSelectedId) || null,
    [filtered, manageSelectedId],
  );

  useEffect(() => {
    if (card) {
      setEditState({ ...card });
    } else {
      setEditState(null);
    }
  }, [card]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const res = await apiFetch(`/flashcards/all/${id}`, { method: "GET" });
      const data = await res.json();
      if (data.success) dispatch(addFlashcards(data.payload));
      setLoading(false);
    })();
  }, [id, dispatch]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editState) return;
    dispatch(
      updateFlashcardAsync({
        id: editState.id,
        noteId: editState.noteId,
        question: editState.question,
        answer: editState.answer,
        revisionMark: editState.revisionMark,
      }),
    );
  };

  const handleDelete = () => {
    if (!editState) return;
    const confirmed = window.confirm(
      `Delete flashcard "${editState.question}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    dispatch(deleteFlashcardsAsync([editState.id]));
  };

  return (
    <div className="flex flex-col h-full">
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-stone-900/80 flex items-center justify-center z-10">
          <LoadingLoader size="lg" color="blue" />
        </div>
      )}
      <div className="flex items-center gap-3 px-6 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-[13px] font-medium rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 px-3 py-1.5 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-lg font-medium text-stone-900 dark:text-stone-100">
          Manage Flashcards
        </h1>
      </div>
      <div className="flex-1 px-6 py-4 overflow-hidden">
        {editState ? (
          <form
            className="max-w-2xl flex flex-col gap-4"
            onSubmit={handleUpdate}
          >
            <div className="flex flex-col gap-1">
              <label className="text-stone-500 dark:text-white/50 text-xs uppercase tracking-wide">
                Question
              </label>
              <textarea
                className="w-full bg-white border border-stone-200 dark:bg-white/5 dark:border-white/10 rounded px-3 py-2 text-stone-900 dark:text-white resize-none focus:outline-none focus:border-stone-400 dark:focus:border-white/30 transition-colors"
                rows={3}
                name="question"
                value={editState.question}
                onChange={(e) =>
                  setEditState((prev) => ({
                    ...prev,
                    question: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-stone-500 dark:text-white/50 text-xs uppercase tracking-wide">
                Answer
              </label>
              <textarea
                className="w-full bg-white border border-stone-200 dark:bg-white/5 dark:border-white/10 rounded px-3 py-2 text-stone-900 dark:text-white resize-none focus:outline-none focus:border-stone-400 dark:focus:border-white/30 transition-colors"
                rows={5}
                name="answer"
                value={editState.answer}
                onChange={(e) =>
                  setEditState((prev) => ({ ...prev, answer: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-white/10 dark:hover:bg-white/20 rounded text-stone-700 dark:text-white transition-colors"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/40 text-red-600 dark:text-red-300 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400 dark:text-white/30">
            {loading ? "" : "Select a flashcard to edit"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Manage;
