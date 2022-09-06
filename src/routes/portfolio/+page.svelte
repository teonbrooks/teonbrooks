<script>
import Portfolio from "$lib/components/Portfolio.svelte";
import portfolio from "$lib/cv/portfolio.json";

const items = portfolio.positions;

</script>

<svelte:head>
	<title>Portfolio</title>
</svelte:head>

<h1>Portfolio</h1>    
<Portfolio {items} />
