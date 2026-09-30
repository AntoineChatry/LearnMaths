import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// Colors come from the page tokens, so the editor follows the light/dark theme.
const theme = EditorView.theme({
  "&": { backgroundColor: "var(--paper)", color: "var(--text)", fontSize: "0.95rem", border: "2px solid var(--ink)" },
  ".cm-content": { fontFamily: "ui-monospace, Consolas, monospace", caretColor: "var(--ink)" },
  ".cm-gutters": { backgroundColor: "var(--paper)", color: "var(--text-muted)", border: "none" },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "color-mix(in srgb, var(--highlight) 18%, transparent)" },
  "&.cm-focused": { outline: "3px solid var(--ink)", outlineOffset: "3px" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "color-mix(in srgb, var(--ink) 25%, transparent)" },
});

// Syntax colors from the page tokens too: the default style is made for a light background only.
const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.definitionKeyword, tags.operatorKeyword], color: "var(--margin)", fontWeight: "600" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--ink)" },
  { tag: [tags.string], color: "var(--ink-soft)" },
  { tag: [tags.comment], color: "var(--text-muted)", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "var(--ink)" },
  { tag: [tags.definition(tags.variableName), tags.definition(tags.function(tags.variableName))], color: "var(--text)", fontWeight: "600" },
]);

type Props ={ value: string; onChange: (code: string) => void; onRun: () => void };

export function CodeEditor({ value, onChange, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  // Latest callbacks, read by the editor's listeners without rebuilding it.
  const cb = useRef({ onChange, onRun });
  cb.current = { onChange, onRun };

  useEffect(() => {
    view.current = new EditorView({
      doc: value,
      parent: host.current!,
      extensions: [
        basicSetup,
        python(),
        theme,
        syntaxHighlighting(highlight),
        keymap.of([{ key: "Mod-Enter", run: () => (cb.current.onRun(), true) }, indentWithTab]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) cb.current.onChange(u.state.doc.toString());
        }),
      ],
    });
    return () => view.current?.destroy();
    // The editor is created once; external resets go through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);

  return <div ref={host} className="code-editor" />;
}
