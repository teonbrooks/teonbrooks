<script>
	import { siteTitle, siteDescription, siteImage, siteImageWidth, siteAuthor, siteURL, faviconImage } from '$lib/config';	
	import Article from "$lib/components/Article.svelte";
	// TODO: consider creating a page.js similar to blog/[post]/+page.js for import
	import MdRaw from "$lib/content/about/brooks_bio.md?raw";
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
	<title>About</title>
</svelte:head>
<Article content={MdRaw}/>
