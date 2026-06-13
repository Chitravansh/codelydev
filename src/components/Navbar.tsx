"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/favicon.svg"
            alt="CodelyDev"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
            codely<span className="font-bold text-blue-600 dark:text-blue-400">dev</span>
          </span>
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="relative h-9 w-[72px] rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-sm transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="absolute inset-0 flex items-center justify-between px-2">
            <svg
              className={`h-4 w-4 transition-colors duration-300 ${
                theme === "light" ? "text-amber-500" : "text-zinc-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              className={`h-4 w-4 transition-colors duration-300 ${
                theme === "dark" ? "text-blue-400" : "text-zinc-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </span>
          <span
            className={`absolute top-0.5 left-0.5 h-8 w-8 rounded-full bg-white dark:bg-zinc-600 shadow-md transition-transform duration-300 ease-in-out ${
              theme === "dark" ? "translate-x-[33px]" : "translate-x-0"
            }`}
          />
        </button>
      </nav>
    </header>
  );
}
