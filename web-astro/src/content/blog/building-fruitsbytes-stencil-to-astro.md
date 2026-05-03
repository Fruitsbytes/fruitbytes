---
title: "Building FruitsBytes: From StencilJS Web Components to an Astro DevTools Clone"
description: "I built my portfolio as a Chrome DevTools clone in StencilJS, then migrated it to Astro a year later. Here's what I'd tell my past self about both choices."
author: "Jeffrey Nicholson Carré"
date: 2025-12-01
category: "Web Development"
tags: ["StencilJS", "Astro", "Web Components", "Three.js", "Portfolio"]
image: "/assets/images/blog/default.jpg"
readTime: 9
excerpt: "I built my portfolio as a Chrome DevTools clone in StencilJS — Web Components for the chrome, Three.js for a fruit-tree physics scene. Then I migrated it to Astro. Here's what I'd tell my past self about both."
language: "en"
---

# Building FruitsBytes: From StencilJS Web Components to an Astro DevTools Clone

This site is a Chrome DevTools clone. Right panel with tabs, drag-to-resize, light and dark theme matched against the real DevTools palette, an Elements pane on the welcome page that renders me as a `<jeffrey-carre>` custom element you can inspect.

The first version shipped on **StencilJS** in 2024. The version you're reading shipped on **Astro** a year later. Two technologies most developers have heard of and few have built portfolios with. Here's what I'd tell my past self about each.

## Why StencilJS made sense at the time

I started this site to do three things at once:

1. Have a portfolio.
2. Learn Web Components in production.
3. Build something that could ship a 3D fruit-tree physics scene without making the bundle ridiculous.

StencilJS is Ionic's compiler-based framework for generating standard Web Components. You write JSX with `@Component` decorators, it spits out custom elements that work in any framework or in plain HTML.

The pitch:

- Lazy-loaded by default. Each component is its own chunk.
- Native Web Components, no runtime framework.
- Shadow DOM, scoped styles, no CSS leaks.
- TypeScript-first.

For a portfolio with a 3D scene that I wanted users to opt into, lazy loading was essential. The 3D scene uses `enable3d` (Three.js + Ammo.js physics) which is roughly 1.5 MB minified. Stencil's default lazy loading kept that out of the welcome path; the scene only loaded after first paint when the user was visibly engaged.

What I built:

- A 358-line `right-panel` component that's the DevTools clone — adaptive menu crunching, console log viewer with HTML message support, drag-to-resize between 234px and 800px, mobile drawer with three states and touch gestures.
- A `gui-welcome` page with a 10-column tools-grid wave animation driven by RxJS interval/repeat, scroll-synced bio text, and a button that played a sound and emitted a console log entry.
- A `background-activity` Three.js scene with falling fruits, ground plane physics, and a tree.
- 29 components total, ~8,200 lines of TypeScript/TSX.

It worked. It still works. I had it deployed on Bluehost shared hosting and uploaded a `www/` folder by FTP whenever I shipped.

## Where StencilJS hit its limits

Web Components are great for libraries. They're awkward for full applications.

Specifically:

**Shadow DOM is a one-way commitment.** I scoped my CSS perfectly. I also couldn't easily theme the components from outside. Switching to a light DevTools palette would have required CSS custom properties piped through every component, which I half-implemented and never finished.

**StencilJS's ecosystem is small.** Markdown blog post rendering meant pulling in `marked` myself, plus a service to manage post metadata. Astro Content Collections do this with a schema and a glob. I lost about three weekends to tooling.

**Bundle size of "shipping nothing" is more than I want.** The Stencil runtime is small but non-zero, and every page paid the cost. For a content-heavy portfolio, "no JS by default" is the right answer. Stencil can't give me that.

**Distribution wasn't actually a thing I needed.** Stencil's superpower is shipping a component library that works in any framework. I was building a single application that ran in one place. Paying for framework-agnosticism I'd never use.

By late 2024 I was making excuses. I migrated.

## Why Astro

Astro inverts the assumption: zero JS by default, opt into JavaScript per island.

- Markdown blog posts are first-class. Drop a `.md` file in `src/content/blog/`. Schema defined in TypeScript. Validates at build.
- Image optimization, sitemap, RSS — built-in or one config flag away.
- View Transitions API integration, persistent islands across navigations. The right panel persists state (resize width, console logs, theme) between page changes, no global store required.
- Multiple frameworks per island. The shell is Solid because I wanted fine-grained reactivity for the panel resize and console viewer; the contact form would be just as fine in vanilla JS. Astro doesn't care.

The migration wasn't quick — about 2 long Claude Code sessions, plus a few evenings of polish — but it was directional. Each refactor made the bundle smaller, the dev cycle faster, and the code clearer.

Some specifics:

**Build time:** Stencil 4 production build was ~50 seconds. Astro build is ~4 seconds.

**Bundle:** the Astro `/welcome` page ships ~30 KB of JS for the right panel island. The Stencil version was ~180 KB to start, growing as components lazy-loaded.

**Code volume:** the right panel went from 625 lines of Stencil to about 300 of Solid. I dropped the framework-agnostic ceremony and kept the actual logic.

## What I'd tell my past self

**1. Don't choose tech to learn it. Choose tech because it fits.**
StencilJS taught me a lot about Web Components. I don't regret the learning. I regret choosing a tool whose strengths I didn't actually need.

**2. Picking the smallest tool that fits is almost always right.**
Astro for content-driven sites. Lit if you genuinely need framework-agnostic Web Components. React/Solid/Svelte for app-shaped things. StencilJS for component libraries you ship to other teams. Use the right size of hammer.

**3. Migration is cheaper than you think when AI is in the loop.**
The actual code change to move 8,200 lines of Stencil to Astro+Solid took less than a workweek. Without an agent it would have been months and I'd have given up. Adjust your tooling-cost intuitions accordingly.

**4. The signature feature should drive the tech choice.**
The DevTools clone is the signature of this site. It has to feel exact. Astro plus Solid let me match the chrome to the pixel — variable-driven theming, container queries for the panel-aware responsive layout, View Transitions for the persistent panel. The original Stencil version was close. The Astro version is the one I'm proud of.

## What's still on Stencil

A backup branch (`backup/stencil-final`) and a tag (`pre-astro-migration`). I keep them because they shipped a real working site for a year, and because the StencilJS team built something genuinely good — for the right use case. Mine just wasn't it.

If you're choosing a stack for a content-heavy site with interactive moments, start with Astro. If you're shipping components to dozens of consuming apps in different frameworks, look at Stencil or Lit.

I migrated because the second version is the one that finally feels like me.
