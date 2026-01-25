export default function RightSidebar({ ExpandRightbar }) {
  return (
    <div
      className={`bg-blue-700 h-screen transition-all duration-150 ease-out transform
  ${ExpandRightbar ? "max-w-60 opacity-100" : "max-w-0 opacity-50"}`}
    ></div>
  );
}
