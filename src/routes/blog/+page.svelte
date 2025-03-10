<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import { postsPerPage, siteDescription, tagsEmoji } from '$lib/config'
	import ButtonDownSignUp from '$lib/components/ButtonDownSignUp.svelte';

	let { data } = $props();
	const selectTags = ['travel', 'tech', 'kitchen'];

</script>


<svelte:head>
	<title>Dispatches from a [blerd 🤓]</title>
</svelte:head>

<h1 align='center'>Dispatches from a [🤓 blerd]</h1>

<div id='selectTags'>
	{#each selectTags as tag}
		<button onclick={() => window.open(`./blog/tag/${tag}`, '_self')}>
			{`{${tagsEmoji[tag]} ${tag} edition}`}
		</button>
	{/each}
</div>
<div id='allTags'>
	<button onclick={() => window.open(`./blog/tags`, '_self')}>[All the tags]</button>
</div>

<h2>🚰 The Firehose</h2>
<PostsList posts={data.posts.slice(0, postsPerPage)} />

<Pagination currentPage={1} totalPosts={data.total} />

<!-- Add a mailto button option -->

<ButtonDownSignUp />


<style>
	#selectTags {
		flex-flow: row wrap;
		display: flex;
		justify-content: space-between;
		
	}
	#allTags {
		display: flex;
		align-items: center;
		justify-content: center
	}
</style>
