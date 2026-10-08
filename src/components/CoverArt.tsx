import Image from "next/image";
import { CoverKey } from "@/lib/markdown";
import { markBox, markPaths } from "@/lib/logo-paths";

const pad = Math.round(Math.max(markBox.w, markBox.h) * 0.06);

const backgrounds: Record<CoverKey, string> = {
  cyan: "linear-gradient(135deg, #0cc0df 0%, #0a5f7a 100%)",
  teal: "linear-gradient(135deg, #00c4cc 0%, #0a5f7a 100%)",
  navy: "linear-gradient(135deg, #102c4d 0%, #05172a 100%)",
  ocean: "linear-gradient(135deg, #0ea5e9 0%, #06233d 100%)",
  glacier: "linear-gradient(135deg, #67e8f9 0%, #0a5f7a 100%)",
  mint: "linear-gradient(135deg, #2dd4bf 0%, #083344 100%)",
};

export function CoverArt({
  cover,
  image,
  label,
  eyebrow,
  className = "",
}: {
  cover: CoverKey;
  image?: string | null;
  label?: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={image ? undefined : { background: backgrounds[cover] }}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
        />
      ) : (
        <svg
          aria-hidden="true"
          viewBox={`${markBox.x - pad} ${markBox.y - pad} ${markBox.w + pad * 2} ${
            markBox.h + pad * 2
          }`}
          className="absolute -bottom-[14%] -right-4 h-[62%] w-auto opacity-[0.16] sm:-right-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={markPaths.braces} fill="#FFFFFF" fillRule="evenodd" />
          <path d={markPaths.slash} fill="#FFFFFF" fillRule="evenodd" />
        </svg>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.28), transparent 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(4,18,32,0.82), rgba(4,18,32,0))",
        }}
      />
      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        {eyebrow ? (
          <span className="w-fit rounded-full bg-black/25 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            {eyebrow}
          </span>
        ) : (
          <span />
        )}

        <div className="min-w-0">
          {label ? (
            <p className="display max-w-[85%] text-lg font-semibold leading-snug text-white drop-shadow-sm sm:text-xl">
              {label}
            </p>
          ) : null}
          <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-white/55">
            codelydev
          </p>
        </div>
      </div>
    </div>
  );
}
