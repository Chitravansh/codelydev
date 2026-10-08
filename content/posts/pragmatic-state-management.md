---
title: "A pragmatic approach to application state in 2026"
excerpt: "Most apps need far less global state than you think. A short decision tree for picking the right tool."
date: 2026-09-14
tags: [React, Architecture, JavaScript]
author: CodelyDev Team
cover: teal
featured: true
---

State management is one of those topics where the community generates a new library every year and the average application needs fewer libraries every year. Both trends are real.

## Start with the boring answer

Before reaching for a store, ask three questions in order:

1. **Can this live in the URL?** Filters, tabs, pagination, search queries and selected records all belong in search params. The URL is shareable, bookmarkable and free.
2. **Can this live where it is used?** Local `useState` and `useReducer` are not a stepping stone to something better. They *are* something better for 80% of cases.
3. **Can this live in the server?** A record fetched from your API is server state. Treating it as client state is how you end up writing cache invalidation by hand.

Only when all three fail do you need shared client state.

## A decision tree that actually helps

```text
Is the value derived from a server response?
├── yes → server cache (query library, or a Server Component)
└── no  → Is it needed in more than one distant branch?
          ├── yes → shared client store
          └── no  → local state or the URL
```

## What shared state is genuinely for

Cross-cutting concerns that no single component owns:

- Auth session and current user
- Theme and locale preferences
- A shopping cart before checkout
- Real-time notifications

Notice what is *not* on that list: form values, modal visibility, table sort order, and anything fetched from an endpoint.

## Keep the store dumb

When you do need a store, resist the urge to make it clever. The most durable stores I have worked with hold primitives and expose small actions:

```ts
const useCart = create<CartState>((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}))
```

Selectors, persistence and devtools are easy to add later. Business logic smuggled into a reducer is hard to remove.

## The test of a good choice

Six months from now a new developer should be able to open your app and answer two questions quickly: *where does this value live?* and *what changes it?* If the answer is "it depends, check three files", the state has leaked.

> Aim for state you can point at, not state you have to trace.
