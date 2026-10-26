import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { lockPageScroll } from "../ui/scroll-lock";

const WorkspaceContext = createContext({
  expanded: false,
  toggle: () => {},
});

export function WorkspaceToggle() {
  const { expanded, toggle } = useContext(WorkspaceContext);
  return (
    <button
      type="button"
      className="workspace-toggle"
      aria-expanded={expanded}
      title={
        expanded ? "Exit full screen (Escape)" : "Expand editor and output"
      }
      onClick={toggle}
    >
      {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      {expanded ? "Exit full screen" : "Expand"}
    </button>
  );
}

export function EditorWorkspace({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const dialog = ref.current!;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    // Promote the same DOM subtree to the native top layer. Reparenting or
    // rendering a second editor would lose undo history and reset the preview.
    dialog.close();
    dialog.showModal();
    opener?.focus();
    const unlock = lockPageScroll();
    return () => {
      dialog.close();
      if (dialog.isConnected) {
        dialog.open = true;
        if (opener?.isConnected) opener.focus();
      }
      unlock();
    };
  }, [expanded]);

  return (
    <WorkspaceContext.Provider
      value={{ expanded, toggle: () => setExpanded((value) => !value) }}
    >
      <dialog
        open
        ref={ref}
        role={expanded ? "dialog" : "region"}
        aria-label={label}
        aria-modal={expanded || undefined}
        closedby="closerequest"
        className={`code-workspace ${expanded ? "is-expanded" : ""} ${className}`}
        onCancel={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (expanded) {
            setExpanded(false);
          } else {
            // An inline workspace must pass dismissal to its containing lesson.
            const parent =
              ref.current?.parentElement?.closest<HTMLDialogElement>(
                "dialog:modal",
              );
            if (parent?.requestClose) parent.requestClose();
            else
              parent?.dispatchEvent(new Event("cancel", { cancelable: true }));
          }
        }}
        onKeyDown={(event) => {
          if (!expanded || event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button, a[href], input, select, textarea, summary, iframe, [tabindex], [contenteditable]",
            ),
          ).filter(
            (node) =>
              node.tabIndex >= 0 &&
              !node.matches(":disabled") &&
              node.getClientRects().length > 0,
          );
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        {children}
      </dialog>
    </WorkspaceContext.Provider>
  );
}
