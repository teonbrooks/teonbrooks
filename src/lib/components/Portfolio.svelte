<script>
	import PortfolioCard from './PortfolioCard.svelte';

	let { items = [], path, filters = true } = $props();

	let categories = $derived(
		items
			.map((x) => x.category)
			.flat(Infinity)
			.filter((v, i, a) => a.indexOf(v) === i)
	);

	let isClicked = $state(false);

	let filteredItems = $derived(
		isClicked
			? items.filter(item => [item.category].flat().includes(isClicked))
			: items
	);
</script>

<div id="portfolio">
	<section>
		<div class="portfolioGrid">
			{#if filters}
				<div id="filters">
					<button onclick={() => (isClicked = false)}>Show All</button>
					{#each categories as category (category)}
						<button
								class="button"
								data-filter=".{category}"
								onclick={() => {
									isClicked = category;
								}}>{category}</button
							>
					{/each}
				</div>
			{/if}
			<div id="grid">
				{#each filteredItems as item (`${item.organization}-${item.title}`)}
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
