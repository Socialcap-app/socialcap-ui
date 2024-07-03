import { sveltekit } from '@sveltejs/kit/vite';
// const zkNotaryVerifier = require("zknotary-verifier");
import wasm from "vite-plugin-wasm";
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), wasm()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
