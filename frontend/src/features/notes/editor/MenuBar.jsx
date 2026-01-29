import {
  LuText,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuList,
  LuListOrdered,
  LuFileCode,
  LuQuote,
  LuMinus,
} from "react-icons/lu";

import MenuButton from "./menuButton";
import { useEditorState } from "@tiptap/react";

export function MenuBar({ editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isPara: ctx.editor.isActive("paragraph") ? true : false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ? true : false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ? true : false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ? true : false,
        isOrderedList: ctx.editor.isActive("orderedList") ? true : false,
        isBulletList: ctx.editor.isActive("bulletList") ? true : false,
        isBlockquote: ctx.editor.isActive("blockquote") ? true : false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ? true : false,
      };
    },
  });
  if (!editor) return null;

  return (
    <div className=" flex gap-1 p-2 border-b bg-white opacity-100">
      <MenuButton
        active={editorState.isPara}
        onClick={() => {
          editor.chain().focus().setParagraph().run();
        }}
      >
        <LuText className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isHeading1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editorState.isHeading1 ? "is-active" : ""}
      >
        <LuHeading1 className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isHeading2}
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        <LuHeading2 className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isHeading3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <LuHeading3 className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <LuList className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <LuListOrdered className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isCodeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <LuFileCode className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isBlockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <LuQuote className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <LuMinus className="h-4 w-4" />
      </MenuButton>
    </div>
  );
}
