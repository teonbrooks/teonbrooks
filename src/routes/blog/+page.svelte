<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import { postsPerPage, siteDescription } from '$lib/config'
	import MailchimpSignUp from '$lib/components/MailchimpSignUp.svelte';

	export let data
	export let selectedCollections = [['nomad', 'nomad', '🎒'],
									  ['tech', 'techie', '👨🏾‍💻'],
									  ['kitchen', 'baker', '👨🏾‍🍳']];
</script>


<svelte:head>
	<title>Dispatches from a [nerd 🤓]</title>
	<!-- RSS -->
	<link href="/api/rss.xml" type="application/atom+xml" rel="alternate" title="Teon's Blog Feed">
	<meta data-key="description" name="description" content={siteDescription}>
</svelte:head>

<h1 align='center'>Dispatches from a [...]</h1>

<div id='collection'>
	{#each selectedCollections as collection}
		<button on:click={() => window.open(`./blog/category/${collection[0]}`, '_self')}>[{collection[1]} {collection[2]}]</button>
	{/each}
</div>
<div style="display: flex; align-items=center; justify-content: center">
	<button on:click={() => window.open(`./blog/category`, '_self')}>[All the categories]</button>
</div>

<h2>The Firehose 🚰</h2>
<PostsList posts={data.posts.slice(0, postsPerPage)} />

<Pagination currentPage={1} totalPosts={data.total} />

<!-- Add a mailto button option -->

<MailchimpSignUp />


<style>
	#collection {
		flex-flow: row wrap;
		display: flex;
		justify-content: space-between;
		
	}
</style>
