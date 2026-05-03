---
title: "Migrating This Site with Claude Code: An Honest Review"
description: "I'm using Claude Code right now to migrate this portfolio from StencilJS to Astro. Here's what works, what doesn't, and what I learned from putting an AI agent in the driver's seat."
author: "Jeffrey Nicholson Carré"
date: 2024-11-18
category: "AI & ML"
tags: ["AI", "Claude Code", "Developer Tools", "Productivity"]
image: "/assets/images/blog/default.jpg"
readTime: 8
excerpt: "I'm using Claude Code to migrate this very portfolio from StencilJS to Astro. Here's what's surprising me, what isn't, and what I think about putting an AI agent in the driver's seat."
language: "en"
---

# Migrating This Site with Claude Code: An Honest Review

This blog post — and most of the site you're reading it on — was written with Claude Code in the loop. I'm in the middle of migrating FruitsBytes from StencilJS 4 to Astro 6, and instead of doing it alone in 6 weekends, I'm doing it with an agent across 2 long sessions.

This is not a "AI replaces developers" piece. It's not an "AI is a hype cycle" piece either. It's what I've actually noticed.

## What Claude Code is

Anthropic's official CLI. You install it, point it at a directory, and have a long-running conversation in your terminal. It reads files, runs shell commands, edits code, asks questions when ambiguous.

Install:

```bash
npm install -g @anthropic-ai/claude-code
```

(Not `@anthropics/claude-code` — that's the wrong scope and was in an earlier draft of this post. Caught it on review. Read your AI's output.)

Once installed, you run `claude` in any directory and it picks up the codebase context. You can give it a goal — "migrate this Stencil app to Astro" — or a tactical instruction — "fix the hydration mismatch in RightPanel.tsx."

## What's been working

**Big mechanical refactors.** "Move all source files into a `web-stencil/` subdirectory and create a parallel `web-astro/` scaffold." That's a four-hour task done in fifteen minutes, including verifying the Stencil build still passes from the new location.

**Reading the codebase.** Claude understands my project's structure better than a new hire would after a week. It traced the right-panel component's adaptive menu crunching algorithm and proposed a Solid port that preserved the behavior — without me explaining what the algorithm did.

**Boring infrastructure work.** Setting up Astro Content Collections, wiring blog markdown frontmatter, configuring Vite plugins, debugging hydration mismatches in SSR'd Solid components. The kind of work that's necessary but not interesting.

**Course-correcting.** I rejected its first plan twice — once for putting page content inside the right panel (architectural confusion that came from me, not it), once for tab names that were too literal a copy of Chrome DevTools labels. Both times it incorporated the correction into a saved memory file so the next session won't repeat the mistake. That memory system is the difference between an "AI tool" and an "AI collaborator."

## What hasn't been working

**Visual judgment.** Claude can write CSS, but it can't *see* the page. It will produce a layout that's "correct" by spec and visually wrong. The fix is fast — describe what's off, it adjusts — but I'm doing the visual review.

**Knowing when to stop.** Default behavior is thorough. If I ask for "fix the icons" it will sometimes also reorganize the icon system, refactor the component, and write a doc. Sometimes that's good. Often it's scope creep. The fix is to be more specific in the ask.

**Domain-specific creative voice.** When it drafted blog post content for me, the result was readable but generic — bullets and headings and "X is amazing because Y" patterns. Personal voice has to come from me. Claude is good at *editing* my prose; it's mediocre at *replacing* it. (You're reading my voice in this post; the bones came from a draft I wrote before asking Claude to tighten it.)

**Cost discipline.** A long context window is expensive. Two-hour migration sessions add up. Worth it for me; would not be worth it for everyone.

## The agent loop, observed

The thing that surprised me most is how much of the work Claude does is *reading* and *verifying*, not writing.

A typical exchange:

1. I describe what I want.
2. Claude reads the relevant files. Sometimes spawns a sub-agent to read in parallel.
3. It proposes a plan. Sometimes asks me a clarifying question.
4. It edits the files.
5. It runs the build to verify.
6. If the build fails, it reads the error, hypothesizes a cause, fixes it, re-runs.
7. It reports back.

Step 6 is the magic. The agent is debugging itself. I'm not in the loop until the work is either done or stuck.

The corollary: my role shifts from typing to reviewing. Most of my time is spent on architecture decisions, on saying *no* to suggestions that would over-engineer the solution, and on visually checking that the right thing happened.

## Should you use it?

If you're a developer who already produces high-quality code: yes, this will make you faster. The amplification factor is real but not infinite. Don't expect 10x. Expect 2-3x on routine work, and 5x on the kind of cross-cutting refactor that you'd otherwise procrastinate on.

If you're new to coding: be careful. Claude will produce code that looks right and isn't. You need enough taste to push back. The learning advantage is real if you treat it as a senior pair-programmer; it's a trap if you treat it as an oracle.

If you're a tech lead worried about your team: the work product is good. The skill that becomes valuable is reviewing AI-generated code with rigor, not writing code from scratch. Hire and train for that.

## What I've learned about myself

I'm faster *and* I'm thinking less. That's not unambiguously good. Some of my best architectural decisions in the past came from the friction of writing code by hand and noticing it felt wrong. With an agent, the friction is in the prompt — and I'm still figuring out which kinds of friction were valuable.

For now: I keep a memory file in the project that captures the design decisions I want preserved. I review every commit before it lands on `main`. I write the blog posts in my own voice. The agent writes the boilerplate.

That feels like the right division of labor. Ask me again in six months.
