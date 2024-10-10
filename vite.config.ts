import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
// const zkNotaryVerifier = require("zknotary-verifier");
import wasm from 'vite-plugin-wasm';
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig(({ mode }) => {
	// const env = loadEnv(mode, process.cwd(), '');
	process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};
	return {
		define: {
			'process.env.HOME': JSON.stringify(process.env.HOME),
			'process.env.HOMEPATH': JSON.stringify(process.env.HOMEPATH),
			'process.env.USERPROFILE': JSON.stringify(process.env.USERPROFILE),
			'process.env.CHAIN_ID': JSON.stringify(process.env.CHAIN_ID),
		},
		plugins: [sveltekit(), wasm()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		build: {
			target: 'esnext'
		}
	};
});
