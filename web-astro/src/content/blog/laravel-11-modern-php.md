---
title: "Laravel 11 from the Trenches of a $200M Voucher Platform"
description: "I built fintech on Laravel for a decade in Haiti. Here's what Laravel 11 fixes that I would have killed for in 2017 — and what it still won't solve."
author: "Jeffrey Nicholson Carré"
date: 2024-11-15
category: "Backend"
tags: ["Laravel", "PHP", "Backend", "Fintech"]
image: "/assets/images/blog/default.jpg"
readTime: 8
excerpt: "I built a $200M mobile-money voucher platform on Laravel during my CTO years. Here's an honest take on what Laravel 11 finally gets right and what it still won't fix."
language: "en"
---

# Laravel 11 from the Trenches of a $200M Voucher Platform

I was the CTO of Transversal in Haiti from 2013 to 2021. We built a mobile-money platform that processed about 200M USD in voucher transactions. The stack was PHP and Laravel from version 5 onward. Banks, NGOs, and the Haitian government depended on it. SMS, USSD, mobile apps, and a Filament-style admin all hit the same Laravel monolith.

I'm not in fintech anymore — I'm a senior consultant at CGI now, mostly in Angular land — but Laravel still ships my side projects, and I've been watching v11 with interest. Here's what it gets right and where I'd push back.

## The slim app philosophy is overdue

Every Laravel project I inherited had files nobody touched. `Kernel.php`. `EventServiceProvider`. `BroadcastServiceProvider`. They sat there because the install put them there, not because anyone needed them.

Laravel 11 strips this down:

- One `AppServiceProvider` by default
- Middleware classes only when you actually customize
- A leaner `bootstrap/` directory
- Less to scroll past in your IDE on day one

Files you previously inherited are still publishable when you need them — `php artisan config:publish` will dump them back. The default just stops imposing them.

For new projects this is a clean win. For migrating an existing v9/v10 app, the gain is mostly philosophical: my old projects already accumulated their own bespoke service providers, and Laravel 11 doesn't force me to delete them.

## Per-second rate limiting

This is the v11 feature I would have actually killed for in 2017.

We had two scenarios at Transversal where Laravel's per-minute rate limiting was wrong:

1. **USSD sessions.** A telco USSD gateway would batch a user's session keystrokes and replay them in <500ms. We needed "at most 5 hits per second per user," not "60 per minute" — the latter let a single misbehaving session burn an entire minute's quota in one burst.
2. **SMS replies.** Operators would occasionally retry our outbound SMS callbacks under 1s apart. We wanted to throttle without missing real traffic.

The v11 syntax:

```php
Route::middleware(['throttle:perSecond,10'])->group(function () {
    Route::get('/api/data', [DataController::class, 'index']);
});
```

That's it. We had to write this ourselves in 2017 with Redis token buckets. It worked, but it was 200 lines of code that should never have existed.

## Job batching that actually fails predictably

We did a lot of fan-out work — disburse 1,000 vouchers to 1,000 phone numbers, each via a queued job, and then notify a partner when the batch completed. Laravel's batch API existed, but the failure paths were rough. A single job dying could leave the batch in a state where neither `then` nor `catch` fired cleanly.

Laravel 11 cleaned this up. Lifecycle hooks now run as documented:

```php
Bus::batch([
    new ProcessPodcast(1),
    new ProcessPodcast(2),
    new ProcessPodcast(3),
])
->then(fn (Batch $batch) => /* all jobs completed */)
->catch(fn (Batch $batch, Throwable $e) => /* first failure */)
->finally(fn (Batch $batch) => /* always runs */)
->dispatch();
```

The `finally` always running, even on partial failure, is the missing piece. Half the bugs we fixed in production fintech were partial-state issues that went unobserved.

## Native health route

```
GET /.well-known/health
```

Zero config. Returns 200 if the app is up. We hand-rolled this for our DigitalOcean droplets. With Laravel Forge you used to wire it through a custom controller. Now it's just there. For Kubernetes liveness probes this is the right place to start.

## PHP 8.3 features Laravel 11 leans on

Laravel 11 requires PHP 8.2+ and is the first release where the framework actively encourages modern PHP idioms:

```php
class PaymentStatus
{
    public const string PENDING   = 'pending';
    public const string COMPLETED = 'completed';
    public const string FAILED    = 'failed';
}

readonly class UserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public DateTime $createdAt,
    ) {}
}
```

Typed class constants, readonly classes, constructor property promotion. None of these are Laravel features specifically — they're PHP 8.x — but Laravel 11 finally writes documentation that uses them by default. New devs joining a Laravel 11 project will write better PHP than new devs joining a Laravel 9 project, even if neither knows it.

## Where I push back

Laravel keeps adding optional sugar. That's the right direction. But:

- **Eloquent is still the wrong default for high-volume writes.** I learned this the hard way at 200M USD scale. Use the query builder for bulk inserts/updates. Ignore the docs that suggest `User::create()` in a loop.
- **Octane is a real choice, not a free upgrade.** It pays huge dividends if your app is stateless and your code is careful with global state. It will burn you if either is untrue.
- **The ecosystem is great, but it's also a lock-in.** Forge, Vapor, Nova, Horizon — wonderful when you're shipping. Painful if you ever want to leave.

## Should you upgrade?

For a new project: yes, start on 11. The slim app structure alone is worth it.

For an existing v10 project: read the upgrade guide carefully. The skeleton changes don't migrate automatically. Most working apps don't *need* v11 — but the per-second rate limiting and batch improvements are worth it if you do anything async.

For an existing v9 or earlier: you're already past the easy upgrade window. Plan for two days of breaking-change work. Worth it.

Laravel 11 is not a revolution. It's a thoughtful release that fixes things I felt as bugs five years ago. That's the best thing a mature framework can do.
