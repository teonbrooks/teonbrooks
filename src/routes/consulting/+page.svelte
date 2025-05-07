<script>
	import { siteTitle, siteDescription, siteImage, siteImageWidth, siteAuthor, siteURL, faviconImage } from '$lib/config';
	import Portfolio from "$lib/components/Portfolio.svelte";
	import md from 'markdown-it';
	let { data } = $props();

	let items = data.portfolio;
	const path = data.path;

	import MdRaw from "$lib/content/about/brooks_consulting.md?raw";

</script>

<svelte:head>
	<!-- Open Graph -->
	<meta data-key="description" name="description" content={siteDescription} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={siteURL}>
	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content={faviconImage} />
	<meta property="og:image:width" content={siteImageWidth} />
	<meta property="og:image:height" content={siteImageWidth} />
	<!-- Twitter -->
	<meta name="twitter:title" content={siteTitle}>
	<meta name="twitter:description" content={siteDescription}>
	<meta name="twitter:site" content="@teonbrooks">
	<meta name="twitter:image" content={faviconImage}>
	<meta name="twitter:card" content="summary_large_image">
	<title>Consulting</title>
</svelte:head>

{@html md().render(MdRaw)}


<div class="portfolio">
	<h2>Collections of Clients</h2>
	<Portfolio {path} {items} filters={false} />
</div>

<style>
	.portfolio {
		width: 75dvw;
	}
</style>
