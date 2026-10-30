# Ultrabot page contract

Not published (Jekyll skips `_` folders). Copy these blocks into every page, verbatim.

- **Head:** load `/assets/ultrabot.css` (one stylesheet for the whole site), the Google Fonts link (Syne 700/800 + DM Sans 400–700), the inline `<script>document.documentElement.classList.add('js')</script>`, and `/assets/ultrabot.js` with `defer`. Copy the rest of the `<head>` from `/voice-agents/index.html`: title as `<Page> | Ultrabot: Hebrew & English voice agents`, meta description, canonical `https://ultrabot.ai/<path>/`, og/twitter tags (`/assets/og/home.png` if a page has no image of its own). No analytics.
- **Body order:** `header.html` → `<main id="main">` … page content … `contact.html` (replace `{{TOPIC}}` with the page slug) → `</main>` → `footer.html`. The nav's Contact link is `#contact`, so every page must include the contact section.
- **Current page:** add `aria-current="page"` to the matching nav link (for Bedrock/LangGraph/n8n, also add `ub-current` to `<li class="ub-has-sub">`).
- **Article page** (`/insights/<slug>/`): inside `<main>`, use `<article class="ub-article">` with `<nav class="ub-breadcrumb">`, `<h1>`, `<p class="ub-meta">` (date, author), then plain `h2/h3/p/ul/figure/blockquote/pre`; wrap tables in `<div class="ub-table">`; an optional closing `<aside class="ub-cta">`. Listing pages can use `.ub-section` + `.ub-grid.ub-reads` cards.
- **Hebrew RTL page** (`/he/…`): `<html lang="he" dir="rtl">`, and add Rubik (or Assistant) to the Fonts link. Translate the header/footer/contact labels but keep the same markup and classes; `html[dir=rtl]` rules in `ultrabot.css` handle direction, fonts and LTR islands (logo, email, phone). Swap the nav's `עברית` link for `English` → `/`, with `lang="en" hreflang="en"`.
- **Building blocks** (all in `ultrabot.css`): `.ub-wrap`, `.ub-section` (`.white`), `.ub-eyebrow`, `.ub-section-lead`, `.ub-grid` + `.ub-service`, `.ub-process` + `.ub-step`, `.ub-faq` (`<details>`), `.ub-btn` (`.ink`, `.ghost`), `.ub-page-hero` for topic-style heroes.
- **Demo:** link to `https://talk.mlaia.com/?from=ultrabot.ai` (new tab). Only the home page embeds it as an iframe.
