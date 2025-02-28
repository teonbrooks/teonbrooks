import { redirect } from '@sveltejs/kit'
import { postsPerPage } from '$lib/config'
import fetchPosts from '$lib/assets/js/fetchPosts'

export const load = async ({ url, params, fetch }) => {
	const page = parseInt(params.page) || 1
	const { tag } = params

	// Prevents duplication of page 1 as the index page
	if (page <= 1) {
		redirect(301, `/blog/tag/${tag}`);
	}
	
	let offset = (page * postsPerPage) - postsPerPage
	
	const options = { offset, tag, limit: -1 }
	const { posts, tagsTotal } = await fetchPosts(options)

	return {
		posts,
		page,
		tag,
		totalPosts: tagsTotal 
	}
}
