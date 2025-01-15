<script>
	import { preventDefault } from 'svelte/legacy';

	import MainNav from './MainNav.svelte'
	import HamburgerMenuButton from './HamburgerMenuButton.svelte'
	import { siteTitle } from '$lib/config'
	// TODO: fix social media icons
	// import SocialMedia from './SocialMedia.svelte';

	const focusMain = () => {
		const main = document.querySelector('main');
		main.focus();
	}
</script>


<header>
	<a onclick={preventDefault(focusMain)} class="skip-to-content-link" href="#main">
		Skip to main content
	</a>
	
	<a href="/" class="site-title">
		{siteTitle}
	</a>
	
	<HamburgerMenuButton />
	<!-- Include a row for social media -->
	<!-- <SocialMedia /> -->
	<MainNav />

</header>