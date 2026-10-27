import { defineConfig } from "tsup";

// Bundled to one file so Node ESM consumers (vitest in a consuming app
// externalizes dependencies) never resolve extensionless relative imports.
export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	target: "es2022",
});
