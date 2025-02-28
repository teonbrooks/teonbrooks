import fetchPosts from '$lib/assets/js/fetchPosts'

export const load = async ({ params }) => {
	const tag = params.tag
  const page = params.page || 1
	const options = { tag, limit: -1 }
	const { posts, tagsTotal } = await fetchPosts(options)

	return { 
		posts,
		tag,
		page,
		total: posts.length,
		tagsTotal
	}
}
