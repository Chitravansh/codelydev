---
title: "Server Components changed how we fetch data — here is the new mental model"
excerpt: "The old pattern of useEffect + loading spinners quietly stopped being the right answer. Here is the model that replaced it."
date: 2026-09-28
tags: [Next.js, React, Architecture]
author: CodelyDev Team
cover: cyan
featured: true
---

For a decade the default React data story looked the same: mount a component, fire a request in `useEffect`, flip a boolean, render a spinner, handle the error, remember to cancel the request on unmount. We all wrote that code. We all wrote it wrong at least once.

Server Components remove the ceremony entirely. The component that needs the data can simply *ask for it* before it renders.

## Fetch where the data lives

The simplest version of the new model is boringly direct:

```tsx
async function PostList() {
  const posts = await db.post.findMany({ orderBy: { date: "desc" } })
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

No effect, no state, no spinner, no cleanup function. The component is a function of its data — which is what React was always trying to be.

### Three rules that keep you out of trouble

1. **Fetch at the point of use, not the top of the tree.** Passing data down through five prop layers recreates the waterfall you were trying to avoid.
2. **Let boundaries do the caching.** Every `layout.tsx` and `page.tsx` is a natural cache boundary. Push shared queries up to the layout and let children read from it.
3. **Not every component deserves to be a Server Component.** Anything with hover state, optimistic UI, or a chart library stays on the client.

## Where client components still belong

The moment a component needs interaction, it opts out with a directive:

```tsx
"use client"

import { useState } from "react"

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  return <button onClick={() => setCount(count + 1)}>♥ {count}</button>
}
```

The trick is that a client component can be rendered *by* a server component. You get the best of both: data resolves on the server, interaction hydrates only where it is needed.

> The mental shift is small but total: components are no longer the unit of shipping JavaScript. Boundaries are.

## The waterfall is still possible

Server Components do not magically fix N+1 queries. If your `Author` component fetches its own posts and the parent also fetches authors, you have rebuilt the waterfall — just on a faster link.

Reach for `Promise.all` when requests are independent, and reach for cache tags when they overlap:

```tsx
const [author, posts] = await Promise.all([
  getAuthor(id),
  getPostsByAuthor(id),
])
```

## What to do next

Audit one page of your app. Count the effects that exist purely to load data. Each one is a candidate for deletion — and deleting code is still the fastest optimisation there is.
