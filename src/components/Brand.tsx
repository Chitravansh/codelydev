import { site } from "@/lib/site";
import {
  lockup,
  markBox,
  markPaths,
  wordBox,
  wordPaths,
} from "@/lib/logo-paths";

const pad = Math.round(Math.max(markBox.w, markBox.h) * 0.06);

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox={`${markBox.x - pad} ${markBox.y - pad} ${markBox.w + pad * 2} ${
        markBox.h + pad * 2
      }`}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label={`${site.name} mark`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={markPaths.braces} fill="var(--brand)" fillRule="evenodd" />
      <path d={markPaths.slash} fill="var(--foreground)" fillRule="evenodd" />
    </svg>
  );
}

export function Wordmark({
  className = "h-8",
  mark = false,
}: {
  className?: string;
  mark?: boolean;
}) {
  return (
    <svg
      viewBox={
        mark
          ? lockup.viewBox
          : `${wordBox.x} ${wordBox.y} ${wordBox.w} ${wordBox.h}`
      }
      className={`w-auto shrink-0 ${className}`}
      role="img"
      aria-label={site.name}
      xmlns="http://www.w3.org/2000/svg"
    >
      {mark ? (
        <g transform={lockup.markTransform}>
          <path d={markPaths.braces} fill="var(--brand)" fillRule="evenodd" />
          <path d={markPaths.slash} fill="var(--foreground)" fillRule="evenodd" />
        </g>
      ) : null}
      <g
        transform={
          mark ? lockup.wordTransform : `translate(${-wordBox.x} ${-wordBox.y})`
        }
      >
        <path d={wordPaths.white} fill="var(--foreground)" fillRule="evenodd" />
        <path d={wordPaths.cyan} fill="var(--brand)" fillRule="evenodd" />
      </g>
    </svg>
  );
}
