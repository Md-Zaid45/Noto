import { useEditor } from "@tiptap/react";
import { addNoteContent, updateNoteContent } from "../notesContentSlice";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRef } from "react";

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

export function createEditor({ note }) {
  const editor = new Editor({
    content: note?.content,
    extensions: [
      Image,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],

    editorProps: {
      handleDrop(e) {
        dropHandler(e, editor);
        return false;
      },
      handlePaste(e) {
        pasteHandler(e, editor);
        return false;
      },
    },
  });
  return editor;
}

export function editorInstance(editors, note) {
  if (editors.current.has(note.noteId)) return editors.current.get(note.noteId);
  const editor = createEditor({ note });
  editors.current.set(note.noteId, editor);
  return editor;
}
