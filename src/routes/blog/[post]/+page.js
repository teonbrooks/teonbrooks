import { error } from '@sveltejs/kit'

const allPosts = import.meta.glob('../../../lib/posts/**/*.md')

export const load = async ({ params, data }) => {
	const match = Object.entries(allPosts).find(([path]) =>
		path.split('/').pop() === `${params.post}.md`
	)

	if (!match) error(404, 'Not found')

	const post = await match[1]()

	if (post.metadata?.draft && !import.meta.env.DEV) error(404, 'Not found')

	return {
		toml: data.toml,
		PostContent: post.default,
		meta: { ...post.metadata, slug: params.post }
	}
}
