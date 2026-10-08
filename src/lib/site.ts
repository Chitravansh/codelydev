export const site = {
  name: "codelydev",
  tagline: "Code. Learn. Build.",
  description:
    "Practical engineering essays, deep-dive tutorials and downloadable resources that help developers ship better software, faster.",
  url: "https://codelydev.com",
  email: "hello@codelydev.com",
  author: "CodelyDev Team",
  social: {
    github: "https://github.com/codelydev",
    x: "https://x.com/codelydev",
    linkedin: "https://linkedin.com/company/codelydev",
    youtube: "https://youtube.com/@codelydev",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
] as const;
