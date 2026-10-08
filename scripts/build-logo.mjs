// Regenerates every CodelyDev logo asset from the canonical vector reference:
//   public/Codelydev_logo.svg  (2000x2000, navy bg, cyan + white paths)
//
// Outputs:
//   public/codelydev_mark.svg          mark only, transparent, dark colours
//   public/codelydev_icon.svg          mark on navy rounded square
//   public/favicon.svg                 mark on navy rounded square (favicon)
//   public/codelydev_dark.svg          full stacked logo (reference, dark)
//   public/codelydev_light.svg         full stacked logo, light-theme colours
//   public/codelydev_lockup.svg        horizontal lockup, dark colours, transparent
//   public/codelydev_lockup_light.svg  horizontal lockup, light colours, transparent
//   src/lib/logo-paths.ts              path data + transforms for inline React SVGs
//
// Run: node scripts/build-logo.mjs

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const refPath = path.join(root, "public", "Codelydev_logo.svg");
const ref = fs.readFileSync(refPath, "utf8");

const cyanMatch = ref.match(/<path d="([^"]+)" fill="#0CC0DF"/);
const whiteMatch = ref.match(/<path d="([^"]+)" fill="#FFFFFF"/);
if (!cyanMatch || !whiteMatch) {
  throw new Error("Could not extract cyan/white paths from Codelydev_logo.svg");
}
const cyanD = cyanMatch[1];
const whiteD = whiteMatch[1];

for (const d of [cyanD, whiteD]) {
  const commands = d.replace(/[\d\s,.-]+/g, "");
  if (/[^MLZ]/.test(commands)) {
    throw new Error(
      `Unexpected path commands (only M/L/Z supported): ${[...new Set(commands)].join(" ")}`
    );
  }
}

const split = (d) =>
  d
    .split(/(?=M )/)
    .map((s) => s.trim())
    .filter(Boolean);

const points = (sp) => {
  const out = [];
  const re = /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(sp))) out.push([Number(m[1]), Number(m[2])]);
  return out;
};

const boxOf = (sp) => {
  const pts = points(sp);
  if (pts.length === 0) throw new Error("Subpath has no points");
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y, maxY: Math.max(...ys) };
};

const withBoxes = (d) => split(d).map((sp) => ({ sp, box: boxOf(sp) }));

const cyanSubs = withBoxes(cyanD);
const whiteSubs = withBoxes(whiteD);

// Mark geometry sits above y=1200; every wordmark letter (including
// ascenders at y=1350 and descenders at y=1588) sits below it.
const isMark = (box) => box.maxY < 1200;

const markCyan = cyanSubs.filter((s) => isMark(s.box));
const wordCyan = cyanSubs.filter((s) => !isMark(s.box));
const markWhite = whiteSubs.filter((s) => isMark(s.box));
const wordWhite = whiteSubs.filter((s) => !isMark(s.box));

if (markCyan.length !== 2 || markWhite.length !== 1) {
  throw new Error(
    `Mark split mismatch: expected 2 cyan braces + 1 white slash, got ${markCyan.length}/${markWhite.length}`
  );
}
if (wordCyan.length !== 7 || wordWhite.length !== 7) {
  throw new Error(
    `Wordmark split mismatch: expected 7 cyan + 7 white subpaths, got ${wordCyan.length}/${wordWhite.length}`
  );
}

const union = (items) => {
  const x = Math.min(...items.map((i) => i.box.x));
  const y = Math.min(...items.map((i) => i.box.y));
  const right = Math.max(...items.map((i) => i.box.x + i.box.w));
  const bottom = Math.max(...items.map((i) => i.box.y + i.box.h));
  return { x, y, w: right - x, h: bottom - y };
};

const markBox = union([...markCyan, ...markWhite]);
const wordBox = union([...wordCyan, ...wordWhite]);
const join = (items) => items.map((i) => i.sp).join(" ");

const markBracesD = join(markCyan);
const markSlashD = join(markWhite);
const wordCyanD = join(wordCyan);
const wordWhiteD = join(wordWhite);

const round = (n, p = 3) => Number(n.toFixed(p));

// Horizontal lockup: mark scaled to the wordmark height, word on the right.
const lockupH = wordBox.h;
const markScale = lockupH / markBox.h;
const markW = markBox.w * markScale;
const gap = Math.round(wordBox.h * 0.4);
const lockupW = markW + gap + wordBox.w;
const markTransform = `translate(${round(-markBox.x * markScale)} ${round(
  -markBox.y * markScale
)}) scale(${round(markScale, 5)})`;
const wordTransform = `translate(${round(markW + gap - wordBox.x)} ${round(-wordBox.y)})`;
const lockupViewBox = `0 0 ${round(lockupW)} ${round(lockupH)}`;

const svgHeader = (viewBox, title, width, height) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" role="img">\n  <title>${title}</title>\n`;

const write = (name, content) => {
  fs.writeFileSync(path.join(root, "public", name), content, "utf8");
  console.log("wrote public/" + name);
};

// --- mark, transparent, dark colours ---------------------------------------
const markPad = Math.round(Math.max(markBox.w, markBox.h) * 0.06);
const markViewBox = `${round(markBox.x - markPad)} ${round(markBox.y - markPad)} ${round(
  markBox.w + markPad * 2
)} ${round(markBox.h + markPad * 2)}`;
write(
  "codelydev_mark.svg",
  svgHeader(
    markViewBox,
    "CodelyDev mark",
    round(markBox.w + markPad * 2),
    round(markBox.h + markPad * 2)
  ) +
    `  <path d="${markBracesD}" fill="#0CC0DF" fill-rule="evenodd"/>\n` +
    `  <path d="${markSlashD}" fill="#FFFFFF" fill-rule="evenodd"/>\n</svg>\n`
);

// --- navy rounded square + mark (icon / favicon) ---------------------------
const canvas = 1000;
const cx = markBox.x + markBox.w / 2;
const cy = markBox.y + markBox.h / 2;
const square = (title) =>
  svgHeader(
    `${round(cx - canvas / 2)} ${round(cy - canvas / 2)} ${canvas} ${canvas}`,
    title,
    canvas,
    canvas
  ) +
  `  <rect x="${round(cx - canvas / 2)}" y="${round(cy - canvas / 2)}" width="${canvas}" height="${canvas}" rx="220" fill="#071B2E"/>\n` +
  `  <path d="${markBracesD}" fill="#0CC0DF" fill-rule="evenodd"/>\n` +
  `  <path d="${markSlashD}" fill="#FFFFFF" fill-rule="evenodd"/>\n</svg>\n`;
write("codelydev_icon.svg", square("CodelyDev icon"));
write("favicon.svg", square("CodelyDev"));

// --- full stacked logo, dark (canonical reference copy) --------------------
write("codelydev_dark.svg", ref);

// --- full stacked logo, light theme ----------------------------------------
// Light variant: white page, navy letters/slash, darkened cyan for contrast.
const lightSvg =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<svg xmlns="http://www.w3.org/2000/svg"\n     width="2000" height="2000" viewBox="0 0 2000 2000">\n` +
  `  <title>CodelyDev logo (light)</title>\n` +
  `  <desc>Vectorized Codelydev logo, light-theme colours.</desc>\n\n` +
  `  <!-- Background -->\n` +
  `  <rect width="2000" height="2000" fill="#FFFFFF"/>\n\n` +
  `  <!-- Cyan elements -->\n` +
  `  <path d="${cyanD}" fill="#007A93" fill-rule="evenodd"/>\n\n` +
  `  <!-- Dark elements (white in the source logo) -->\n` +
  `  <path d="${whiteD}" fill="#071B2E" fill-rule="evenodd"/>\n</svg>\n`;
write("codelydev_light.svg", lightSvg);

// --- horizontal lockups -----------------------------------------------------
const lockup = (title, slashFill, braceFill, wordWhiteFill, wordCyanFill) =>
  svgHeader(lockupViewBox, title, round(lockupW), round(lockupH)) +
  `  <g transform="${markTransform}">\n` +
  `    <path d="${markBracesD}" fill="${braceFill}" fill-rule="evenodd"/>\n` +
  `    <path d="${markSlashD}" fill="${slashFill}" fill-rule="evenodd"/>\n` +
  `  </g>\n` +
  `  <g transform="${wordTransform}">\n` +
  `    <path d="${wordWhiteD}" fill="${wordWhiteFill}" fill-rule="evenodd"/>\n` +
  `    <path d="${wordCyanD}" fill="${wordCyanFill}" fill-rule="evenodd"/>\n` +
  `  </g>\n</svg>\n`;

write(
  "codelydev_lockup.svg",
  lockup("CodelyDev logo (dark)", "#FFFFFF", "#0CC0DF", "#FFFFFF", "#0CC0DF")
);
write(
  "codelydev_lockup_light.svg",
  lockup("CodelyDev logo (light)", "#071B2E", "#007A93", "#071B2E", "#007A93")
);

// --- TypeScript path data for inline React SVGs ----------------------------
const ts = `// AUTO-GENERATED by scripts/build-logo.mjs — do not edit by hand.
// Source of truth: public/Codelydev_logo.svg

export const markBox = {
  x: ${markBox.x},
  y: ${markBox.y},
  w: ${round(markBox.w)},
  h: ${round(markBox.h)},
} as const;

export const wordBox = {
  x: ${wordBox.x},
  y: ${wordBox.y},
  w: ${round(wordBox.w)},
  h: ${round(wordBox.h)},
} as const;

export const markPaths = {
  braces: ${JSON.stringify(markBracesD)},
  slash: ${JSON.stringify(markSlashD)},
} as const;

export const wordPaths = {
  cyan: ${JSON.stringify(wordCyanD)},
  white: ${JSON.stringify(wordWhiteD)},
} as const;

export const lockup = {
  viewBox: ${JSON.stringify(lockupViewBox)},
  width: ${round(lockupW)},
  height: ${round(lockupH)},
  markTransform: ${JSON.stringify(markTransform)},
  wordTransform: ${JSON.stringify(wordTransform)},
} as const;
`;

fs.writeFileSync(path.join(root, "src", "lib", "logo-paths.ts"), ts, "utf8");
console.log("wrote src/lib/logo-paths.ts");

console.log(
  JSON.stringify(
    { markBox, wordBox, lockup: { viewBox: lockupViewBox, markTransform, wordTransform } },
    null,
    2
  )
);
