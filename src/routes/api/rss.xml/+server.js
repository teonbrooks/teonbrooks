import { siteTitle, siteDescription, siteURL } from '$lib/config'
import { render } from 'svelte/server'
import fetchPosts from '$lib/assets/js/fetchPosts'

export const prerender = true

export const GET = async () => {
	const { posts } = await fetchPosts({ limit: -1 })

	// Render each post's body HTML via its mdsvex component
	const postModules = import.meta.glob('/src/lib/posts/*.md')
	const htmlBySlug = {}
	await Promise.all(
		Object.entries(postModules).map(async ([path, resolver]) => {
			const { default: Component } = await resolver()
			const { html } = render(Component)
			const slug = path.split('/').pop().slice(0, -3)
			htmlBySlug[slug] = html
		})
	)

	const postsWithHtml = posts.map(post => ({ ...post, html: htmlBySlug[post.slug] ?? '' }))

	const body = renderFeed(postsWithHtml)
	const options = {
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`,
			'Content-Type': 'application/xml',
		}
	}
	return new Response(body, options)
}

const renderFeed = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/api/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `<item>
<guid isPermaLink="true">${siteURL}/blog/${post.slug}</guid>
<title>${post.title}</title>
<link>${siteURL}/blog/${post.slug}</link>
<description>${post.excerpt ?? ''}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>${post.coverImage ? `
<media:content url="${siteURL}${post.coverImage}" medium="image"/>` : ''}
<content:encoded><![CDATA[${post.html}]]></content:encoded>
</item>`).join('')}
</channel>
</rss>
`
