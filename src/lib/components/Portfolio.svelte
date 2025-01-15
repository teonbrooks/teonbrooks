<script>
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import PortfolioCard from './PortfolioCard.svelte';

	let {items = [], path } = $props();

	let categories = items
		.map((x) => x.category)
		.flat(Infinity)
		.filter((v, i, a) => a.indexOf(v) === i)
	
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
	<div style="display: flex; align-items: center;">
		<section id="page-portfolio" class="page-portfolio">
			<h3 class="section-subtitle">Collection of my work</h3>
			<LayoutGrid>
				<Cell span={4}><button onclick={() => (isClicked = false)}>Show All</button></Cell>
				{#each categories as category}
					<Cell
						><button
							class="button"
							data-filter=".{category}"
							onclick={() => {
								isClicked = category;
							}}>{category}</button
						></Cell
					>
				{/each}
			</LayoutGrid>
			<LayoutGrid>
				{#each items.filter(matches) as item}
					<Cell>
						<PortfolioCard {item} {path} />
					</Cell>
				{/each}
			</LayoutGrid>
		</section>
	</div>
</article>
