import { Fragment } from "react";
import { Tex } from "./Tex";

// Text with inline math between $...$: « Si $\Delta < 0$, pas de racine réelle. »
export function RichText({ children }: { children: string }) {
  const parts = children.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("$") && part.endsWith("$") && part.length > 2 ? (
          <Tex key={i}>{part.slice(1, -1)}</Tex>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
