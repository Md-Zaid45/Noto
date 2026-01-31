import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./MenuBar";
import { EditorBubbleMenu } from "./bubbleMenu";
import "./styles.scss";
import { getImageUrl } from "./editorUtils";

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

function Editor() {
  const editor = useEditor({
    content: "Hello World!",
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
    extensions: [
      Image,
      StarterKit.configure({heading: { levels: [1, 2, 3],},}),
    ],
  });

  return (
    <div className="mt-10">
      <FloatingMenu editor={editor}></FloatingMenu>
      <MenuBar editor={editor}></MenuBar>
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;
