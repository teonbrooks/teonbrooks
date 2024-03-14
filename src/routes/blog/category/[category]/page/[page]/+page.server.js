import { redirect } from '@sveltejs/kit'
import { postsPerPage } from '$lib/config'
import fetchPosts from '$lib/assets/js/fetchPosts'

export const load = async ({ url, params, fetch }) => {
	const page = parseInt(params.page) || 1
	const { category } = params

	// Prevents duplication of page 1 as the index page
	if (page <= 1) {
		redirect(301, `/blog/category/${category}`);
	}
	
	let offset = (page * postsPerPage) - postsPerPage
	
	const options = { offset, category, limit: -1 }
	const { posts, categoryTotal } = await fetchPosts(options)

	return {
		posts,
		page,
		category,
		totalPosts: categoryTotal 
	}
}
