"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientOnly>
        <Navbar />
      </ClientOnly>

      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="w-[300px] sm:w-[400px]">
            <Image
              src="/codelydev_light.svg"
              alt="CodelyDev logo"
              width={340}
              height={100}
              className="dark:hidden w-full h-auto"
              priority
            />
            <Image
              src="/codelydev_dark.svg"
              alt="CodelyDev logo"
              width={340}
              height={100}
              className="hidden dark:block w-full h-auto"
              priority
            />
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Coming Soon
          </h1>

          <p className="max-w-md text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We&apos;re working on something amazing. Stay tuned for the launch of{" "}
            <span className="text-violet-600 dark:text-violet-400 font-medium">CodelyDev</span>.
          </p>

          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Under active development
          </div>
        </div>
      </main>
    </div>
  );
}
