
export default function MenuButton({ editor, onClick, active, canRun = true, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      // disabled={!canRun}
      className={`
        h-8 w-8 flex items-center justify-center rounded-md
        transition
        ${active ? "bg-blue-200 text-blue-700" : "text-gray-600"}
        hover:bg-blue-100
        disabled:opacity-40 disabled:pointer-events-none
      `}
    >
      {children}
    </button>
    )
}
