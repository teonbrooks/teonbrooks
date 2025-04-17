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

<div id="portfolio">
	<section>
		<h3 class="section-subtitle">Collection of my work</h3>
		<div class="portfolioGrid">
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
</div>

<style>
	#filters {
		display: grid;
		/* grid-template-columns: repeat(auto-fit, 6rem); */
		grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
		padding: 2rem;
		column-gap: 2rem;
		/* row-gap: 1rem; */
	}

	#filters button {
		font-size: .75rem;
	}

	#grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		column-gap: 2rem;
		justify-items: center;
	}

</style>
