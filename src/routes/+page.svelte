<script>
import { siteTitle, siteDescription, siteImage, siteImageWidth, siteAuthor, siteURL, faviconImage } from '$lib/config';
import BusinessCard from '$lib/components/BusinessCard.svelte';
import portfolio from "$lib/cv/portfolio.json";

// export let data;
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta charset="utf-8" />
	<meta data-key="description" name="description" content="{siteDescription}">
	<meta name="author" content={siteAuthor}>
	<!-- Favicon -->
	<link rel="icon" type="image/svg" href={faviconImage} />
	<!-- Open Graph -->
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={siteURL}>
	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content={siteImage} />
	<meta property="og:image:width" content={siteImageWidth} />
	<meta property="og:image:height" content={siteImageWidth} />
	<!-- Indieweb -->
	<link rel="openid.delegate" href="https://teonbrooks.com/" />
	<link rel="openid.server" href="https://openid.indieauth.com/openid" />
	<link href="https://github.com/teonbrooks" rel="me">
	<!-- Mastodon -->
	<link href="https://hachyderm.io/@teon" rel="me">
	<!-- Twitter -->
	<meta name="twitter:title" content={siteTitle}>
	<meta name="twitter:description" content={siteDescription}>
	<meta name="twitter:site" content="@teonbrooks">
	<meta name="twitter:image" content={siteImage}>
	<meta name="twitter:card" content="summary_large_image">
	<!-- RSS -->
	<link href="/api/rss.xml" type="application/atom+xml" rel="alternate" title="Teon's Blog Feed">
	<!-- Add Plausible Analytics -->
	<!-- <script defer data-domain="teonbrooks.com" src="https://plausible.io/js/script.js"></script> -->
	<!-- Add Google Analytics -->
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-GREYXSYBVM"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'G-GREYXSYBVM');
	</script>

</svelte:head>

<BusinessCard {...portfolio.id} src={'images/home.jpg'} />
