<script>
import Portfolio from "$lib/components/Portfolio.svelte";
	let { data } = $props();

const items = data.portfolio.positions;
const path = data.path;

</script>

<svelte:head>
	<title>Portfolio</title>
</svelte:head>

<h1>Portfolio</h1>   

<Portfolio {path} {items} />
