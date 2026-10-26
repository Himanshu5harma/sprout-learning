import { lockPageScroll } from "./scroll-lock";
import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

const variants = {
  primary: "ui-button-primary",
  secondary: "ui-button-secondary",
  danger: "ui-button-danger",
  quiet: "ui-button-quiet",
};
export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      type={type}
      className={`ui-button ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <section className={`ui-card ${className}`} {...props} />;
}
export function Feedback({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "error" | "success";
}) {
  return (
    <div
      className={`ui-feedback ui-feedback-${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
export function Field({
  label,
  help,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string }) {
  const id = useId();
  return (
    <div className="ui-field">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        aria-describedby={help ? `${id}-help` : undefined}
      />
      {help && <p id={`${id}-help`}>{help}</p>}
    </div>
  );
}
export function Dialog({
  children,
  onClose,
  className = "",
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog.showModal();
    const unlock = lockPageScroll();
    return () => {
      dialog.close();
      unlock();
      if (opener?.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="dialog-surface">{children}</div>
    </dialog>
  );
}
export function Tabs({
  items,
  value,
  onChange,
  label,
  id: providedId,
  panelId,
}: {
  id?: string;
  panelId?: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="ui-tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item}
          ref={(node) => {
            refs.current[index] = node;
          }}
          id={`${id}-${index}`}
          type="button"
          role="tab"
          aria-controls={panelId}
          aria-selected={value === item}
          tabIndex={value === item ? 0 : -1}
          onClick={() => onChange(item)}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? (index + 1) % items.length
                : event.key === "ArrowLeft"
                  ? (index + items.length - 1) % items.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : -1;
            if (next >= 0) {
              event.preventDefault();
              onChange(items[next]);
              refs.current[next]?.focus();
            }
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
