<script>
import Portfolio from "$lib/components/Portfolio.svelte";
import portfolio from "$lib/cv/portfolio.json";

const items = portfolio.positions;

</script>

<svelte:head>
	<script defer data-domain="teonbrooks.com" src="https://plausible.io/js/script.js"></script>
	<title>Portfolio</title>
</svelte:head>

<h1>Portfolio</h1>    
<Portfolio {items} />
