<!-- Renders any page at /blog/tag/* -->
<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
  	import { postsPerPage } from '$lib/config'
	import KitSignUp from '$lib/components/KitSignUp.svelte';
	import { tagsEmoji } from '$lib/config';

	let { data } = $props();

  const { page, posts, tag, tagsTotal } = data

	// eslint-disable-next-line no-unused-vars
	let lowerBound = $derived((page * postsPerPage) - (postsPerPage - 1) || 1)
	// eslint-disable-next-line no-unused-vars
	let upperBound = $derived(Math.min(page * postsPerPage, tagsTotal))
</script>


<svelte:head>
	<title>Tag: {tag}</title>
</svelte:head>


<h1>{`{${tagsEmoji[tag]} ${tag} edition}`}</h1>

{#if posts.length}
	<PostsList posts={posts.slice(0, postsPerPage)} />
	<Pagination currentPage={page} totalPosts={tagsTotal} path="/blog/tag/{tag}/page" />
	<KitSignUp {tag} />
{:else}
	<p><strong>Ope!</strong> Sorry, couldn't find any posts in the tag "{tag}".</p>

	<p><a href="/blog">Back to blog</a></p>
{/if}