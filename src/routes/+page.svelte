<script>
	import { siteTitle } from '$lib/config';
	import BusinessCard from '$lib/components/BusinessCard.svelte';
	import { CardFan } from 'passports-cards';
	import { passportCards } from '$lib/content/passport-cards.js';
	let { data } = $props();

	let portfolio = $derived(data.portfolio);

</script>

<svelte:head>
	<!-- Can add custom head here -->
	<title>{siteTitle}</title>
</svelte:head>

<div id="card">
	<BusinessCard {...portfolio.id} src={portfolio.id.imageURL} />
</div>

<section class="passports" aria-labelledby="passports-heading">
	<h2 id="passports-heading">My passports</h2>
	<CardFan cards={passportCards} font="inherit" label="Sample cards from each of my passports" />
</section>

<style>
	#card {
		display: grid;
		justify-content: center;
	}

	.passports {
		margin-top: 2rem;
		text-align: center;
	}

	.passports h2 {
		margin-top: 0;
	}
</style>
