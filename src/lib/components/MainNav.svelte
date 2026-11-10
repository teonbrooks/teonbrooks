<script>
	import { isMenuOpen } from '../assets/js/store';
	import HamburgerMenuButton from './HamburgerMenuButton.svelte';
	import NavItems from './NavItems.svelte';
</script>

<!-- Contents of this file will be used in the header and the responsive hamburger menu. -->
<nav
	class="fixed inset-0 z-20 flex h-screen w-full items-center justify-center bg-primary text-base-300 transition-all duration-[250ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] md:pointer-events-auto md:visible md:static md:h-auto md:w-auto md:translate-x-0 md:bg-transparent md:text-inherit md:opacity-100 {$isMenuOpen
		? 'visible translate-x-0 opacity-100 pointer-events-auto'
		: 'invisible -translate-x-[100vw] opacity-0 pointer-events-none'}"
>
	<NavItems animate class="m-0 flex list-none flex-wrap justify-center gap-x-6 p-0 md:mx-auto md:mt-4 md:w-max md:border-t md:border-secondary md:pt-2 md:[&_li]:mb-0" />
	<HamburgerMenuButton closeOnly="true" />
</nav>
