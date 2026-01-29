import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";

import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./MenuBar";
import { EditorBubbleMenu } from "./bubbleMenu";
import "./styles.scss";

function Editor() {
  const editor = useEditor({
    content: "Hello World!",
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
  });


  return (
    <div className="mt-10">
      <FloatingMenu editor={editor}>
        <MenuBar editor={editor}></MenuBar>
      </FloatingMenu>
      <EditorBubbleMenu editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;
