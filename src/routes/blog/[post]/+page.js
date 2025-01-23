import { error } from '@sveltejs/kit'

export const load = async ({ params, data }) => {
	try {	
		const post = await import(`../../../lib/posts/${params.post}.md`)

		return {
			toml: data.toml,
			PostContent: post.default,
			meta: { ...post.metadata, slug: params.post } 
		}
	} catch(err) {
		error(404, err);
	}
}
