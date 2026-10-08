import { CoverKey } from "./markdown";

export type ProductType = "ebook" | "pdf" | "bundle";

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  type: ProductType;
  price: number;
  compareAt?: number;
  currency: string;
  pages: number;
  formats: string[];
  includes: string[];
  description: string;
  bullets: string[];
  cover: CoverKey;
  file: string;
  featured: boolean;
  updated: string;
}

/**
 * Digital product catalogue — ebooks, PDFs and bundles.
 * `file` points at a public/downloadable asset delivered after checkout.
 */
export const products: Product[] = [
  {
    id: "react-next-handbook",
    slug: "modern-react-nextjs-handbook",
    title: "The Modern React & Next.js Handbook",
    tagline: "Everything you need to ship production apps with the App Router.",
    type: "ebook",
    price: 29,
    compareAt: 39,
    currency: "USD",
    pages: 248,
    formats: ["PDF", "EPUB", "MOBI"],
    includes: ["Lifetime updates", "Source repository", "Cheat sheet pack"],
    description:
      "A no-fluff, 248-page field guide to building fast, accessible and maintainable applications with React 19 and the Next.js App Router. Written for developers who already know the basics and want to move to the next level.",
    bullets: [
      "Server components, streaming and caching explained with real patterns",
      "Data fetching, mutations and revalidation without the confusion",
      "Routing, layouts and metadata that scale to dozens of routes",
      "Performance budgets, Core Web Vitals and image optimisation",
      "Testing, linting and CI setups you can copy into any project",
    ],
    cover: "cyan",
    file: "/downloads/modern-react-nextjs-handbook.pdf",
    featured: true,
    updated: "2026-09-18",
  },
  {
    id: "devops-playbook",
    slug: "ship-faster-devops-playbook",
    title: "Ship Faster: The Practical DevOps Playbook",
    tagline: "CI/CD, containers and observability for small teams.",
    type: "ebook",
    price: 24,
    compareAt: 32,
    currency: "USD",
    pages: 196,
    formats: ["PDF", "EPUB"],
    includes: ["Pipeline templates", "Lifetime updates"],
    description:
      "Deploy with confidence. This playbook walks through building a delivery pipeline, containerising services and instrumenting them so you actually know what is happening in production.",
    bullets: [
      "GitHub Actions pipelines that run in under three minutes",
      "Docker multi-stage builds and image hardening",
      "Zero-downtime deploys and safe rollbacks",
      "Logs, metrics and traces without a platform team",
      "Cost control for cloud-native projects",
    ],
    cover: "teal",
    file: "/downloads/ship-faster-devops-playbook.pdf",
    featured: true,
    updated: "2026-08-04",
  },
  {
    id: "frontend-perf-checklist",
    slug: "frontend-performance-checklist-2026",
    title: "Frontend Performance Checklist 2026",
    tagline: "96 actionable checks to get your site under 2s.",
    type: "pdf",
    price: 9,
    currency: "USD",
    pages: 42,
    formats: ["PDF"],
    includes: ["Printable", "Audit worksheet"],
    description:
      "A dense, printable checklist covering rendering, loading, images, fonts, JavaScript and delivery. Work through it top to bottom on any project and measure the difference.",
    bullets: [
      "96 checks grouped by impact and effort",
      "Lighthouse and RUM targets for each metric",
      "Copy-paste snippets for common fixes",
    ],
    cover: "ocean",
    file: "/downloads/frontend-performance-checklist-2026.pdf",
    featured: false,
    updated: "2026-07-21",
  },
  {
    id: "system-design-cheatsheets",
    slug: "system-design-interview-cheatsheets",
    title: "System Design Interview Cheatsheets",
    tagline: "22 one-page diagrams for the questions that keep coming up.",
    type: "pdf",
    price: 12,
    currency: "USD",
    pages: 30,
    formats: ["PDF"],
    includes: ["22 diagrams", "Printable A4"],
    description:
      "Load balancers, queues, caches, rate limiting, sharding and more — each on a single page with the trade-offs you are expected to talk through in an interview.",
    bullets: [
      "22 canonical architectures with decision notes",
      "Capacity estimation formulas on page one",
      "Follow-up questions and what interviewers listen for",
    ],
    cover: "glacier",
    file: "/downloads/system-design-interview-cheatsheets.pdf",
    featured: false,
    updated: "2026-06-30",
  },
  {
    id: "git-mastery",
    slug: "git-branching-in-practice",
    title: "Git Branching Strategies in Practice",
    tagline: "Trunk-based, GitFlow and everything between.",
    type: "pdf",
    price: 7,
    currency: "USD",
    pages: 36,
    formats: ["PDF"],
    includes: ["Command reference", "Team adoption plan"],
    description:
      "Pick a branching model, roll it out to your team and keep main releasable. Includes the exact commands, hooks and review conventions that make it stick.",
    bullets: [
      "When trunk-based wins and when it does not",
      "Release branches, hotfixes and version tagging",
      "Rebase vs merge with a decision table",
    ],
    cover: "navy",
    file: "/downloads/git-branching-in-practice.pdf",
    featured: false,
    updated: "2026-05-12",
  },
  {
    id: "fullstack-bundle",
    slug: "fullstack-starter-bundle",
    title: "The Full-Stack Starter Bundle",
    tagline: "Handbook + 2 PDF resources, one download.",
    type: "bundle",
    price: 39,
    compareAt: 50,
    currency: "USD",
    pages: 486,
    formats: ["PDF", "EPUB"],
    includes: [
      "Modern React & Next.js Handbook",
      "Frontend Performance Checklist",
      "System Design Cheatsheets",
      "Lifetime updates",
    ],
    description:
      "Everything a full-stack developer needs on day one: the framework handbook, the performance checklist and the system design cheatsheets, bundled at a lower price than buying them separately.",
    bullets: [
      "486 pages across three resources",
      "All future updates included",
      "Best value for teams of 2–5",
    ],
    cover: "mint",
    file: "/downloads/fullstack-starter-bundle.pdf",
    featured: true,
    updated: "2026-09-25",
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 3): Product[] {
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProduct(slug);
  if (!current) return products.slice(0, limit);

  return products
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore = a.type === current.type ? 1 : 0;
      const bScore = b.type === current.type ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export const productTypes: { value: ProductType | "all"; label: string }[] = [
  { value: "all", label: "All products" },
  { value: "ebook", label: "eBooks" },
  { value: "pdf", label: "PDFs" },
  { value: "bundle", label: "Bundles" },
];
