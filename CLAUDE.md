# CLAUDE.md

Shared ASRR frontend packages. Read [README.md](./README.md) first: what belongs here and how releases work.

- **Package manager is `bun`.** Workspaces under `packages/*`; `@asrr/ui` depends on `@asrr/utils` via `workspace:^`, which `bun pm pack` rewrites to a real range on publish. Never `npm publish` a package directory directly: npm does not rewrite `workspace:` and would ship an uninstallable package.
- **Build utils before typechecking ui.** ui resolves `@asrr/utils` through `packages/utils/dist`.
- **Everything here is public on npm and GitHub.** No client names, tenant logic, Alpha API types (`generated/`), keys or internal URLs.
- **No i18n inside the packages.** Text a component shows comes in as a prop. Alpha's copies call `useTranslation`; strip that when porting a component here.
- **Alpha is still the source until it migrates.** Porting a component: copy it with its test, rewrite `@/shared/...` imports to package-relative ones, then switch Alpha to the package in the same change, so there are never two copies drifting apart.
- **Peer ranges are a promise.** `@mantine/*` ^9, React ^19. Widening one means testing against that version; narrowing one is a breaking change (`feat!:`).
- **Formatting:** Biome, tabs, double quotes (same as Alpha). `bunx biome check --write .`
- **Commits:** Conventional Commits, scoped by package (`feat(ui): ...`, `fix(utils): ...`); release-please reads them per package path.
