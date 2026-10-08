import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function esc(s) {
  return s.replace(/([()\\])/g, "\\$&");
}

function pdf(title, lines) {
  let text = "BT /F1 22 Tf 72 720 Td (" + esc(title) + ") Tj ET\n";
  let y = 680;
  for (const l of lines) {
    text += "BT /F1 11 Tf 72 " + y + " Td (" + esc(l) + ") Tj ET\n";
    y -= 20;
  }
  const objs = [];
  objs[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objs[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
  objs[3] =
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>";
  objs[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objs[5] = "<< /Length " + text.length + " >>\nstream\n" + text + "endstream";

  let out = "%PDF-1.4\n";
  const offsets = [];
  for (let i = 1; i <= 5; i++) {
    offsets[i] = out.length;
    out += i + " 0 obj\n" + objs[i] + "\nendobj\n";
  }
  const xref = out.length;
  out += "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i++) {
    out += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  out += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF";
  return out;
}

const items = {
  "modern-react-nextjs-handbook.pdf": [
    "The Modern React and Next.js Handbook",
    "CodelyDev - Code. Learn. Build.",
    "",
    "Placeholder sample of the delivered ebook.",
    "Replace public/downloads/*.pdf with your real files.",
    "",
    "248 pages | PDF, EPUB, MOBI",
  ],
  "ship-faster-devops-playbook.pdf": [
    "Ship Faster: The Practical DevOps Playbook",
    "CodelyDev",
    "",
    "Placeholder file. Swap in the real deliverable.",
    "196 pages | PDF, EPUB",
  ],
  "frontend-performance-checklist-2026.pdf": [
    "Frontend Performance Checklist 2026",
    "CodelyDev",
    "",
    "Placeholder file. Swap in the real deliverable.",
    "42 pages | PDF",
  ],
  "system-design-interview-cheatsheets.pdf": [
    "System Design Interview Cheatsheets",
    "CodelyDev",
    "",
    "Placeholder file. Swap in the real deliverable.",
    "30 pages | PDF",
  ],
  "git-branching-in-practice.pdf": [
    "Git Branching Strategies in Practice",
    "CodelyDev",
    "",
    "Placeholder file. Swap in the real deliverable.",
    "36 pages | PDF",
  ],
  "fullstack-starter-bundle.pdf": [
    "The Full-Stack Starter Bundle",
    "CodelyDev",
    "",
    "Placeholder file. Swap in the real deliverable.",
    "486 pages | PDF, EPUB",
  ],
};

for (const [file, lines] of Object.entries(items)) {
  fs.writeFileSync(
    path.join(root, "public", "downloads", file),
    pdf(lines[0], lines.slice(1))
  );
  console.log("wrote", file);
}
