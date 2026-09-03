export default function MenuButton({ editor, onClick, active, canRun = true, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-[28px] h-[26px] flex items-center justify-center rounded-[5px]
        transition-all duration-150 text-[14px]
        ${active ? "bg-[#ecfdf5] dark:bg-emerald-950/30 text-[#059669] dark:text-emerald-400" : "text-[#6B6A65] dark:text-stone-400"}
        hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400
        disabled:opacity-40 disabled:pointer-events-none
        active:scale-[0.97]
      `}
    >
      {children}
    </button>
  )
}