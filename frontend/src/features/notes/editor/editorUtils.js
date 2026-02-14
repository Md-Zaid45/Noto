import { useEditor } from "@tiptap/react";
import { addNoteContent, updateNoteContent } from "../notesContentSlice";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export function getImageUrl(files) {
  let url = null;
  if (files && files.length > 0) {
    for (let item of files) {
      if (item.type.startsWith("image")) url = URL.createObjectURL(item);
    }
  }
  if (url) return url;
}

const dropHandler = async (e, editor) => {
  e.preventDefault();
  let url = null;
  let files = await e.dataTransfer?.files;
  url = getImageUrl(files);
  if (url) editor.chain().focus().setImage({ src: url }).run();
};

const pasteHandler = async (e, editor) => {
  e.preventDefault();
  let url = null;
  let files = await e.clipboardData?.files;
  url = getImageUrl(files);
  if (url) editor.chain().focus().setImage({ src: url }).run();
};

export function createEditor({ note, dispatch}) {
  const editor = new Editor({
    content: note?.content,
    extensions: [
      Image,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    onUpdate({ editor }) {
      const json = editor.getJSON();
      if (note)
        dispatch(
          updateNoteContent({
            id: note.noteId,
            content: json,
          }),
        );
    },
    editorProps: {
      handleDrop(view, e) {
        dropHandler(e, editor);
        return false;
      },
      handlePaste(view, e) {
        pasteHandler(e, editor);
        return false;
      },
    },
  });
  return editor;
}

export function editorInstance(editors, note, dispatch) {
  if (editors.current.has(note.noteId)) return editors.current.get(note.noteId);
  const editor = createEditor({ note, dispatch });
  editors.current.set(note.noteId, editor);
  return editor;
}
