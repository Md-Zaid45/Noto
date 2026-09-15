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
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import Tabs from "../notes/editor/tabs";

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
    <div className="flex flex-col h-full bg-white dark:bg-stone-900">
      <Tabs OpenTabs={[]} hideTabs={true} />
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-stone-900/80 flex items-center justify-center z-10">
          <LoadingLoader size="lg" color="blue" />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 px-6 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </Button>
          <h1 className="text-lg font-medium text-stone-900 dark:text-stone-100">
            Manage Flashcards
          </h1>
        </div>
        <div className="px-6 py-4">
        {editState ? (
          <Card className="max-w-2xl">
            <CardContent>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleUpdate}
              >
                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-wide">
                    Question
                  </Label>
                  <Textarea
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

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-wide">
                    Answer
                  </Label>
                  <Textarea
                    rows={5}
                    name="answer"
                    value={editState.answer}
                    onChange={(e) =>
                      setEditState((prev) => ({ ...prev, answer: e.target.value }))
                    }
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Button type="submit" variant="secondary">
                    Update
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400 dark:text-white/30">
            {loading ? "" : "Select a flashcard to edit"}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Manage;
