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

function Divider() {
  return <div className="bg-[#E2E0DC] dark:bg-stone-700 h-4 w-[0.5px] mx-1" />;
}

function HeadingButton({ editor, level, active, icon }) {
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
      className={`
        px-2 py-0.5 text-[11px] font-medium rounded-[5px]
        transition-all duration-150
        ${active ? "bg-[#ecfdf5] dark:bg-emerald-950/30 text-[#059669] dark:text-emerald-400" : "text-[#6B6A65] dark:text-stone-400"}
        hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400
        active:scale-[0.97]
      `}
    >
      {icon}
    </button>
  );
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
    <div className="flex items-center h-[36px] bg-white dark:bg-stone-900 border-b border-[#E8E6E1] dark:border-stone-800 px-4">
      <MenuButton
        active={editorState.isPara}
        onClick={() => {
          editor.chain().focus().setParagraph().run();
        }}
      >
        <LuText className="h-[14px] w-[14px]" />
      </MenuButton>
      <MenuButton
        active={editorState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <LuBold className="h-[14px] w-[14px]" />
      </MenuButton>

      <MenuButton
        active={editorState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <LuItalic className="h-[14px] w-[14px]" />
      </MenuButton>

      <MenuButton
        active={editorState.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <LuStrikethrough className="h-[14px] w-[14px]" />
      </MenuButton>

      <MenuButton
        active={editorState.isCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <LuCode className="h-[14px] w-[14px]" />
      </MenuButton>

      <Divider />

      <HeadingButton
        editor={editor}
        level={1}
        active={editorState.isHeading1}
        icon="H1"
      />

      <HeadingButton
        editor={editor}
        level={2}
        active={editorState.isHeading2}
        icon="H2"
      />

      <HeadingButton
        editor={editor}
        level={3}
        active={editorState.isHeading3}
        icon="H3"
      />

      <Divider />

      <MenuButton
        active={editorState.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <LuList className="h-[14px] w-[14px]" />
      </MenuButton>

      <MenuButton
        active={editorState.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <LuListOrdered className="h-[14px] w-[14px]" />
      </MenuButton>

      <Divider />

      <MenuButton
        active={editorState.isBlockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <LuQuote className="h-[14px] w-[14px]" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <LuMinus className="h-[14px] w-[14px]" />
      </MenuButton>

      <MenuButton
        onClick={async () => {
          let url = await imagePicker();
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        <LuImage className="h-[14px] w-[14px]" />
      </MenuButton>

      <MenuButton
        active={editorState.isCodeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <LuFileCode className="h-[14px] w-[14px]" />
      </MenuButton>
    </div>
  );
}