import { siteURL } from '$lib/config';
import fetchPosts from '$lib/assets/js/fetchPosts';

export const prerender = true;

const staticRoutes = ['', 'about', 'blog', 'blog/tags', 'consulting', 'contact', 'portfolio'];

export const GET = async () => {
	const { posts } = await fetchPosts({ limit: -1 });

	const uniqueTags = new Set();
	posts.forEach((post) => post.tags?.forEach((tag) => uniqueTags.add(tag)));

	const urls = [
		...staticRoutes.map((route) => `${siteURL}/${route}`),
		...posts.map((post) => `${siteURL}/blog/${post.slug}`),
		...[...uniqueTags].map((tag) => `${siteURL}/blog/tag/${tag}`)
	];

	const body = renderSitemap(urls);
	const options = {
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`,
			'Content-Type': 'application/xml'
		}
	};
	return new Response(body, options);
};

const renderSitemap = (urls) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `<url>
<loc>${url}</loc>
</url>`
	)
	.join('\n')}
</urlset>
`;
