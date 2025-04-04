<!-- This is the global layout file; it "wraps" every page on the site. (Or more accurately: is the parent component to every page component on the site.) -->
<script>
	import { run } from 'svelte/legacy';

	import { siteTitle, siteDescription, siteImage, siteImageWidth, siteAuthor, siteURL, faviconImage } from '$lib/config';
	// use default svelte-material-ui css
	import '$lib/../../node_modules/svelte-material-ui/bare.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { currentPage, isMenuOpen } from '$lib/assets/js/store';
	import { navItems } from '$lib/config';
	import { preloadCode } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let { data, children } = $props();

	const transitionIn = { delay: 150, duration: 150 }
	const transitionOut = { duration: 100 }
	
	/**
	 * Updates the global store with the current path. (Used for highlighting
	 * the current page in the nav, but could be useful for other purposes.)
	 **/
	run(() => {
		currentPage.set(data.path);
	});

	/**
	 * This pre-fetches all top-level routes on the site in the background for faster loading.
	 * https://kit.svelte.dev/docs/modules#$app-navigation-preloaddata
	 *
	 * Any route added in src/lib/config.js will be preloaded automatically. You can add your
	 * own preloadData() calls here, too.
	 **/
	onMount(() => {
		const navRoutes = navItems.map((item) => item.route);
		preloadCode(...navRoutes);
	});
</script>

<svelte:head>
	<meta name="author" content={siteAuthor}>
	<!-- WIP: clean up and consolidate CSS  -->
	<link rel="stylesheet" href="/css/vars.css" />
	<link rel="stylesheet" href="/css/root.css" />
	<link rel="stylesheet" href="/css/fonts.css" />
	<link rel="stylesheet" href="/css/typography.css" />
	<link rel="stylesheet" href="/css/layout.css" />
	<link rel="stylesheet" href="/css/components.css" />
	<link rel="stylesheet" href="/css/header-and-footer.css" />
	<link rel="stylesheet" href="/css/forms.css" />
	<link rel="stylesheet" href="/css/animation.css" />
	<link rel="stylesheet" href="/css/utilities.css" />
	<link rel="stylesheet" href="/css/code.css" />
	<link rel="stylesheet" href="/css/prism.css" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title={siteTitle}
		href="{siteURL}/api/rss.xml"
	/>
	<!-- Identity -->
	<!-- Indieweb -->
	<link rel="openid.delegate" href="https://teonbrooks.com/" />
	<link rel="openid.server" href="https://openid.indieauth.com/openid" />
	<!-- GitHub -->
	<link href="https://github.com/teonbrooks" rel="me">
	<!-- h-card -->
	<link href="https://teonbrooks.com/" class="h-card u-url u-uid" rel="me" />
	<!-- Bluesky -->
	<link href="https://bsky.app/profile/teon.bsky.social" rel="me" />
	<!-- Bridgy -->
	<link href="https://brid.gy/bluesky/did:plc:yl7wcldipsfnjdww2jg5mnrv" rel="me" />
	<!-- Mastodon -->
	<link href="https://hachyderm.io/@teon" rel="me">
	<!-- Web Mentions -->
	<link rel="webmention" href="https://webmention.io/teonbrooks.com/webmention" />
	<!-- RSS -->
	<link href="/api/rss.xml" type="application/atom+xml" rel="alternate" title="Teon's Blog Feed">
	<!-- Add Peasy Analytics -->
	<script src="https://cdn.peasy.so/peasy.js" data-website-id="01jr0mcj9ds23rexg7w7weqbqs" async></script>
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

<!--
	The below markup is used on every page in the site. The <slot> is where the page's
	actual contents will show up.
-->
<div class="layout" class:open={$isMenuOpen}>
	<Header />
	{#key data.path}
		<main id="main" tabindex="-1" in:fade|global={transitionIn} out:fade|global={transitionOut}>
			{@render children?.()}
		</main>
	{/key}
	<Footer />
</div>
