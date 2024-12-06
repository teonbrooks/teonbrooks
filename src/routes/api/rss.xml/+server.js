// IMPORTANT: update all these property values in src/lib/config.js
import { siteTitle, siteDescription, siteURL } from '$lib/config'

export const prerender = true

export const GET = async () => {	
	const data = await Promise.all(
		Object.entries(import.meta.glob('$lib/posts/*.md')).map(async ([path, page]) => {
			const blogPost = await page()
			const blogContent = blogPost.default.render().html
			const metadata = blogPost.metadata
			const slug = path.split('/').pop().split('.').shift()
			return { ...metadata, slug, blogContent }
		})
	)
	.then(posts => {
		return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
	})

	const body = render(data)
	const options = {
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`,
			'Content-Type': 'application/xml',
		}
	}
	return new Response(
		body,
		options,
	)
};


//Be sure to review and replace any applicable content below!
const render = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/api/rss.xml" rel="self" type="application/rss+xml"/>
${posts
	.map(
		(post) => `<item>
<guid isPermaLink="true">${siteURL}/blog/${post.slug}</guid>
<title>${post.title}</title>
<image>
	<url>${siteURL}${post.coverImage}</url>
</image>
<link>${siteURL}/blog/${post.slug}</link>
<description>${post.excerpt}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`
	)
	.join('')}
</channel>
</rss>
`;
