<script>
	import { preventDefault } from 'svelte/legacy';

	import MainNav from './MainNav.svelte'
	import HamburgerMenuButton from './HamburgerMenuButton.svelte'
	import { siteTitle } from '$lib/config'

	const focusMain = () => {
		const main = document.querySelector('main');
		main.focus();
	}
</script>


<header class="flex items-center justify-between bg-base-300 px-8 py-10 text-primary md:flex-wrap md:justify-center">
	<a onclick={preventDefault(focusMain)} class="absolute -top-24 left-0 flex h-12 items-center justify-center bg-primary p-[0.5em] text-base-300 opacity-0 no-underline focus:z-10 focus:translate-y-24 focus:opacity-100" href="#main">
		Skip to main content
	</a>
	
	<a href="/" class="block text-center text-[1.4rem] leading-none font-bold text-inherit no-underline hover:underline md:w-full md:text-[1.6rem]">
		{siteTitle}
	</a>
	
	<HamburgerMenuButton />
	<MainNav />

</header>