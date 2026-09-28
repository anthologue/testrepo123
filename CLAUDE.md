# CLAUDE.md

Guidance for Claude Code (and other contributors) working in this repository.

## Stack & Conventions

**Hard constraint: vanilla HTML, CSS, and JavaScript only — no frameworks, no build step.**

- Do not introduce JavaScript frameworks or libraries (React, Vue, Angular, Svelte, jQuery, etc.).
- Do not introduce a build step of any kind — no bundlers (Webpack, Vite, esbuild, Rollup), no transpilers (Babel, TypeScript), no CSS preprocessors (Sass, Less, PostCSS).
- Write plain `.html`, `.css`, and `.js` files that run directly in the browser with no compile, bundle, or install step.
- Avoid adding a `package.json`/`node_modules` dependency chain purely for tooling; if a dependency is unavoidable, prefer none at all over adding one.
- Keep markup, styles, and scripts simple and directly runnable by opening the HTML file or serving it as static files.
