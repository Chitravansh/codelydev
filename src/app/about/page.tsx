import type { Metadata } from "next";
import Link from "next/link";
import { Newsletter } from "@/components/Newsletter";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "CodelyDev publishes practical engineering writing and downloadable resources for developers who ship.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Practical over theoretical",
    body: "Every article contains something you can apply in the next hour — a snippet, a checklist, a decision you can reuse.",
  },
  {
    title: "Trade-offs, not prescriptions",
    body: "There is no single right architecture. We describe what each option costs so you can choose deliberately.",
  },
  {
    title: "Free to read, priced to sustain",
    body: "The blog stays open. eBooks and PDFs fund the time it takes to write the free material properly.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
      <header className="max-w-3xl">
        <span className="pill">About</span>
        <h1 className="display mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          We write for people who
          <br />
          <span className="gradient-text">have to ship on Friday.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {site.name} started as a folder of internal notes. It is now a blog
          and a small shop of downloadable resources, built around a simple
          belief: developers deserve writing that respects their time.
        </p>
      </header>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {principles.map((principle) => (
          <div key={principle.title} className="card p-6">
            <div className="h-1 w-10 rounded-full brand-gradient" />
            <h2 className="display mt-4 text-lg font-semibold text-foreground">
              {principle.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {principle.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="What we publish"
            title="Two things, done properly"
          />
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="display text-lg font-semibold text-foreground">
                The blog
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Deep dives on React, Next.js, TypeScript, performance and the
                engineering decisions behind shipping real products.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
              >
                Browse articles →
              </Link>
            </div>
            <div className="card p-6">
              <h3 className="display text-lg font-semibold text-foreground">
                The shop
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                eBooks, printable checklists and cheatsheets — instant download,
                lifetime updates, no subscription.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
              >
                Browse products →
              </Link>
            </div>
          </div>
        </div>

        <div id="contact" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Contact"
            title="Say hello"
            description="Pitch an article, ask about licensing for your team, or tell us what you want us to write next."
          />
          <div className="card p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-between gap-4">
                <span className="text-muted">Email</span>
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-brand hover:underline"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-center justify-between gap-4">
                <span className="text-muted">GitHub</span>
                <a
                  href={site.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand hover:underline"
                >
                  {site.name}
                </a>
              </li>
              <li className="flex items-center justify-between gap-4">
                <span className="text-muted">X</span>
                <a
                  href={site.social.x}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand hover:underline"
                >
                  @{site.name}
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <Newsletter />
          </div>
        </div>
      </section>
    </div>
  );
}
