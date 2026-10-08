---
title: "Five TypeScript patterns that catch bugs before they ship"
excerpt: "Types are cheapest when they describe what your code is allowed to do — not just what shape the data has."
date: 2026-07-19
tags: [TypeScript, JavaScript, DX]
author: CodelyDev Team
cover: navy
featured: false
---

Most teams use TypeScript as a fancier form of documentation: interfaces describe the shape of objects, and that is it. That is useful, but it leaves most of the compiler's power on the table.

Here are five patterns that turn data-shape types into actual guarantees.

## 1. Make invalid states unrepresentable

Instead of optional fields that can contradict each other, encode the states as a union:

```ts
type Checkout =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "success"; orderId: string }
  | { status: "error"; message: string }
```

Now `if (order.orderId)` on a failed checkout is a compile error, not a runtime surprise at 2am.

## 2. Type the environment once, at the edge

`process.env.FOO` is `string | undefined` forever unless you narrow it. Do it in one module and never touch the raw object again:

```ts
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export const config = {
  stripeKey: requireEnv("STRIPE_SECRET_KEY"),
  databaseUrl: requireEnv("DATABASE_URL"),
} as const
```

Failures now happen at boot with a clear message instead of deep inside a request.

## 3. Never return `null` from a lookup you control

Non-null assertions (`!`) push a problem from now to never. Prefer throwing or returning a discriminated result:

```ts
function findPost(slug: string): Post {
  const post = posts.find((p) => p.slug === slug)
  if (!post) throw new NotFoundError(`No post for ${slug}`)
  return post
}
```

Callers get a real `Post`, and the failure path has one owner.

## 4. Prefer `satisfies` when you are only checking

`as` silences the compiler. `satisfies` checks and keeps the literal type:

```ts
const routes = {
  "/": "home",
  "/blog": "post list",
} as const satisfies Record<string, string>
```

Typo a key, misspell a value type, or forget a route — the compiler tells you without erasing anything.

## 5. Type your API responses where they are consumed

Generated OpenAPI clients are ideal. If you do not have one, at minimum define the response type next to the fetch:

```ts
async function getPost(slug: string): Promise<PostResponse> {
  const res = await fetch(`/api/posts/${slug}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<PostResponse>
}
```

Better still: validate with a schema at that boundary. The type inside your app is then trustworthy by construction.

## The common thread

Each pattern does the same thing: it makes the illegal case *fail to compile* instead of failing at runtime. That is the trade TypeScript is actually offering — take it.
