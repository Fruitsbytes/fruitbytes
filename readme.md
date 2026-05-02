# FruitsBytes

Personal portfolio site for Jeffrey N. Carre — [fruitsbytes.com](https://fruitsbytes.com).

## Repository layout

This repo contains two parallel apps during the Stencil → Astro migration:

```
/web-stencil/   Current production app (StencilJS 4.39, Web Components)
/web-astro/     New app under construction (Astro + Solid islands)
/docs/          Repo-level documentation
```

Both apps will run side-by-side until the Astro app reaches feature parity.
The Stencil app is the source of truth and stays untouched during the migration.
A backup snapshot is preserved at git tag `pre-astro-migration` and branch `backup/stencil-final`.

## Working on the Stencil app

```bash
cd web-stencil
npm install     # first time only
npm start       # dev server on http://localhost:3333
npm run build   # production build to web-stencil/www/
npm test        # spec + e2e tests
```

## Working on the Astro app

```bash
cd web-astro
npm install     # first time only
npm run dev     # dev server
npm run build   # production build to web-astro/dist/
```

## Migration status

See `docs/migration-status.md` (forthcoming) for the parity checklist and per-feature progress.
