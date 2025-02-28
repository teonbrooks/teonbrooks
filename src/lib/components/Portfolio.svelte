<script>
	import PortfolioCard from './PortfolioCard.svelte';

	let { items = [], path } = $props();

	let categories = items
		.map((x) => x.category)
		.flat(Infinity)
		.filter((v, i, a) => a.indexOf(v) === i);

	let isClicked = $state(false);

	let matches = $derived((item) => {
		if (!Array.isArray(item.category)) {
			item.category = [item.category];
		}
		if (!isClicked) {
			return item;
		}
		return item.category.includes(isClicked) ? item : false;
	});
</script>

<article id="portfolio" class="panel">
	<section id="page-portfolio" class="page-portfolio">
		<h3 class="section-subtitle">Collection of my work</h3>
		<div class="grid">
			<div id="filters">
				<button onclick={() => (isClicked = false)}>Show All</button>
				{#each categories as category}
					<button
							class="button"
							data-filter=".{category}"
							onclick={() => {
								isClicked = category;
							}}>{category}</button
						>
				{/each}
			</div>
			<div id="grid">
				{#each items.filter(matches) as item}
					<PortfolioCard {item} {path} />
				{/each}
			</div>
		</div>
	</section>
</article>

<style>
	#filters {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		padding: 2rem;
	}

	#grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}
</style>
