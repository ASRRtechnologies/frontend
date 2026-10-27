import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

const external = [
	...Object.keys(pkg.peerDependencies),
	...Object.keys(pkg.dependencies),
];

export default defineConfig({
	plugins: [react()],
	css: {
		// Hashed, prefixed class names so they never collide with a consumer's own modules.
		modules: { generateScopedName: "asrr_[local]_[hash:base64:5]" },
	},
	build: {
		lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" },
		cssCodeSplit: false,
		sourcemap: true,
		rollupOptions: {
			external: (id) =>
				external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
	},
});
