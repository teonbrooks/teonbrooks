import { postsPerPage } from '$lib/config'

const fetchPosts = async ({ offset = 0, limit = postsPerPage, tag = '' } = {}) => {

	const posts = await Promise.all(
		// why doesn't this allow folders within posts to be included. see the details of glob
		Object.entries(import.meta.glob('/src/lib/posts/*.md')).map(async ([path, resolver]) => {
			const { metadata } = await resolver()
			const slug = path.split('/').pop().slice(0, -3)
			return { ...metadata, slug }
		})
	)

	let sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date))
	let tagsTotal;
	
	if (tag) {
		sortedPosts = sortedPosts.filter(post => post.tags.includes(tag))
		tagsTotal = sortedPosts.length
	}
  
	if (offset) {
		sortedPosts = sortedPosts.slice(offset)
	}
	
	if (limit && limit < sortedPosts.length && limit != -1) {
		sortedPosts = sortedPosts.slice(0, limit)
	}

	// sortedPosts = sortedPosts.map(post => ({
	// 	title: post.title,
	// 	slug: post.slug,
	// 	excerpt: post.excerpt,
	// 	coverImage: post.coverImage,
	// 	coverWidth: post.coverWidth, 
	// 	coverHeight: post.coverHeight,
	// 	date: post.date,
	// 	tags: post.tags,
	// 	collections: post.collections
	// }))

	return {
		posts: sortedPosts,
		tagsTotal
	}
}

export default fetchPosts