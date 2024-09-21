<script>
import Portfolio from "$lib/components/Portfolio.svelte";
export let data;

const items = data.collection.positions;
const path = data.path;

</script>

<svelte:head>
	<title>Portfolio</title>
</svelte:head>

<h1>Portfolio</h1>   

<Portfolio {path} {items} />
