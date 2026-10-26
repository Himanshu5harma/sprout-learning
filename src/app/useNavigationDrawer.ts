import { lockPageScroll } from "../ui/scroll-lock";
import { useEffect, type Dispatch, type SetStateAction } from "react";
// Off-canvas navigation behaves as a modal only at the mobile breakpoint.
export function useNavigationDrawer(
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    const media = matchMedia("(max-width: 800px)");
    if (!open || !media.matches) return;
    const panel = document.getElementById("learning-navigation");
    const main = document.querySelector<HTMLElement>(".main-shell");
    if (!panel || !main) return;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const unlock = lockPageScroll();
    main.inert = true;
    const targets = () =>
      [
        ...panel.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled), a[href]",
        ),
      ].filter((node) => node.getClientRects().length > 0);
    targets()[0]?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key === "Tab") {
        const items = targets(),
          first = items[0],
          last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const resized = () => {
      if (!media.matches) setOpen(false);
    };
    document.addEventListener("keydown", handle);
    media.addEventListener("change", resized);
    return () => {
      main.inert = false;
      unlock();
      document.removeEventListener("keydown", handle);
      media.removeEventListener("change", resized);
      opener?.focus();
    };
  }, [open, setOpen]);
}
