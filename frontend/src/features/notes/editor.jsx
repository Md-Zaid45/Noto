// src/Tiptap.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <p>
        Hello Wosdcbdfhkjvgsdfukvhb u xcuhc hjiudsvhg d udisvhgudfv ud huidvsduifscq78we
        ydewyu fc7y 78re 3873 yfgweyurwtyufghdfjshdahd g hsdj...
      </p>
    `,
  })

  if (!editor) return null

  return (
    <div className="h-full mt-10">
      
      <FloatingMenu editor={editor}>
        Floating menu
      </FloatingMenu>

      <BubbleMenu editor={editor}>
        Bubble menu
      </BubbleMenu>

      {/* SCROLL CONTAINER */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Tiptap
