import { useEffect, useRef } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  Decoration,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  keymap,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  bracketMatching,
  indentUnit,
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { tags } from "@lezer/highlight";

// The same parser and colour rules are used for examples and editable code.
const highlighting = HighlightStyle.define([
  { tag: tags.keyword, class: "sprout-keyword" },
  { tag: [tags.string, tags.special(tags.string)], class: "sprout-string" },
  { tag: [tags.number, tags.bool, tags.null], class: "sprout-number" },
  { tag: tags.comment, class: "sprout-comment" },
  {
    tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
    class: "sprout-function",
  },
  { tag: [tags.tagName, tags.typeName], class: "sprout-tag" },
  { tag: [tags.propertyName, tags.attributeName], class: "sprout-property" },
  { tag: tags.operator, class: "sprout-operator" },
]);

const theme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#1d2b29",
      color: "#e0e9e4",
      fontSize: "var(--code-font-size, 15px)",
    },
    ".cm-content": {
      fontFamily: '"DM Mono", ui-monospace, monospace',
      padding: "18px 0",
      caretColor: "#e5efc9",
      minHeight: "280px",
    },
    ".cm-line": { padding: "0 18px 0 10px", lineHeight: "1.8" },
    ".cm-gutters": {
      backgroundColor: "#182522",
      color: "#a4b7aa",
      borderRight: "1px solid #34483d",
      padding: "0 4px 0 6px",
      fontFamily: '"DM Mono", monospace',
      fontSize: "inherit",
    },
    ".cm-lineNumbers .cm-gutterElement": { lineHeight: "1.8" },
    ".cm-activeLineGutter": { backgroundColor: "#30443b", color: "#eef6df" },
    ".cm-activeLine": { backgroundColor: "#ffffff06" },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "#44694d !important",
    },
    ".cm-cursor": { borderLeftColor: "#eef6da" },
    "&.cm-focused": { outline: "2px solid #90b477", outlineOffset: "-2px" },
    ".cm-scroller": { overflow: "auto", maxHeight: "550px" },
    ".cm-discussed-line": {
      backgroundColor: "#aac77a1e",
      boxShadow: "inset 3px 0 #c7dc8c",
    },
  },
  { dark: true },
);

export default function CodeEditor({
  value,
  onChange,
  language = "JavaScript",
  readOnly = false,
  label = "Code",
  onRun,
  discussedLine,
}) {
  const host = useRef(null);
  const editor = useRef(null);
  const callbacks = useRef({ onChange, onRun });
  const lineHighlight = useRef(new Compartment());
  callbacks.current = { onChange, onRun };

  useEffect(() => {
    const view = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          EditorView.lineWrapping,
          javascript({ jsx: language === "React" }),
          syntaxHighlighting(highlighting),
          theme,
          bracketMatching(),
          indentUnit.of("  "),
          EditorState.tabSize.of(2),
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!readOnly),
          EditorView.contentAttributes.of({
            "aria-label": label,
            "aria-multiline": "true",
            role: readOnly ? "region" : "textbox",
            ...(readOnly ? { tabindex: "0" } : {}),
          }),
          lineHighlight.current.of([]),
          ...(!readOnly
            ? [
                history(),
                drawSelection(),
                highlightActiveLine(),
                highlightActiveLineGutter(),
                keymap.of([
                  {
                    key: "Mod-Enter",
                    run: () => {
                      callbacks.current.onRun?.();
                      return true;
                    },
                  },
                  ...defaultKeymap,
                  ...historyKeymap,
                ]),
                EditorView.updateListener.of((update) => {
                  if (update.docChanged)
                    callbacks.current.onChange?.(update.state.doc.toString());
                }),
              ]
            : []),
        ],
      }),
    });
    editor.current = view;
    return () => {
      view.destroy();
      editor.current = null;
    };
  }, [language, readOnly, label]);

  useEffect(() => {
    const view = editor.current;
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    const view = editor.current;
    if (!view) return;
    const validLine =
      discussedLine && Math.min(discussedLine, view.state.doc.lines);
    const decorations = validLine
      ? Decoration.set([
          Decoration.line({ class: "cm-discussed-line" }).range(
            view.state.doc.line(validLine).from,
          ),
        ])
      : Decoration.none;
    view.dispatch({
      effects: lineHighlight.current.reconfigure(
        EditorView.decorations.of(decorations),
      ),
    });
    if (validLine)
      view.dispatch({
        effects: EditorView.scrollIntoView(
          view.state.doc.line(validLine).from,
          { y: "nearest" },
        ),
      });
  }, [discussedLine, value]);

  return (
    <div
      className={`highlighted-code ${readOnly ? "read-only-code" : "editable-code"}`}
      ref={host}
    />
  );
}
