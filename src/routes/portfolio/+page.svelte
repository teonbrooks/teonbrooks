<script>
	import {
		siteTitle,
		siteDescription,
		siteImage,
		siteImageWidth,
		siteAuthor,
		siteURL,
		faviconImage
	} from '$lib/config';
	import Portfolio from '$lib/components/Portfolio.svelte';
	let { data } = $props();

	const items = data.portfolio.positions.reverse();
	const path = data.path;
</script>

<svelte:head>
	<!-- Open Graph -->
	<meta data-key="description" name="description" content={siteDescription} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={siteURL} />
	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content={faviconImage} />
	<meta property="og:image:width" content={siteImageWidth} />
	<meta property="og:image:height" content={siteImageWidth} />
	<!-- Twitter -->
	<meta name="twitter:title" content={siteTitle} />
	<meta name="twitter:description" content={siteDescription} />
	<meta name="twitter:site" content="@teonbrooks" />
	<meta name="twitter:image" content={faviconImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<title>Portfolio</title>
</svelte:head>

<h1>Portfolio</h1>

<div class="portfolio">
	<h2 class="section-subtitle">Collection of my work</h2>
	<Portfolio {path} {items} />
</div>

<style>
	.portfolio {
		width: 75dvw;
	}
</style>
