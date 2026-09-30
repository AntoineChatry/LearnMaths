import { useEffect, useRef } from "react";
import { MathfieldElement } from "mathlive";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": DetailedHTMLProps<HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}

MathfieldElement.soundsDirectory = null;

type Props = {
  value: string;
  onChange: (latex: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  label: string;
};

export function MathInput({ value, onChange, onSubmit, disabled = false, label }: Props) {
  const ref = useRef<MathfieldElement>(null);

  useEffect(() => {
    const mf = ref.current;
    if (!mf) return;
    if (mf.value !== value) mf.value = value;
  }, [value]);

  useEffect(() => {
    const mf = ref.current;
    if (!mf) return;
    mf.readOnly = disabled;
    // Don't focus an off-screen field: the browser would scroll down to it (end of the chapter).
    const r = mf.getBoundingClientRect();
    const visible = r.top >= 0 && r.bottom <= window.innerHeight;
    if (!disabled && visible) mf.focus();
  }, [disabled]);

  useEffect(() => {
    const mf = ref.current;
    if (!mf) return;
    const handleInput = (e: Event) => {
      const ev = e as InputEvent;
      if (ev.inputType === "insertLineBreak") {
        onSubmit();
        return;
      }
      onChange(mf.value);
    };
    mf.addEventListener("input", handleInput);
    return () => mf.removeEventListener("input", handleInput);
  }, [onChange, onSubmit]);

  return <math-field ref={ref} aria-label={label} className="math-input" />;
}
