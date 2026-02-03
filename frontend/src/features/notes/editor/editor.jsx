import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./MenuBar";
import { EditorBubbleMenu } from "./bubbleMenu";
import "./styles.scss";
import { getImageUrl } from "./editorUtils";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNoteContent } from "../notesContentSlice";


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
  const {id}=useParams()
  const dispatch=useDispatch()
  const NotesContent=useSelector(state=>state.NotesContent)
  const content=NotesContent.find(note=>note.noteId===id)?.content
  const editor=useEditor({
    content,
    onUpdate: ({ editor }) => {
    const json = editor.getJSON(); 
    console.log("Updated content:", json);
   const note=NotesContent.find(note=>note.noteId===id)
  
    dispatch(addNoteContent({id:note?.id,content:json,noteId:id}))
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
    extensions: [
      Image,
      StarterKit.configure({heading: { levels: [1, 2, 3],},}),
    ],
  });
 
  console.log('editor comp ',id)
  return  <>
    <div className="">
      <FloatingMenu editor={editor} />
        <MenuBar editor={editor} />
        <EditorBubbleMenu editor={editor} />
         <EditorContent editor={editor}/>
    </div>
   </>
  ;
}

export default Editor;
