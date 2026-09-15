<script>
	let { data } = $props();
	let uniqueTags = $derived(data.uniqueTags);
</script>


<svelte:head>
	<title>Blog | Tags</title>
</svelte:head>


<div class="compressed-content">
	<h1 class="h2">All blog tags</h1>
	
	<ul>
		{#each uniqueTags as tag (tag.title)}
		<li>
			<a href="/blog/tag/{tag.title}">
				{ tag.title }
			</a>
			({tag.count})
		</li>
		{/each}
	</ul>
</div>