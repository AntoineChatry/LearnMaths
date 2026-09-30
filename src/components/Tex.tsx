import katex from "katex";
import { useMemo } from "react";

type Props = { children: string; block?: boolean };

export function Tex({ children, block = false }: Props) {
  const html = useMemo(
    () => katex.renderToString(children, { displayMode: block, throwOnError: false }),
    [children, block],
  );
  const Tag = block ? "div" : "span";
  return <Tag className={block ? "tex-block" : "tex"} dangerouslySetInnerHTML={{ __html: html }} />;
}
