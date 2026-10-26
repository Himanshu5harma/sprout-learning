let owners = 0;
let previous = "";
// Dialogs and the mobile drawer may close in a different order than they open.
export function lockPageScroll() {
  if (owners === 0) {
    previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  owners++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    owners--;
    if (owners === 0) document.body.style.overflow = previous;
  };
}
