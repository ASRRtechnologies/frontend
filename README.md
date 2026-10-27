# ASRR frontend packages

Shared frontend code for ASRR projects, lifted out of Alpha. Public on npm under `@asrr`.

| Package | What | For |
|---|---|---|
| [`@asrr/utils`](packages/utils) | Framework-free helpers: currency/number/byte/percentage formatting, locale separators, PDOK address lookup, safe arithmetic, contact links, coordinates, dynamic-search filter strings (`key:value`, the format `nl.asrr:core`'s `DynamicSearch` reads). No runtime dependencies. | Every project: Mantine apps and the Next/Tailwind sites alike. |
| [`@asrr/ui`](packages/ui) | Alpha's Mantine 9 theme (`createAppTheme`, `theme`, `resolver`, colour helpers), its design tokens stylesheet, and primitives: `Typography`, `AppCard`, `ThemeButton`, `IconThemeButton`, `ThemeBadge`, `Callout`, `Eyebrow`, `BarLoader`, `ScrollShadow`, `DynamicTooltip`, `IconWrapper`. | Mantine 9 + React 19 apps. |

## Using `@asrr/ui`

```tsx
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@asrr/ui/styles.css";
import { MantineProvider } from "@mantine/core";
import { AppCard, ThemeButton, resolver, theme } from "@asrr/ui";

<MantineProvider theme={theme} cssVariablesResolver={resolver} defaultColorScheme="dark">
	<AppCard title="Klanten">
		<ThemeButton>Opslaan</ThemeButton>
	</AppCard>
</MantineProvider>;
```

`createAppTheme(getLocaleFormatInfo(locale, currency))` gives a theme whose number inputs use that locale's separators. The SCSS mixins (`surface.card` and friends) are shipped for a consumer's own modules:

```scss
@use "@asrr/ui/scss/_surface.scss" as surface;
.myCard { @include surface.card; }
```

`styles.css` imports Poppins from Google Fonts; a page with a strict CSP has to allow `fonts.googleapis.com` / `fonts.gstatic.com`.

## What belongs here

- Code with no knowledge of a client, a tenant or an Alpha API. Labels come in as props, never from an i18n namespace inside the package.
- Code that at least two ASRR projects use or are about to use. A component used only in Alpha stays in Alpha.
- Everything in this repo is public: no client names, keys, internal URLs or branding beyond ASRR's own.

## Developing

```bash
bun install
bun run --filter '@asrr/utils' build   # ui resolves utils through its dist
bun run typecheck && bun run test && bun run build
bunx biome check .
```

Try a change in a consuming app before releasing: `bun link` in the package, `bun link @asrr/ui` in the app.

## Releasing

Conventional Commits on `dev`. `release.yml` (release-please) keeps one release PR per package; merging it tags `utils-vX.Y.Z` / `ui-vX.Y.Z` and publishes to npm with provenance. `fix:` is a patch, `feat:` a minor, `feat!:` / `BREAKING CHANGE:` a major. Publishing needs the `NPM_TOKEN` repository secret (an npm automation token with publish rights on the `@asrr` org).

`@asrr/ui` 1.x (2023, Mantine 6, React 17, from the `ui` repo) is a different code base; 2.0.0 is the first version from here.
