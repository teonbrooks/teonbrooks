import adapter from '@sveltejs/adapter-static'
import { mdsvex } from 'mdsvex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeToc from 'rehype-toc'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	vitePlugin: {
		// mdsvex generates <script context="module"> for frontmatter exports, which is
		// deprecated in Svelte 5 but not yet fixed upstream in mdsvex.
		onwarn: (warning, handler) => {
			if (warning.filename?.endsWith('.md') && warning.message?.includes('context="module"')) return;
			handler(warning);
		}
	},
	// Ensures both .svelte and .md files are treated as components (can be imported and used anywhere, or used as pages)
	extensions: ['.svelte', '.md'],

	preprocess: [
		mdsvex({
			// The default mdsvex extension is .svx; this overrides that.
			extensions: ['.md'],

			// Adds IDs to headings, and anchor links to those IDs. Note: must stay in this order to work.
			rehypePlugins: [
				rehypeSlug,
				rehypeAutolinkHeadings,
				// rehypeToc
			],
		}),
	],

	kit: {
		adapter: adapter(),
		prerender: {
			entries: [
				'*',
				'/api/posts/page/*',
				'/blog/tag/*/page/',
				'/blog/tag/*/page/*',
				'/blog/tags/page/',
				'/blog/tags/page/*',
				'/blog/page/',
				'/blog/page/*',
			],
			handleHttpError: 'ignore',
		}
	}
};

export default config;
