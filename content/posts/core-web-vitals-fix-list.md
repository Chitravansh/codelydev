---
title: "Core Web Vitals: the 20-minute fix list"
excerpt: "You do not need a rewrite to move LCP under 2.5s. These six changes account for most of the wins we see."
date: 2026-08-30
tags: [Performance, Web, Frontend]
author: CodelyDev Team
cover: ocean
featured: true
---

Performance work has a reputation for being endless. In practice, the first twenty minutes of a focused audit usually recover more than a month of micro-optimisation.

## 1. Find the real LCP element

Open DevTools, select the largest contentful paint element, and check what it is. In most marketing sites it is a hero image. In most dashboards it is a heading that was blocked by a synchronous script.

You cannot fix what you have not identified, and guessing is expensive.

## 2. Stop hiding your hero image

The classic failure looks like this:

```html
<!-- Loads late, after the CSS and the layout settle -->
<img src="/hero.jpg" alt="" />
```

Give the browser the signal it needs:

```html
<link rel="preload" as="image" href="/hero.jpg" />
<img src="/hero.jpg" alt="" fetchpriority="high" width="1600" height="900" />
```

Two lines, frequently a 40% reduction in LCP.

## 3. Size every image before it loads

Cumulative Layout Shift is almost always an image or an embed without dimensions. Reserve the box:

```html
<img src="/chart.png" width="800" height="450" alt="Quarterly revenue" />
```

If the final size is unknown, set an `aspect-ratio` on the wrapper. The point is that the space is claimed before the bytes arrive.

## 4. Ship less JavaScript

The cheapest byte is the one you never requested. Sort your bundle by cost:

- Analytics and chat widgets loaded on every route
- Icon packs where one inline SVG would do
- Date libraries for a single `toLocaleDateString` call
- Components imported eagerly but used behind a modal

Defer everything that is not needed for first paint, and code-split the rest by route.

## 5. Fix the font waterfall

Web fonts cause both a flash of unstyled text and a layout shift. Two settings fix most of it:

```css
font-display: swap;
```

```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
```

Then subset aggressively. A 90KB font for 40 Latin characters is a choice, not a requirement.

## 6. Measure on a throttled connection

Your laptop on fibre is not your user's phone on a train. Use the "Slow 4G" preset, disable the cache, and reload. If the site feels broken under throttling, it *is* broken for a large share of real traffic.

## Then, and only then, reach for the hard stuff

Rendering strategies, edge caching and hydration budgets all matter — but they build on top of these basics. Get the checklist clean first, re-measure, and you will usually find the budget is already met.

> Performance is not a phase at the end of the project. It is a habit of not wasting the user's time.
