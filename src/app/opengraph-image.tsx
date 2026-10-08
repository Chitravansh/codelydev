import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { lockup, markPaths, wordPaths } from "@/lib/logo-paths";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #071b2e 0%, #0b2340 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(12,192,223,0.45) 0%, rgba(12,192,223,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg
            width={646}
            height={96}
            viewBox={lockup.viewBox}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform={lockup.markTransform}>
              <path d={markPaths.braces} fill="#0cc0df" fillRule="evenodd" />
              <path d={markPaths.slash} fill="#ffffff" fillRule="evenodd" />
            </g>
            <g transform={lockup.wordTransform}>
              <path d={wordPaths.white} fill="#ffffff" fillRule="evenodd" />
              <path d={wordPaths.cyan} fill="#0cc0df" fillRule="evenodd" />
            </g>
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            <span>Practical engineering writing,</span>
            <span style={{ color: "#0cc0df" }}>minus the noise.</span>
          </div>
          <div style={{ fontSize: 30, color: "#94aac1", maxWidth: 860 }}>
            {`${site.tagline} — articles, eBooks and PDFs for developers who ship.`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#94aac1",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#00c4cc",
            }}
          />
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
