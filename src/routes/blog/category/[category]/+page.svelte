<!-- Renders any page at /blog/category/* -->
<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
  	import { postsPerPage } from '$lib/config'
	import ButtonDownSignUp from '$lib/components/ButtonDownSignUp.svelte';

	let { data } = $props();

  const { page, posts, category, categoryTotal } = data

	let lowerBound = $derived((page * postsPerPage) - (postsPerPage - 1) || 1)
	let upperBound = $derived(Math.min(page * postsPerPage, categoryTotal))
</script>


<svelte:head>
	<title>Category: {category}</title>
</svelte:head>


<h1>{`{${category} edition}`}</h1>

{#if posts.length}
	<PostsList posts={posts.slice(0, postsPerPage)} />
	<Pagination currentPage={page} totalPosts={categoryTotal} path="/blog/category/{category}/page" />
	<ButtonDownSignUp {category} />
{:else}
	<p><strong>Ope!</strong> Sorry, couldn't find any posts in the category "{category}".</p>

	<p><a href="/blog">Back to blog</a></p>
{/if}