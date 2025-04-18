<script>
	import { siteTitle, siteDescription, siteImage, siteImageWidth, siteAuthor, siteURL, faviconImage } from '$lib/config';
	import BusinessCard from '$lib/components/BusinessCard.svelte';
	let { data } = $props();

	let { portfolio } = data;

</script>

<svelte:head>
	<!-- Can add custom head here -->
	<title>{siteTitle}</title>
</svelte:head>

<div id="card">
	<BusinessCard {...portfolio.id} src={portfolio.id.imageURL} />
</div>

<style>
	#card {
		display: grid;
		justify-content: center;
	}
</style>
