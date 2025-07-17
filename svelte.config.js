import adapter from '@sveltejs/adapter-node';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		alias: {
			'@components': path.resolve('./src/lib/components')
		},
		adapter: adapter()
	}
};

export default config;
