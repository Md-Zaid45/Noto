export function menuPosition(e) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
 const MENU_WIDTH = 40;
   const MENU_HEIGHT = 80;
   const OFFSET = 3;
  let x = e.clientX + OFFSET;
  let y = e.clientY + OFFSET;

  // flip horizontally if overflowing right
  if (x + MENU_WIDTH > vw) {
    x = e.clientX - MENU_WIDTH - OFFSET;
  }

  // flip vertically if overflowing bottom
  if (y + MENU_HEIGHT > vh) {
    y = e.clientY - MENU_HEIGHT - OFFSET;
  }

  // final clamp (absolute safety)
  x = Math.max(0, Math.min(x, vw - MENU_WIDTH));
  y = Math.max(0, Math.min(y, vh - MENU_HEIGHT));
console.log( { x, y })
  return { x, y }
}
