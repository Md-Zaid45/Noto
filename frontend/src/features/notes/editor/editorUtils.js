import { useEditor } from "@tiptap/react";
import { addNoteContent } from "../notesContentSlice";
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

export function createEditor({ id, note, dispatch }) {
  const editor = new Editor({
    content: note?.content ? note.content : "",
    extensions: [
      Image,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    onUpdate({ editor }) {
      const json = editor.getJSON();
      dispatch(
        addNoteContent({
          id: note?.id,
          content: json,
          noteId: id,
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

export function editorInstance(editors, id, note, dispatch) {
  if (editors.current.get(id)) return editors.current.get(id);
  const editor = createEditor({ id, note, dispatch });
  editors.current.set(id, editor);
  return editor;
}
