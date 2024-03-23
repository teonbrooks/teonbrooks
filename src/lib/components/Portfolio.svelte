<script>
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import PortfolioCard from './PortfolioCard.svelte';

	export let items = [];
	export let categories = items
		.map((x) => x.category)
		.flat(Infinity)
		.filter((v, i, a) => a.indexOf(v) === i);

	export let path_icons = '/images/portfolio_icons';
	$: isClicked = '';
	$: matches = (item) => {
		if (!Array.isArray(item.category)) {
			item.category = [item.category];
		}
		if (!isClicked) {
			return item;
		}
		return item.category.includes(isClicked) ? item : false;
	};
</script>

<article id="portfolio" class="panel">
	<div style="display: flex; align-items: center;">
		<section id="page-portfolio" class="page-portfolio">
			<h3 class="section-subtitle">Collection of my work</h3>
			<div id="filters" class="button-group">
				<LayoutGrid>
					<Cell span={4}><button on:click={() => (isClicked = '')}>Show All</button></Cell>
					{#each categories as category}
						<Cell
							><button
								class="button"
								data-filter=".{category}"
								on:click={() => {
									isClicked = category;
								}}>{category}</button
							></Cell
						>
					{/each}
				</LayoutGrid>
			</div>
			<LayoutGrid>
				{#each items.filter(matches) as item}
					<Cell>
						<PortfolioCard {item} {path_icons} />
					</Cell>
				{/each}
			</LayoutGrid>
		</section>
	</div>
</article>
