import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	"assetsInclude": ["static/**/*.toml"],
	server: {
		fs: {
			allow: ['.']
		}
	}
};

export default config
