<script>
import Portfolio from "$lib/components/Portfolio.svelte";
// import portfolio from "$lib/content/portfolio.json";
export let data;
console.log(data.portfolio.positions[0])

const items = data.portfolio.positions;

</script>

<svelte:head>
	<title>Portfolio</title>
</svelte:head>

<h1>Portfolio</h1>   

<Portfolio {items} />
