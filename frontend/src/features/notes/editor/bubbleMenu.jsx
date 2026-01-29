import {  BubbleMenu } from "@tiptap/react/menus";

import { LuBold, LuItalic, LuStrikethrough, LuCode } from "react-icons/lu";
import MenuButton from "./menuButton";
import { useEditorState } from "@tiptap/react";

export function EditorBubbleMenu({ editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ? true : false,
        isItalic: ctx.editor.isActive("italic") ? true : false,
        isStrike: ctx.editor.isActive("strike") ? true : false,
        isCode: ctx.editor.isActive("code") ? true : false,
      };
    },
  });
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      options={{
        duration: 100,
      }}
      className="flex gap-1 rounded-md border bg-white p-1 shadow"
    >
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
    </BubbleMenu>
  );
}
