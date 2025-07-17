import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['@amcharts/amcharts5']
	},
	ssr: {
		noExternal: ['@amcharts/amcharts5']
	},
	resolve: {
		alias: {
			$src: path.resolve('src')
		}
	}
});
