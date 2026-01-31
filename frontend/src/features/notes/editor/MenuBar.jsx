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
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuCode,
  LuImage,
} from "react-icons/lu";

import MenuButton from "./menuButton";
import { useEditorState } from "@tiptap/react";
import { useRef } from "react";

async function imagePicker() {
  let url = null;
  if ("showOpenFilePicker" in window) {
    const [handle] = await window.showOpenFilePicker();
    const file = await handle.getFile();
    url = URL.createObjectURL(file);
  }
  return url;
}
export function MenuBar({ editor }) {
  const inputRef = useRef(null);
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
        isBold: ctx.editor.isActive("bold") ? true : false,
        isItalic: ctx.editor.isActive("italic") ? true : false,
        isStrike: ctx.editor.isActive("strike") ? true : false,
        isCode: ctx.editor.isActive("code") ? true : false,
      };
    },
  });
  if (!editor) return null;

  return (
    <div className=" flex gap-1 p-1 bg-gray-100">
      <MenuButton
        active={editorState.isPara}
        onClick={() => {
          editor.chain().focus().setParagraph().run();
        }}
      >
        <LuText className="h-4 w-4" />
      </MenuButton>
      <MenuButton
        active={editorState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <LuBold className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <LuItalic className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <LuStrikethrough className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        active={editorState.isCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <LuCode className="h-4 w-4" />
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
      <MenuButton
        onClick={async () => {
          let url = await imagePicker();
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        <LuImage className="h-4 w-4" />
      </MenuButton>
    </div>
  );
}
