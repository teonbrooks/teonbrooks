import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [tailwindcss(), sveltekit()],
	assetsInclude: ['static/**/*.toml'],
	server: {
		fs: {
			allow: ['.']
		}
	}
};

export default config;
